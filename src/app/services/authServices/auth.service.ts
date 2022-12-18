
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { apiUrl } from '../../util/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  setUser = new Subject();
  private accountsUnderUser = new BehaviorSubject(0);

  constructor(private httpClient: HttpClient) { }

  signUp(formValues) {
    const httpOptions = {
      withCredentials: true
    };
    const params: any = { jsonrpc: '2.0', params: formValues };
    return this.httpClient
      .post((apiUrl.URL + apiUrl.AUTH) + apiUrl.SIGNUP, params, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  logOut(){
    const httpOptions = {
      withCredentials: true
    };
    return this.httpClient
      .post((apiUrl.URL + apiUrl.LOGOUT), {}, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  addNewAccount(formValues) {
    const httpOptions = {
      withCredentials: true
    };
    const params: any = { jsonrpc: '2.0', params: formValues };
    return this.httpClient
      .post(apiUrl.URL + apiUrl.ADD_ACCOUNT, params, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  login(formValues) {
    const httpOptions = {
      withCredentials: true
    };
    const params: any = { jsonrpc: '2.0', params: formValues };
    return this.httpClient
      .post(apiUrl.URL + apiUrl.LOGIN, params, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  forgotPassword(formValues) {
    const httpOptions = { withCredentials: true };
    const params: any = { params: {
      email: formValues.login,
      phone: formValues.phone
    } };
    return this.httpClient
      .post(apiUrl.URL + apiUrl.FORGOT_PASSWORD , params, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getStates(): Observable<any> {
    const url = apiUrl.URL+ apiUrl.STATES;
    return this.httpClient.get(url);
  }
  getAdviser(): Observable<any> {
    const url = apiUrl.URL+ apiUrl.ADVICER;
    return this.httpClient.get(url);
  }

  getCities(stateId: number): Observable<any> {
    const url = apiUrl.URL+ apiUrl.CITIES + stateId + '/city/';
    return this.httpClient.get(url);
  }

  getSectors(cityId: number): Observable<any> {
    const url = apiUrl.URL+ apiUrl.SECTOR + cityId + '/sector/';
    return this.httpClient.get(url);
  }

  getClientTypes(): Observable<any> {
    const url = apiUrl.URL + apiUrl.CLIENT_TYPE;
    return this.httpClient.get(url);
  }

  getAllAccountsUnderUser(userId): Observable<any> {
    const httpOptions = {
      withCredentials: true,
    };
    return this.httpClient
      .get(
        apiUrl.URL+ apiUrl.GET_ALL_ACCOUNTS + userId + '/accounts/',
        httpOptions
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  switchAccountUnderUser(accountId): Observable<any> {
    const httpOptions = {
      withCredentials: true,
    };
    const params: any = {};
    return this.httpClient
      .post(
        apiUrl.URL + apiUrl.ADD_ACCOUNT  + accountId + '/login/', params,
        httpOptions
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getAccountsUnderUser() {
    return this.accountsUnderUser;
  }

  updateAccountsUnderUser(accountsUnderUser) {
    this.accountsUnderUser.next(accountsUnderUser);
  }

  editAccount(formValues, id) {
    const httpOptions = {
      withCredentials: true
    };
    const params: any = { params: formValues };
    return this.httpClient
      .patch(apiUrl.URL + apiUrl.GET_ALL_ACCOUNTS + id + '/', params, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  deleteAccount(id){
    const httpOptions = {
      withCredentials: true
    };
    return this.httpClient
      .delete(apiUrl.URL + apiUrl.DELETE_ACCOUNT + id + '/', httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getSessionInfo() {

   
    let userdata = JSON.parse(localStorage.getItem("userData"))
    let id = userdata?.sub_user_id

    const httpOptions = {
      withCredentials: true,
    };

    return this.httpClient.get(apiUrl.URL + apiUrl.USER +  id + "/" + apiUrl.SESSION_INFO, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
