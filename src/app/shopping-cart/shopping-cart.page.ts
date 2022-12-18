import { Component, OnInit } from '@angular/core';
import { LoadingController} from '@ionic/angular'
import { Storage } from '@capacitor/storage';
import { ShoppingCartService } from '../services/cartServices/shopping-cart.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { apiUrl } from '../util/constants';
import * as moment from 'moment-timezone';
import { QueueOrderServices } from '../services/queueServices/queueOrder.service';
import { AuthService } from '../services/authServices/auth.service';
import { LandingPageService } from '../services/landingPageServices/landing-page.service';


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})

export class ShoppingCartPage implements OnInit {
  date = null
  showDeliveryDate = false
  public languageJson = {
    shopPage: {
      spanish: {
        yorder: 'Su Orden',
        deladdress: 'Dirección de Entrega',
        total: 'Totales',
        discount: 'Descuentos por Ofertas',
        discount_from_points: 'Descuentos por Jabiya Pesos',
        dcost: 'Costo de Entrega',
        wouttax: 'Precio Total Sin Impuestos',
        tax: 'Impuestos',
        tprice: 'Precio Total',
        deldate: 'Fecha de Entrega',
        free: 'Entrega en su día semanal asignado - Gratis',
        tommrow: 'Entrega pasado mañana',
        orderfordeliver: 'para esta orden',
        orderpassfivethousand: 'para ordenes mayores de RD$ 5,000.00',
        over: 'El costo de entrega en 48 horas es GRATIS ',
        ptype: 'Tipo de Pago',
        cdelivery: 'Dinero en Efectivo al Entregar',
        order: 'Ordenar',
        freee: 'Gratis',
        selectDate: 'por favor seleccione la fecha',
        pointsYouGet: 'Jabiya Pesos que obtienes con este pedido',
        totalCurrentPoints: 'Jabiya Pesos actuales totales',
        pointsToRedeem: 'Jabiya Pesos a canjear con este pedido',
        totalPointsAfterOrder: 'Jabiya Pesos totales después de realizar este pedido'
      },
      english: {
        yorder: 'Your order',
        deladdress: 'Delivery address',
        total: 'Totals',
        discount: 'Product Discounts',
        discount_from_points: 'Discount from Points',
        dcost: 'Delivery Cost',
        wouttax: 'Total Price Without Tax',
        tax: 'Tax',
        tprice: 'Total price',
        deldate: 'Delivery date',
        free: 'Delivery on your assigned weekly day - Free',
        tommrow: 'Delivery the day after tomorrow',
        over: 'Delivery within 48 hours is free ',
        orderfordeliver: 'for all your orders',
        ptype: 'Payment type',
        cdelivery: 'Cash on Delivery',
        order: 'Order',
        freee: 'free',
        selectDate: 'por favor seleccione la fecha',
        pointsYouGet: 'Points you get with this order',
        totalCurrentPoints: 'Total current points',
        pointsToRedeem: 'Points to redeem with this order',
        totalPointsAfterOrder: 'Total points after placing this order'
      },
    },
  };
  userData: any;
  minPoints: any;
  maxPoints: any;
  modeEnv = ''
  version = null
  orderQueue = []
  errorConnection = false
  momentjs: any = moment;
  setInQueue = false
  loadingProgress = null
  freeDays = []
  isLessMiddleDay = null
  showAlertMinMount = false

  constructor(
    public shoppingCartService: ShoppingCartService,
    public alertController: AlertController,
    public toastController: ToastController,
    private router: Router,
    public queueOrderServices: QueueOrderServices,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private landingPageService: LandingPageService,



  ) { }

  ngOnInit() {
    this.modeEnv = localStorage.getItem('$$envVariable$$')
    this.version = localStorage.getItem('version')
    this.isLessMiddleDay = new Date().getHours() < 12

    
      try{
        this.userData = JSON.parse(localStorage.getItem('userData'));
        this.minPoints = this.userData.minimum_number_points;
        this.maxPoints = this.userData.maximum_number_of_points_to_redeem;
      }catch(err){
        this.router.navigate(['./'])
      }
      
  
  }
  async showLoading() {
    this.loadingProgress = await this.loadingCtrl.create({
      message: 'Enviando informacion...',
      duration: 10000,
      spinner: 'circles',
    });

    this.loadingProgress.present();

  }
  successError(){
    this.errorConnection = false
    this.router.navigate(['/home'])
  }
  round(value){
    if (value == null || value == undefined || value == NaN) value = 0;
    if(typeof(value) == 'string') value = Number(value)

    var formatter = new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    });
    
    return formatter.format(value).replace('DOP', 'RD$');;
  }

  getOrderLines() {
    return this.shoppingCartService.orderLines
  }
  getTotal() {
    return this.shoppingCartService.getResume().total.toFixed(2)
  }
  
  removeProduct(index) {
    this.shoppingCartService.orderLines.splice(index, 1)
  }

  formatDate(date){
    let ymd = this.momentjs(date)
    ymd.locale('es')
    let hour = this.momentjs(date)
    return String(ymd.format('ll')) + ', ' + String(hour.format('LT')) 
  }

  saveLogs(params){
    const httpOptions = {
      withCredentials: true,
    };

    let body = {
      "requestType":  "POST" ,
      "url": apiUrl.URL + apiUrl.PLACE_ORDER,
      "json": params,
      "datetime": new Date().toISOString(),
      "userId": this.userData.id,
      "subuserId":  this.userData.sub_user_id 
    }

    this.shoppingCartService.saveLogs(body)
      .subscribe(async (res) => {
      },

      (error: any) => {
        console.log(error)
      }
    );

  }

  changeDate(setDay = 0) {
    let currentDate = new Date()
    let date = currentDate.setDate(currentDate.getDate() + setDay);
    let value = new Date(date)
    this.date = this.formatDate(value)

    this.shoppingCartService.deliveryDate = value
  }
  activeDeliveryDate(e){
    console.log(e)
  }

 
 

   async getSession() {
    
    return new Promise((resolve, reject) => {
      this.landingPageService.getSession().subscribe(
        (response) => {
          resolve(response.result.data)
        },
        (error: any) => {
          reject(false)
        }
        );
    }) 

   }

   

  async placeOrder() {
    this.showDeliveryDate = false
    await this.showLoading()
    const deliveryDate  = this.momentjs(this.shoppingCartService.deliveryDate).format('YYYY-MM-DD 17:00:00');
    const httpOptions = {
        withCredentials: true,
    };
        
    const params = {
        params: {
            json: {
                products: this.shoppingCartService.orderLines.map(ol => {
                    return { id: ol.productId, add_qty: ol.quantity }
                }),
                additonalInfo: {
                    deliveryDate: deliveryDate ,
                    quantityBoxToReturn: this.shoppingCartService.quantityBoxToReturn
                },
                entered_points: this.shoppingCartService.points,
                datetime: new Date(),
                request_code: String(new Date().getTime()) + '_' + this.userData.company_code,
                user_id: this.userData.sub_user_id
            },
            
        },
    };

    let currentOrder = {params, httpOptions, timeStamp: new Date().toISOString(), try: 0}
    let response = null

    try{
      this.saveLogs(params)
    }catch(e){
      console.log(e)
    }


    this.shoppingCartService.placeOrder(httpOptions, params)
      .subscribe(async (res) => {
        response = res?.result?.status_response
        
        if (res.result.status_response === '200 OK') {
          this.getPointsHistory()
          this.loadingProgress?.dismiss()
          await this.orderPlacedSuccess()
        }
        else{
          this.loadingProgress?.dismiss()
          this.setOrderInQueue(currentOrder)
        }
        this.shoppingCartService.clear()

      },

      (error: any) => {

        this.errorConnection = true
        this.setOrderInQueue(currentOrder)
        this.shoppingCartService.clear()
        this.loadingProgress?.dismiss()
      }
    );

  }

  
  getPointsHistory() {
    
    this.landingPageService.getPointsHistory(this.userData.sub_user_id).subscribe(
      (res) => {
        if (res.result.status_response === '200 OK') {
          this.userData = JSON.parse(localStorage.getItem('userData'));
          this.userData.loyaltyPoints = res?.result?.data?.partner_loyalty_points
          localStorage.setItem("userData", JSON.stringify(this.userData))
        }
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }
  
  async logOut(e = true){
    this.authService.logOut().subscribe(
      (response) => {
        localStorage.removeItem('userData')
        if(e){
          this.router.navigate(['./']);
        }
        
      },
      (error: any) => {
        localStorage.removeItem('userData')
        
        this.router.navigate(['./']);
      }
      );
      
  }


  async selectDeliveryDate(){
    let res
    try{
      res = await this.getSession()
      localStorage.setItem('userData', JSON.stringify(res))
      this.userData = res

    }catch(err){
      console.log(err)
    }

    if(!this.userData.minAmountToOrder ||  Number(this.getTotal()) >= this.userData.minAmountToOrder){
      this.showDeliveryDate = true
    }else{
      this.showAlertMinMount = true
    }
  }


  setOrderInQueue(currentOrder){
    this.setInQueue = true
    this.queueOrderServices.enqueue(currentOrder)
  }

  async presentToast(error) {
    const toast = await this.toastController.create({
      message: error,
      duration: 4000,
    });
    toast.present();

  }

  async orderPlacedSuccess() {
    const alert = await this.alertController.create({
      header: 'Gracias por tu Orden!',
      message:
        'Su orden ha sido recibida y esta en proceso. Puede revisar el estado de la orden dando click en "Mi Cuenta" en el menú.' +
        '<br/><br/>' +
        'Si quieres seguir comprando puedes crear una orden nueva',
      buttons: [
        {
          text: 'OK',
          cssClass: 'primary-solid-btn',
          handler: (d) => this.router.navigate(['/home']),
        },
      ],
    });
    await alert.present();
  }

}
