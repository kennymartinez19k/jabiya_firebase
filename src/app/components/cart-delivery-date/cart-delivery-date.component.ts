import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment-timezone';
import { ShoppingCartService } from 'src/app/services/cartServices/shopping-cart.service';
import { OrderService } from 'src/app/order.service';

@Component({
  selector: 'app-cart-delivery-date',
  templateUrl: './cart-delivery-date.component.html',
  styleUrls: ['./cart-delivery-date.component.scss'],
})
export class CartDeliveryDateComponent implements OnInit {
  public minDate: Date;
  momentjs: any = moment;
  required = false
  date = null
  sunday = 0
  public static dateOptions = {weekday: 'long',  day: 'numeric', month: 'long'} as const;
  currentDate = null
  tomorrowDate = null
  pastTomorrowDate = null
  freeDays = []
  datesToDeliver = []
  isLessMiddleDay = false
  constructor(public shoppingCartService: ShoppingCartService, private orderService: OrderService) {
    shoppingCartService.deliveryDate.setDate(new Date().getDate() + 2)
    this.minDate = shoppingCartService.deliveryDate
    this.momentjs.tz.setDefault('America/Santo_Domingo');
    this.momentjs.locale('es')
  }

  async ngOnInit() { 
    this.date = this.formatDate(this.shoppingCartService.deliveryDate)
    await this.getFreeDays()
    
  }

  async getFreeDays(){
     this.orderService.getFreeDays().subscribe((response: any) => {
      this.freeDays = response.result.data
      this.isLessMiddleDay = new Date().getHours() < 12
      
      // this.currentDate = this.getDate()
      this.tomorrowDate = this.getDate(1)
      this.pastTomorrowDate = this.getDate(2)

      this.changeDate(this.tomorrowDate)

     },(error: any) => {

      console.log(error)
    })
  }

  formatDate(date) {
    const stringDate = this.momentjs(date).format('dddd DD MMMM, YYYY');
    return stringDate.charAt(0).toUpperCase() + stringDate.slice(1)
  }
  DateFormat(date, msg = ''){
    return date.toLocaleDateString('es-ES', CartDeliveryDateComponent.dateOptions)
  }
  getDate(setDay = 0) {
    let userData = JSON.parse(localStorage.getItem('userData'))
    let date = null
    let currentDate = new Date(userData.current_time)
    date = new Date(currentDate.setDate(currentDate.getDate() + setDay));
    while (true){
      if(
        date.getDay() === this.sunday ||
        this.freeDays.find(dt => this.DateFormat(new Date(dt.day)) == this.DateFormat(date))
        || (this.datesToDeliver.find(x => x == this.formatStringDate(date)))
      ){
        let currentDate = new Date(date)
        date = new Date(currentDate.setDate(currentDate.getDate() + 1)); 
      }else{
        break
      }
    }
    
    const stringDate = this.momentjs(date).format('dddd DD MMMM');
    let result =  stringDate.charAt(0).toUpperCase() + stringDate.slice(1)
    this.datesToDeliver.push(result)
    let response = {date, message: result}
    return response
  }
  formatStringDate(date){
    const stringDate = this.momentjs(date).format('dddd DD MMMM');
    return stringDate.charAt(0).toUpperCase() + stringDate.slice(1)
  }
  changeDate(date) {
    let currentDate = new Date(date.date)
    this.date = this.formatDate(currentDate)
    this.shoppingCartService.deliveryDate = currentDate
  }
  
  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();

    return utcDay !== 0 && utcDay !== 6;
  }
}
