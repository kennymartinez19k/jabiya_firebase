import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/order.service';
import { JabiyaService } from 'src/app/services/jabiyaService/jabiya.service';
import { LANGUAGE } from 'src/app/util/constants';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ShoppingCartService } from 'src/app/services/cartServices/shopping-cart.service';
import * as moment from 'moment';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  public language: any;
  public languageJson = {
    orderDetailPage: {
      spanish:
      {
        detail: 'Detalles del pedido',
        expdel: 'Entrega prevista',
        orderno: 'Número de pedido',
        orderon: 'Ordenado el',
        tax: 'Impuestos',
        save: 'Ahorraste',
        buy: '¿Le gustaría volver a comprar estos productos',
        addall: 'Agregar todos',
        deleteorder: 'Cancelar Orden',
        productUnvailable: 'Lamentablemente no tenemos este Producto disponible',
        status: 'Estado',
        warningorderTo: 'Ordenó la cantidad de',
        warningorderrest: 'pero solo tenemos disponibilidad de'

      },
      english: {
        detail: 'Order details',
        expdel: 'Expected delivery',
        orderno: 'Order number',
        orderon: 'Ordered date',
        tax: 'Taxes',
        save: 'You saved',
        buy: 'Would you like to buy these products again?',
        addall: 'Add all',
        deleteorder: 'Cancel Order',
        productUnvailable: 'Sorry, this product sold out',
        status: 'Status',
        warningorderTo: 'Quantity ordered was',
        warningorderrest: 'but we only have availability of'
      }
    }
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


  routeSubscription: Subscription;
  getOrderSubscription: Subscription;
  orderDetails: any;
  deliveryDate: any;
  isLoading = true;
  orderTaxAmount: any;
  orderSubTotal = 0;
  orderId = null;
  orderTotal = 0;
  savings = 0;
  savingsToShow: any
  orderNumber: any;
  orderSubTotalToShow: any
  productsUnvailable = []
  deliverydateToShow = null
  orderedDate = null
  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    private router: Router,
    private jabiyaService: JabiyaService,
    public _shoppingCartService: ShoppingCartService
  ) { this.language = localStorage.getItem(LANGUAGE); }

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.queryParams.subscribe(params => {
      if (params !== null) {
        moment.locale('es')
        this.deliveryDate = moment(params.deliveryDate).format("MMMM DD YYYY"); ;
        this.deliverydateToShow = params.deliveryDateToShow
        this.orderedDate = params.orderedDate
        this.orderId = params.orderId
        this.getOrderDetails(params.orderId);
        this.getProductUnvailable(params.orderId)
      } else {
        this.jabiyaService.presentToast('Order Not Found');
      }
    });
  }

  getOrderDetails(orderId: number) {
    this.getOrderSubscription =
      this.orderService.getOrderDetails(orderId).subscribe((orderInfo: any) => {
        moment.locale('es')
        this.deliveryDate = moment(orderInfo?.result?.data?.orderDate).format("MMMM DD YYYY");
        this.orderDetails = orderInfo.result.data;
        this.orderNumber = this.orderDetails.orderNumber;
        this.orderTotal += Number(this.orderDetails.total);
        this.orderTaxAmount = Number(Math.round(this.orderDetails.tax * 100) / 100)
        this.savings += this.orderDetails.savings;
        this.orderSubTotal += this.orderDetails.subtotal ;
        this.isLoading = false;
      }, error => {
        console.error('Order fetch API Error: ' + error);
      });
  }

  getProductUnvailable(orderId){
    this.orderService.getProductUnvailable(orderId).subscribe((res: any) => {
      this.productsUnvailable = res.result.data
    })
  }

  cancelOrder() {
    this.getOrderSubscription =
      this.orderService.cancelOrder(this.orderId).subscribe((orderInfo: any) => {
        this.isLoading = false;
        this.router.navigate(['/my-account'])
      }, error => {
        console.error('Order fetch API Error: ' + error);
      });
  }

  async alertCancelOrder() {
    let exception = [
      { type: 'radio', name: 'change_payment_method', label: 'Cambiar la Forma de pago' },
      { type: 'radio', name: 'change_order', label: 'Necesito eliminar o agregar productos de este pedido' },
      { type: 'radio', name: 'duplicate_order', label: 'Pedido duplicado' },
      { type: 'radio', name: 'i_did_not_place_the_order', label: 'Yo no realice este pedido' },
      { type: 'radio', name: 'i_no_longer_need_the_order', label: 'Ya no necesito el pedido' },
      { type: 'radio', name: 'another_reason', label: 'Otra razón' }
    ]
    let msg = ''
    this.language === 'Spanish'
      ? msg = 'Esta seguro que desea cancelar la orden?'
      : msg = 'Are you sure you want to cancel the order?'

    const alert = await this.alertController.create({
      header: msg,
      inputs: [
        { type: 'radio', name: 'change_payment_method', label: 'Cambiar la Forma de pago' },
        { type: 'radio', name: 'change_order', label: 'Necesito eliminar o agregar productos de este pedido' },
        { type: 'radio', name: 'duplicate_order', label: 'Pedido duplicado' },
        { type: 'radio', name: 'i_did_not_place_the_order', label: 'Yo no realice este pedido' },
        { type: 'radio', name: 'i_no_longer_need_the_order', label: 'Ya no necesito el pedido' },
        { type: 'radio', name: 'another_reason', label: 'Otra razón' },
      ],
      buttons: [
        {
          text: 'No',
          cssClass: 'danger-solid-btn',
        },
        {
          text: 'Si',
          cssClass: 'primary-solid-btn',
          handler: (d) =>  this.cancelOrder(),
        },

      ],
    });
    await alert.present();
  }

  ngOnDestroy() {
    this.unSubscribe(this.getOrderSubscription);
    this.unSubscribe(this.routeSubscription);
    this.orderDetails = null;
    this.deliveryDate = null;
    this.isLoading = null;
    this.orderTaxAmount = null;
    this.orderSubTotal = null;
    this.orderTotal = null;
    this.savings = null;
    this.orderNumber = null;
    this.orderId = null;

    this.activatedRoute = null;
    this.orderService = null;
    this.jabiyaService = null;
  }

  unSubscribe(subscription: Subscription) {
    if (subscription !== undefined && subscription !== null) {
      subscription.unsubscribe();
    }
  }
}
