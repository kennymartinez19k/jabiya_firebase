import { Component, OnDestroy, OnInit,  Output , EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/order.service';
import { JabiyaService } from 'src/app/services/jabiyaService/jabiya.service';
import { LANGUAGE } from 'src/app/util/constants';
import { LandingPageService } from '../../services/landingPageServices/landing-page.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {

  @Output() passSessionExpired = new EventEmitter();
  public language: any;
  orders = [];
  futureOrders = [];
  weekDays: any[];
  reload = false
  public static dateOptions = { year: 'numeric', month: 'long', day: 'numeric' } as const;
  
  date = {
    fromDate: null,
    toDate: null
  }
  currentWeekdays = []
  sessionExpired = false
  public languageJson = {
    orderPage: {
      spanish:
      {
        delivery: 'Próxima entrega',
        noorder: 'No se encontraron pedidos',
        todaydel: 'Entrega(s) prevista(s) para hoy',
        noInvoices: 'Esta orden no posee factura',
        orderno: 'Número de pedido',
        orderon: 'Ordenado el',
        seedetail: 'ver detalles',
        all: 'Órdenes hechas la semana seleccionada: ',
        recent: 'Organizadas por fecha de entrega',
        recentorderwait: 'Nota: Si su orden no aparece, podría estar todavía en proceso. Por favor vuelva a esta página en unos minutos',
        invoice: 'De factura',
        orderdate: 'Ordenado el',
        exdelivery: 'Entrega prevista',
        status: 'Estado'
      },
      english: {
        delivery: 'Next Delivery',
        noorder: 'No Order found',
        todaydel: 'Delivery scheduled for today',
        orderno: 'Order number',
        orderon: 'Order On',
        seedetail: 'See Details',
        all: 'All Orders',
        recent: 'Starting with the most recent installment',
        recentorderwait: 'If you order doesn\'t appear, it may still be processing, check later',
        invoice: 'Invoice',
        orderdate: 'Ordered date',
        exdelivery: 'Expected Delivery',
        status: 'Status'
      }
    }
  };
  getOrdersSubscription: Subscription;

  constructor(
    
    private jabiyaService: JabiyaService,
    private router: Router,
    private orderService: OrderService,
    private landingPageService: LandingPageService
    ) {
    this.weekDays = this.getCurrentWeek();
    this.language = localStorage.getItem(LANGUAGE);
  
  }
  setReload(){

    this.reload = true
    if(this.currentWeekdays.length > 0){
      this.getAllOrders(this.currentWeekdays)
    }else{
      this.weekDays = this.getCurrentWeek();
      const curr = new Date();
      const first = curr.getDate() - curr.getDay();
      const last = first + 6;
      this.getAllOrders([this.jabiyaService.getGeneralFormatDate(new Date(curr.setDate(first))),
      this.jabiyaService.getGeneralFormatDate(new Date(curr.setDate(last)))]);
    }
    setTimeout(() => {
      this.reload = false
    }, 800)

  }


  getSession() {
    this.landingPageService.getSession().subscribe(
      (response) => {},
      
      (error: any) => {
        this.passSessionExpired.emit(true);
        console.log('error', error.error);
      }
    );
  }


  ngOnInit() {
    const curr = new Date();
    const first = curr.getDate() - curr.getDay();
    const last = first + 6;
    this.getAllOrders([this.jabiyaService.getGeneralFormatDate(new Date(curr.setDate(first))),
    this.jabiyaService.getGeneralFormatDate(new Date(curr.setDate(last)))]);
  }

 

  getCurrentWeek() {
    const curr = new Date();
    const year = curr.getFullYear();
    const prevMonth = new Date(year, curr.getMonth() - 6, 1);
    const nextMonth = new Date(year, curr.getMonth() + 6, 0);
    return [this.jabiyaService.getGeneralFormatDate(prevMonth),
    this.jabiyaService.getGeneralFormatDate(nextMonth)];
  }

  checkForTodayDeliverable(orders: any[]) {
    const today = new Date();
    return orders.filter(order => order.deliveryDate.getFullYear() === today.getFullYear() &&
      order.deliveryDate.getMonth() === today.getMonth() &&
      order.deliveryDate.getDate() === today.getDate()
    );
  }

  getAllOrders(currentWeek: string[]) {
    this.getSession()
    moment.locale('es')
    this.currentWeekdays = currentWeek
    if (!currentWeek) return;
    this.date.fromDate = moment(currentWeek[0]).format("MMMM DD");
    this.date.toDate = moment(currentWeek[1]).format("MMMM DD");
    this.getOrdersSubscription = this.orderService.getOrders(currentWeek).subscribe((res: any) => {
      const orders = res.result.data.orders;
      this.futureOrders = orders.filter((order: any) => order.deliveryDate === '');
      const deliveryOrders = orders.filter((order: any) => order.deliveryDate !== '');
      deliveryOrders.forEach(order => {
        
        const create_date = new Date(order.create_date);
        order.create_date_to_show = create_date.toLocaleDateString('es-ES', OrdersComponent.dateOptions)
        const deliveryDate = new Date(order.deliveryDate);
        order.delivery_date_to_show = deliveryDate.toLocaleDateString('es-ES', OrdersComponent.dateOptions) 
        order.deliveryDate = new Date(order.deliveryDate);
        order.create_date = new Date(order.create_date);
      });
      this.orders = this.checkForTodayDeliverable(deliveryOrders);
      this.orders.forEach(order => {
        const create_date = new Date(order.create_date);
        order.create_date_to_show = create_date.toLocaleDateString('es-ES', OrdersComponent.dateOptions)
        const deliveryDate = new Date(order.deliveryDate);
        order.delivery_date_to_show = deliveryDate.toLocaleDateString('es-ES', OrdersComponent.dateOptions) 
        order.deliveryDate = new Date(order.deliveryDate);
        order.create_date = new Date(order.create_date);
      })

      const futureOrders = deliveryOrders.filter(order => !this.orders.includes(order));
      this.futureOrders = this.futureOrders.concat(futureOrders);
      this.dateTranformation(this.orders);
      this.dateTranformation(this.futureOrders);
    }, error => {

      if(error.status == 403){}

    });
  }

  round(value){
    if (!value || typeof(value) != 'number') return value;
    if (value == NaN ) return 0;

    var formatter = new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    });
    
    return formatter.format(value).replace('DOP', 'RD$');;
  }

  dateTranformation(values) {
    values.forEach(order => {
      order.deliveryDate = this.jabiyaService.getExpandedDate(order.deliveryDate);
      order.create_date = this.jabiyaService.getExpandedDate(order.create_date);
      const create_date = new Date(order.create_date);
      order.create_date_to_show = create_date.toLocaleDateString('es-ES', OrdersComponent.dateOptions)
      const deliveryDate = new Date(order.deliveryDate);
      order.delivery_date_to_show = deliveryDate.toLocaleDateString('es-ES', OrdersComponent.dateOptions) 
    });
  }

  gotoOrderDetail(order: any) {
    // if(order?.has_invoice == false){
    //   return
    // }
    const navigationExtras = {
      queryParams: {
        orderId: order.id,
        deliveryDate: order.deliveryDate,
        deliveryDateToShow: order.delivery_date_to_show,
        orderedDate: order.create_date_to_show
      },
      skipLocationChange: true
    };
    this.router.navigate(['/my-account/orderDetails/'], navigationExtras);
  }

  getValueForDate(dateValue) {
    this.getAllOrders(dateValue);
  }

  ngOnDestroy() {
    this.unSubscribe(this.getOrdersSubscription);
    this.orders = null;
    this.language = null;
    this.futureOrders = null;
    this.weekDays = null;
    this.languageJson = null;

    this.jabiyaService = null;
    this.router = null;
    this.orderService = null;
  }

  unSubscribe(subscription: Subscription) {
    if (subscription !== null && Subscription !== undefined) {
      subscription.unsubscribe();
    }
  }

}
