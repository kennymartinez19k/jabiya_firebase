import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LANGUAGE } from 'src/app/util/constants';
import { ShoppingCartService } from 'src/app/services/cartServices/shopping-cart.service';
import { InvoiceService } from 'src/app/services/cartServices/invoice.service';
import * as moment from 'moment';
import { Filesystem, Directory, Encoding} from '@capacitor/filesystem'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
// import { FileOpener } from '@ionic-native/file-opener/ngx'
import { Platform } from '@ionic/angular';
import { Browser} from '@capacitor/browser'
@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.scss'],
})
export class BillDetailComponent implements OnInit {
  invoiceDetailRes: any;
  deliveryDate;
  public invoiceLines = [];
  invoiceId;
  getInvoiceSubscription: Subscription;
  orderSubscription: Subscription;
  public language: any;
  public languageJson = {
    billDetails: {
      spanish: {
        paid: 'Factura pagada',
        paydate: 'Fecha de pago',
        geninvoice: 'Factura generada',
        export: 'Exportar (PDF)',
        Product: 'Producto',
        qty: 'Cant',
        tax: 'Impuestos',

      },
      english: {
        paid: 'Invoice Paid',
        paydate: 'Payment Date',
        geninvoice: 'Generated Invoice',
        export: 'Export (PDF)',
        Product: 'Product',
        qty: 'Quantity',
        tax: 'Taxes',
      }
    }
  }
  constructor(public activatedRoute: ActivatedRoute, public invoiceService: InvoiceService, public _shoppingCartService: ShoppingCartService, private pdfGenerator: PDFGenerator, public platform: Platform) {
    this.language = localStorage.getItem(LANGUAGE);
  }

  downloadInvoice(pdfBase64) {
    if(this.platform.is('cordova') || this.platform.is('capacitor')){
      const fileName = 'timesheet' + new Date().getTime() + '.pdf';
      try {
        Filesystem.writeFile({
          path: fileName,
          data: pdfBase64,
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
          recursive: true
        }).then((writeFileResult) => {

          // console.log(writeFileResult)
          // this.fileOpener.open(writeFileResult.uri, 'application/pdf').then( res => {}).catch(error => {
          //   alert('error 2')
          //   console.log('error', error)
          // })
        });
      } catch (error) {
        console.error('Unable to write file', error);
      }
       
    }
    else{
      let heigth = document.getElementById("invoiceDownload").offsetHeight
      var doc = new jsPDF('p', 'mm', [200, heigth])
      let width = doc.internal.pageSize.getWidth();
      let height = doc.internal.pageSize.getHeight();
      console.log(heigth)
      doc.addImage(pdfBase64, 'JPEG', 10, 0, width - 20, heigth - 100 );
      doc.save("invoice.pdf");
    }
  }

  ngOnInit() {
    this.invoiceId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getInvoiceDetails(this.invoiceId);
  }
  getInvoiceDetails(invoiceID) {
    this.getInvoiceSubscription = this.invoiceService.getInvoiceInfo(invoiceID).subscribe(data => {
      console.log(data)
      moment.locale('es')
      this.invoiceDetailRes = data.result.data.invoice;
      this.invoiceDetailRes.invoice_date_to_show =  moment(this.invoiceDetailRes.invoice_date).format("MMMM DD YYYY"); 
      this.invoiceLines = data.result.data.invoice.lines;
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
   downloadPdf(){
    html2canvas(document.querySelector("#invoiceDownload")).then(canvas => {
      let image = canvas.toDataURL('image/png', 1.0);
      this.downloadInvoice(image)
    });
  }
}
