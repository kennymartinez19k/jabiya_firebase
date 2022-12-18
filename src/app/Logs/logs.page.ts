import { Component, OnInit } from '@angular/core';
import { LANGUAGE } from 'src/app/util/constants';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit {
  momentjs: any = moment;
  public languageJson = {
    logsPage: {
      spanish: {
        header: 'Logs',
        title: '',
        subtitle: 'Logs al tratar de realizar pedidos',
        listErrors: 'Listado de errores',
        description: 'Descripción',
        date: 'Fecha',
        moreDetails: 'Mas detalles',
        noErrors: 'No Hay Logs para mostrar',
        sendInfotoBackend: 'Enviando informacion a backend',
        qtyProducts: 'Carrito tiene',
        products: 'producto(s)',
        delete: 'Borrar lista',
        setInQueue: 'Agregue la orden al queue',
        messageOk: 'Order fue creada satisfactoriamente',
        cartEmpty: 'Vaciamos el carrito',
        currentOrder: 'Obtuvimos la orden actual',
        hasError: 'Hubo un error',
        pushPlaceOrder: 'Presioné boton "ordenar"',
        setParams: 'Obtuve los parametros',
        params: 'Parametros',
        longMessage: 'Respuesta Completa'


      },
      english: {
        header: 'Logs',
        title: '',
        subtitle: 'Logs when trying to place orders',
        listErrors: 'Error list',
        description: 'Description',
        date: 'Date',
        moreDetails: 'More details',
        noErrors: 'There are no logs to show',
        sendInfotoBackend: 'Sending info to backend',
        qtyProducts: 'Shopping cart has',
        products: 'product(s)',
        delete: 'Delete list',
        setInQueue: 'Set order in queue',
        messageOk: 'Order was created',
        cartEmpty: 'Cart is empty',
        currentOrder: 'catch current order',
        hasError: 'Has a error',
        pushPlaceOrder: 'Press button "order"',
        setParams: 'Set params',
        params: 'Params',
        longMessage: 'Full Response'




      }
    }
  };
  public language: any;
  logs = []
  reload = true
 
  constructor() {
    this.language = localStorage.getItem(LANGUAGE);
    const userData = JSON.parse(localStorage.getItem('userData'))
  }

  ngOnInit() {
    this.logs = JSON.parse(localStorage.getItem('logs'))
  }

  setReload(){
    this.reload = true
    this.logs = JSON.parse(localStorage.getItem('logs'))
    setTimeout(() => {
      this.reload = false
    }, 800)
  }
  deleteList(){
    this.logs = []
    localStorage.setItem('logs', JSON.stringify(this.logs))
  }
  formatDate(val){
    let date = new Date(val)
    let ymd = this.momentjs(date)
    ymd.locale('es')
    let hour = this.momentjs(date)
    return String(ymd.format('ll')) + ', ' + String(hour.format('LT')) 
  }
}
