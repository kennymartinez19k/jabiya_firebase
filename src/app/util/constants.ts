/* eslint-disable @typescript-eslint/naming-convention */

export const SAVED_CREDENTIAL = '$$Jabilla_Saved_Credential$$';
export const EMAIL_PATTERN = /^\w+([\.\--]?\w+)*@\w+(\-]?\w+)*(\.-]?\w+)*(\.\w{2,3})+$/i;
export const NUMBER_ONLY_PATTERN = /^\d+$/;
export const SPANISH_MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
export const LANGUAGE = '$$language$$';
export const ENVVARIABLE = '$$envVariable$$';
import { setVersion } from 'src/version';
import { environment, setUrl }  from '../../environments/settingUrl';

let hostname = window.location.hostname

// if(hostname == 'jabiyaprodapp.flai.com.do' || hostname == 'webapp.jabiya.com' || hostname == 'app.jabiya.com' || hostname == 'services.flai.com.do'){
// }else{
//   setUrl('test')
// }
setUrl('test')

setVersion('4.2')  // 04/11/22 

export const apiUrl = {
  /* USER_INFO */
  GET_CATEGORIES: 'category/',
  GET_EASY_ORDER: 'order_easy/',
  GET_POINTS_CATEGORY: 'points/category/',

  /* USER_INFO */
  LOGIN: 'auth/sign_in/',
  FORGOT_PASSWORD: 'password/reset/', 
  SIGNUP: 'sign_up/',
  STATES: 'address/country/61/state/',
  CITIES: 'address/state/',
  SECTOR: 'address/city/',
  CLIENT_TYPE: 'client/type/',
  GET_ALL_ACCOUNTS: 'user/',
  ADD_ACCOUNT: 'account/',
  DELETE_ACCOUNT: 'account/',
  SESSION_INFO: 'session/',
  USER: 'user/',

  /* PRODUCT */

  GET_PRODUCTS: 'product/',
  GET_PRODUCTS_BY_FIELD: 'product/fields/',


  /* CART */
  ADD_ITEM: 'cart/',
  UPDATE_ITEM: 'cart/update/',
  GET_CART: 'cart/current_order/',
  GET_INVOICE: 'invoice/',
  GET_INVOICE_INFO: 'invoice/',
  PLACE_ORDER: 'queue/',
  PLACE_EASY_ORDER: 'cart/products/',
  POINTS_COUNT: 'points/count/',
  POINTS_HISTORY: 'points/history/',
  
  USER_POINTS: 'user/points/',
  AUTH: 'auth/',
  LOGOUT: 'auth/logout/',


  /* ORDER */
  ORDER: 'order/',
  PRODUCT_UNVAILABLE: 'unavailable/product/',


  /* GENERAL */
  BANNER: 'banner/',
  URL: environment.url,
  ENVVARIABLE: '$$envVariable$$',


  /* FREE DAYS */
  FREEDAY: 'free/day/',

  VERSION: 'app/version/',
  ADVICER: 'adviser/',
  SESSION: 'auth/session/',


  // Logs
  SAVELOGS: 'http://3.19.38.230:3333/log'
};

