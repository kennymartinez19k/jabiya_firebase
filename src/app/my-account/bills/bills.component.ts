import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from 'src/app/services/cartServices/invoice.service';
import { LANGUAGE } from 'src/app/util/constants';
@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss'],
})
export class BillsComponent implements OnInit {
  public language: any;
  public static dateOptions = { year: 'numeric', month: 'long', day: 'numeric' } as const;
  public invoiceRes = [];
  currentPage: number = 1;
  public languageJson = {
    billPage: {
      spanish: {
        inv: 'De factura',
        date: 'Fecha'
      },
      english: {
        inv: 'Invoice',
        date: 'Date'
      }
    }
  }
  constructor(private router: Router, public invoiceService: InvoiceService) {
    this.language = localStorage.getItem(LANGUAGE);
  }
  gotoBillDetails(id) {
    this.router.navigate(['/my-account/billDetails/' + id]);
  }
  ngOnInit() {
    this.getInvoiceDetails();
  }
  getInvoiceDetails() {
    this.invoiceService.getInvoice().subscribe(
      response => {
        this.invoiceRes = response.result.data.invoices;
        for (let i = 0; i < this.invoiceRes.length; i++) {
          const invoice = this.invoiceRes[i];
          const invoice_date = new Date(invoice.invoice_date);
          invoice.invoice_date = invoice_date.toLocaleDateString('es-ES', BillsComponent.dateOptions)
        }
      })
    
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
}
