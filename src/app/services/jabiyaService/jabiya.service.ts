import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { map, catchError, timeout , } from 'rxjs/operators';
import { apiUrl } from 'src/app/util/constants';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class JabiyaService {
  eventTriggerer = new Subject();
  language: any;
  languageName = '';
  engMonth = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  constructor(
    private httpClient: HttpClient,
    public toastController: ToastController,
    public alertController: AlertController
  ) { }

  async alertCreater(header: string, message: string, text: string, event: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text, cssClass: 'primary-solid-btn',
        handler: (d) => {
          this.eventTriggerer.next(event);
        }
      }],
    });
    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'middle',
      color: 'danger',
    });
    toast.present();
  }

  getLangauge(language: string) {
    const languageFilePath = '../../../assets/language.json';
    return this.httpClient.get(languageFilePath)
      .pipe(map((res: any) => {
        const filterLang = res.filter((lang: any) => lang.language === language);
        if (filterLang.length > 0) {
          this.languageName = language;
          this.language = filterLang[0].values;
        } else {
          this.language = res.filter((lang: any) => lang.language === 'Spanish')[0].values;        
          this.languageName = 'Spanish';
        }
        return res;
      }));
  }

  getExpandedDate(date) {
    if (this.checkValid(date)) {
      date = new Date(date);
      const year = date.getFullYear();
      const month = this.engMonth[date.getMonth()];
      const day = date.getDate();
      return `${day} ${month}, ${year}`;
    } else {
      return '';
    }
  }

  getGeneralFormatDate(date: Date) {
    date = new Date(date);
    const year = date.getFullYear();
    const month = this.engMonth[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}, ${year}`;
  }

  getRangeFormatDate(date: Date, type) {
    date = new Date(date);
    const year = date.getFullYear();
    // const month = this.engMonth[date.getMonth()];
    const month =  this.language.months[date.getMonth()];
    const day = date.getDate();
    if (type === 'from') {
      return `${month} ${day} - `;
      } else {
        return `${month} ${day}, ${year}`;
      }
  
  }

  checkValid(value: any) {
    return value !== null && value !== undefined && value !== '' ? true : false;
   }

  getVersion(){
    let jabiya = document.location.origin
    return this.httpClient.get(jabiya + '/' + 'assets/version.json' )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
   }


  
   
  
}
