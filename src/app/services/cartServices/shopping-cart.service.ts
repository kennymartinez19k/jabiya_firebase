import { Injectable } from '@angular/core';
import { OrderLine } from 'src/app/interfaces/order-line.interface';
import { Storage } from '@capacitor/storage';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../util/constants';
import { catchError, map, timeout } from 'rxjs/operators';
    import * as moment from 'moment-timezone';
import { QueueOrderServices } from '../queueServices/queueOrder.service';
import { throwError } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class ShoppingCartService {
    public orderLines: OrderLine[] = []
    public deliveryCost: 0
    public maxDeliveryCost: 0
    public points: number = 0
    public loyaltyPointsToRedeem: number = 0
    public clientloyaltyPoints: number = 0
    public maxNumberPointsToReedem: number = 0
    public deliveryDate: Date = new Date();
    public quantityBoxToReturn: number = 0;
    orderQueue = []
    public userData: any;
    momentjs: any = moment;


    constructor(private httpClient: HttpClient,  public queueOrderServices: QueueOrderServices) {
        this.getUserData()
    }

    getUserData() {
            
            const userData = JSON.parse(localStorage.getItem('userData'))
            let cart = JSON.parse(localStorage.getItem(`shoppingCart${userData?.company_code}`))
            if(cart){
                this.orderLines = cart
            }else{
                this.orderLines = []
            }
            if (userData) {
                this.userData = userData
                this.deliveryCost = userData.delivery_cost;
                this.maxDeliveryCost = userData.max_delivery_cost;
                this.loyaltyPointsToRedeem = userData.point_redeem_value
                this.maxNumberPointsToReedem = userData.maximum_number_of_points_to_redeem
                this.clientloyaltyPoints = userData.loyaltyPoints
            }
    }

    addOrderLine(orderLine: OrderLine) {
        this.orderLines.push(orderLine)
        localStorage.setItem(`shoppingCart${this.userData.company_code}`, JSON.stringify(this.orderLines))
    }
    getCostFromOrderLines() {
        let totalPriceWithoutTax = 0, tax = 0, total = 0, discountByPromotions = 0;

        this.orderLines.forEach((orderLine) => {
            totalPriceWithoutTax += (orderLine.price_before_tax * orderLine.quantity);
            tax += (orderLine.price - orderLine.price_before_tax) * orderLine.quantity;
            total += orderLine.price * orderLine.quantity;
            discountByPromotions += (orderLine.oldPrice - orderLine.price) * orderLine.quantity;
        });

        let deliveryCost = total >= this.maxDeliveryCost ? 0 : this.deliveryCost;
        return { deliveryCost, totalPriceWithoutTax, tax, total, discountByPromotions };
    }

    getResume() {
        let { deliveryCost, totalPriceWithoutTax, tax, total, discountByPromotions } = this.getCostFromOrderLines();
        let discountByPoints = this.loyaltyPointsToRedeem * this.points

        return {
            discountByPromotions,
            discountByPoints,
            deliveryCost: null,
            totalPriceWithoutTax: totalPriceWithoutTax + deliveryCost - discountByPoints,
            tax,
            total: total + deliveryCost - discountByPoints
        }
    }

    getPointDefinition() {
        let user = JSON.parse(localStorage.getItem("userData"))

        return {
            currentOrderPoints: this.getPointFromOrder(),
            currentClientPoints: user?.loyaltyPoints

        }
    }
    sendOrder(order){
        return this.httpClient
        .post(apiUrl.URL + apiUrl.PLACE_ORDER, order.params, order.httpOptions)
        .pipe(map((res: any) => {}))
    }

    clear(){
        this.orderLines = []
        localStorage.removeItem(`shoppingCart${this.userData.company_code}`)

        if (this.points > 0) {
            this.userData.loyaltyPoints -= this.points
            this.points = 0
            localStorage.setItem('userData', JSON.stringify(this.userData))
            
        }
    }

    placeOrder(httpOptions, params) {
        if(this.orderLines.length > 0){
            return this.httpClient
                .post(apiUrl.URL + apiUrl.PLACE_ORDER, params, httpOptions)
                .pipe(
                    timeout(600000),
                    map((res: any) => {
                        return res;
                    }),
                    catchError((error) => { // Error...
                        console.log('Hubo un error en services')
                        return throwError(error || 'Timeout Exception');
                    }),
                );
        }
    }

    saveLogs(params) {
        return this.httpClient
            .post(apiUrl.SAVELOGS , params)
            .pipe(
                map((res: any) => {
                    return res;
                }),
            );
    }


    getPointFromOrder() {
        let plus_points = 0.0
        for (let i = 0; i < this.orderLines?.length; i++) {
            const line = this.orderLines[i];
            for (let cont = 0; cont < line?.productCategories?.length; cont++) {
                const c = line?.productCategories[cont];
                if (c.minimumAmount > 0)
                     plus_points += (line.price_before_tax / c.minimumAmount) * line.quantity
                     
            }
        }
       
        return Math.floor(plus_points)
    }
}