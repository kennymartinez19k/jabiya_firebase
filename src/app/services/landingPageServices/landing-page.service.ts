/* eslint-disable max-len */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, catchError, timeout , } from 'rxjs/operators';
import { apiUrl } from 'src/app/util/constants';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LandingPageService {
  constructor(private httpClient: HttpClient) { }

  getProductCategories() {
    // let headers = { headers:  this.getHeadersToken()};
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type': 'application/json',
      // }),
      withCredentials: true,
    };
    return this.httpClient
      .get(apiUrl.URL + apiUrl.GET_CATEGORIES + '?page_size=30&limit=30&page=1',
        httpOptions
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }


  getPointsCategory() {
    const httpOptions = {
      withCredentials: true,
    };
    return this.httpClient
      .get(apiUrl.URL + apiUrl.GET_POINTS_CATEGORY,
        httpOptions
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getSession(){
    let userdata = JSON.parse(localStorage.getItem("userData"))
    let id = userdata?.sub_user_id

    const httpOptions = {
      withCredentials: true,
    };

    return this.httpClient.get(apiUrl.URL + apiUrl.USER + id + "/" + apiUrl.SESSION_INFO, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => { // Error...
          console.log('Hubo un error en services', error)
          return throwError(error || 'Timeout Exception');
      }),
        
      );
   }

  getProductsForField(){
    const httpOptions = {
      withCredentials: true,
    };
    return this.httpClient
      .get(
        apiUrl.URL +
        apiUrl.GET_PRODUCTS_BY_FIELD +
        'id,name/',
        httpOptions
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  getProductDetails(id) {
    const httpOptions = {
      withCredentials: true,
    };
    return this.httpClient
      .get(apiUrl.URL + apiUrl.GET_PRODUCTS + id + '/',
        httpOptions
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getSubProductCategories(id) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type': 'application/json',
      // }),
      withCredentials: true,
    };
    return this.httpClient
      .get(apiUrl.URL + apiUrl.GET_CATEGORIES + '?parentId=' + id,
        httpOptions
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getProductsByCategories(id) {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   'Content-Type': 'application/json',
      // }),
      withCredentials: true,
    };
    return this.httpClient
      .get(apiUrl.URL +
        apiUrl.GET_CATEGORIES +
        id +
        '/product/',
        httpOptions
      )
      .pipe(
        map((res: any) => {
          res.result.data = res.result.data.products.map((obj) => ({
            ...obj,
            amount: 0,
          }));
          return res;
        })
      );
  }
  getProductsByPointsCategory(id) {
    const httpOptions = {
      withCredentials: true,
    };
    return this.httpClient
      .get(apiUrl.URL +
        apiUrl.GET_POINTS_CATEGORY +
        id +
        '/product/',
        httpOptions
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getEasyOrder() {
    const httpOptions = {
      withCredentials: true,
    };
    return this.httpClient
      .get(apiUrl.URL +
        apiUrl.GET_EASY_ORDER + '?page_size=30&limit=30&page=1',
        httpOptions
      )
      .pipe(
        map((res: any) => {
         
          return res;
        })
      );
  }

  getProducts() {
    const httpOptions = {
      withCredentials: true,
    };
    return this.httpClient
      .get(apiUrl.URL +
        apiUrl.GET_PRODUCTS,
        httpOptions
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getBanners(type) {
    
    const httpOptions = {
      withCredentials: true,
    };
    return this.httpClient
      .get(apiUrl.URL + apiUrl.BANNER + type, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPointsHistory(sub_user_id) {
    const httpOptions = {
      withCredentials: true,
    };

    // user/<sub_user_id>/points/history/
    return this.httpClient
      .get(apiUrl.URL + apiUrl.GET_ALL_ACCOUNTS + sub_user_id + "/" + apiUrl.POINTS_HISTORY, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
