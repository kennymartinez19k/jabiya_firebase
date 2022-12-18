/* eslint-disable max-len */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { apiUrl } from './util/constants';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) { }

  getOrders(currentWeek: string[]) {
    let userData = JSON.parse(localStorage.getItem('userData'))
    let id = userData?.sub_user_id
    const url = apiUrl.URL + apiUrl.USER + id + '/' + apiUrl.ORDER;
    let httpParams = new HttpParams();
    if (currentWeek && currentWeek.length == 2)
      httpParams = httpParams.append('from', currentWeek[0]).append('to', currentWeek[1]);

    const httpOptions = {
      withCredentials: true,
      params: httpParams
    };
    return this.httpClient.get(url, httpOptions);
  }

  getFreeDays() {
    const url = apiUrl.URL + apiUrl.FREEDAY;
    
    const httpOptions = {
      withCredentials: true,
    };
    return this.httpClient.get(url, httpOptions);
  }

  getOrderDetails(orderId) {
    const url = apiUrl.URL + apiUrl.ORDER;

    const httpOptions = {
      withCredentials: true,
    };
    return this.httpClient.get(url + orderId + '/' + apiUrl.GET_INVOICE, httpOptions);
  }

  getProductUnvailable(orderId) {
    const url = apiUrl.URL + apiUrl.ORDER;

    const httpOptions = {
      withCredentials: true,
    };
    return this.httpClient.get(url + orderId + '/' + apiUrl.PRODUCT_UNVAILABLE, httpOptions);
  }

  cancelOrder(orderId) {
    const url = apiUrl.URL + apiUrl.ORDER;
    const httpOptions = {
      withCredentials: true,
    };
    return this.httpClient.delete(url + orderId + '/' + "?cancellation_reason=another_reason&another_reason_detail=No deseo la compra", httpOptions);
  }

}
