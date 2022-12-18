import { Injectable } from '@angular/core';
import { OrderLine } from 'src/app/interfaces/order-line.interface';
import { Storage } from '@capacitor/storage';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../util/constants';
import { map } from 'rxjs/operators';
    import * as moment from 'moment-timezone';


@Injectable({
    providedIn: 'root',
})
export class QueueOrderServices {
    public orderLines: OrderLine[] = []
    orderQueue = []
    public userData: any;
    momentjs: any = moment;


    constructor(private httpClient: HttpClient) {
        if(!localStorage.getItem('orderQueue')){
            localStorage.setItem('orderQueue', JSON.stringify([])) 
        }
    }

    enqueue(order){
        let elements = JSON.parse(localStorage.getItem('orderQueue'))
        elements.push(order);
        localStorage.setItem('orderQueue', JSON.stringify(elements))
    }
    dequeue = function () {
        let elements = JSON.parse(localStorage.getItem('orderQueue'))
        let result = elements.shift();
        localStorage.setItem('orderQueue', JSON.stringify(elements)) 
        return result;
    }
    peek = function () {
        let elements = JSON.parse(localStorage.getItem('orderQueue'))
        return elements?.length > 0 ? elements[0] : undefined;
    }
    seeLast = function () {
        let elements = JSON.parse(localStorage.getItem('orderQueue'))
        return elements?.length > 0 ? elements[elements.length - 1] : undefined;
    }
    deleteTenTries = function () {
        let elements = JSON.parse(localStorage.getItem('orderQueue'))
        let orders = elements.filter(x => x.try < 10)
        localStorage.setItem('orderQueue', JSON.stringify(orders)) 
    }
    editLast = function (e) {
        let elements = JSON.parse(localStorage.getItem('orderQueue'))
        elements[0] = e
        localStorage.setItem('orderQueue', JSON.stringify(elements)) 
    }

}