import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { apiUrl } from 'src/app/util/constants';


@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  constructor(private httpClient: HttpClient) {
  }

  getInvoice() {
    const httpOptions = {
      withCredentials: true,
    };
    const params: any = {};
    return this.httpClient
      .get(apiUrl.URL + apiUrl.GET_INVOICE, httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  getInvoiceInfo(id): Observable<any> {
    const httpOptions = {
      withCredentials: true,
    };
    return this.httpClient.get(apiUrl.URL + apiUrl.GET_INVOICE_INFO + id + '/', httpOptions)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
