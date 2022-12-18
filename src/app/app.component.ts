import { Component, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { PopoverController } from '@ionic/angular';
import { AuthService } from './services/authServices/auth.service';
import { JabiyaService } from './services/jabiyaService/jabiya.service';
import { LANGUAGE, ENVVARIABLE } from './util/constants';
import { filter } from 'rxjs/operators';
import { ShoppingCartService } from './services/cartServices/shopping-cart.service';
import { RequestQueueOrderServices } from './services/requestQueueOrderServices/requestQueueOrder.service';
import { MenuController } from '@ionic/angular';
import { setUrl, environment } from '../environments/settingUrl'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { version_jabiya } from 'src/version';




@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {

  widthSize = window.innerWidth;
  showSideBar = this.widthSize > 991

  @HostListener('window:resize', ['$event'])
  
  onResize(event) {
    event.target.innerWidth;
    event.target.innerWidth > 991 ? this.showSideBar = true : this.showSideBar = false
  }

  name = 'Get Current Url Route Demo';
  currentRoute = {};
  online = true
  showMsgOffline = false
  splashScreen = false

  languages = [
    { lang: 'Spanish', imagesrc: './././assets/images/Spanish.png' },
    { lang: 'English', imagesrc: './././assets/images/English.png' },
  ];
  public selectedLang = 'Spanish';
  public appPages = [
    { title: 'Página Principal', icon: 'home-outline', url: 'home' },
    { title: 'Jabiya Pesos', icon: 'gift-outline', url: 'points' },
    { title: 'Ofertas', icon: 'pricetag-outline', url: 'promotions' },
    { title: 'Mi cuenta', icon: 'person-circle-outline', url: 'my-account' },
    { title: 'Configuración', icon: 'settings-outline', url: 'settings' },
    {
      title: 'Cerrar sesión', icon: 'log-out-outline', url: '', action: async () => {
        // await Storage.remove({ key: 'userData' })
        localStorage.removeItem('userData')
        await Storage.clear()
        this.authService.logOut().subscribe(
          (response) => {
          },
          (error: any) => {
            console.error('SignUp Error: ', error);
          }
        );
      }
    },
    // { title: 'Logs', icon: 'list-circle-outline', url: 'logs' }
  ];
  public englishPages = [
    { title: 'Home', icon: 'search-outline', url: 'home' },
    { title: 'Jabiya Coins', icon: 'gift-outline', url: 'points' },
    { title: 'Promotions', icon: 'pricetag-outline', url: 'home' },
    { title: 'My Account', icon: 'person-circle-outline', url: 'my-account' },
    // {
    //   title: 'Indicators of my business',
    //   icon: 'stats-chart-outline',
    //   url: 'home',
    // },
    { title: 'Configuration', icon: 'settings-outline', url: 'settings' },
    // {
    //   title: 'Terms and Conditions',
    //   icon: 'document-outline',
    //   url: 'home',
    // },
    // {
    //   title: 'Privacy Policy',
    //   icon: 'book-outline',
    //   url: 'home',
    // },
    { title: 'Sign off', icon: 'log-out-outline', url: '' },
  ];
  public userData: any;
  public showDropdown = false;
  userSubscription: any;
  public language: any;
  public routeNameUrl = this.router.url == '/'
  // public appLangauge: any;

  constructor(
    public authService: AuthService,
    // private router: Router,
    public shoppingCartService: ShoppingCartService,
    public requestQueueOrderServices: RequestQueueOrderServices,
    private jabiyaService: JabiyaService,
    private route: ActivatedRoute,
    public popoverController: PopoverController,
    private router: Router,
    public menuCtrl: MenuController


  ) {
    this.getVersion()
    this.logs() 
   
    router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentRoute = event;
      });
    // this.setApplicationlanguage();
    this.getUserData();
    this.userSubscription = authService.setUser.subscribe((sub) => {
      this.getUserData();
    });
    this.createCacheFolder();
    requestQueueOrderServices.orderqueue()
  
}

createOnline$() {
return merge<boolean>(
  fromEvent(window, 'offline').pipe(map(() => false)),
  fromEvent(window, 'online').pipe(map(() => true)),
  new Observable((sub: Observer<boolean>) => {
	sub.next(navigator.onLine);
	sub.complete();
  }));
}

  getVersion(){
    let version = Number(localStorage.getItem('version'))
    this.jabiyaService.getVersion().subscribe(res => {
      if(version != res.version){
        setTimeout(() => {
          document.location.reload()
        }, 2000)
      }
    })
  }

  logs(){
   if(!localStorage.getItem('logs')){
     localStorage.setItem('logs', JSON.stringify([]))
   }
  }


  langSelection(value) {
    const selectedLang = 'Spanish';
    if (value !== null) {
      localStorage.setItem(LANGUAGE, value);
    } else {
      localStorage.setItem(LANGUAGE, selectedLang);
    }
  }

 

  async createCacheFolder() {
    try {
      await Filesystem.mkdir({
        directory: Directory.Cache,
        path: `CACHED-IMG`
      });
    } catch (e) {
      console.log("Exception creating CACHED-IMG", e)
    }
  }
  async getUserData() {
    this.language = localStorage.getItem(LANGUAGE);
    this.jabiyaService.getLangauge(this.language).subscribe();
    // const { value } = await Storage.get({ key: 'userData' });
    
    this.userData = JSON.parse(localStorage.getItem('userData'));

  }

  openAndClose() {
    this.showDropdown = !this.showDropdown;
  }

  switchAccount(account) {
    if(account.company_code == this.userData.company_code ){
      return
    }
    this.authService.switchAccountUnderUser(account.store_account_id).subscribe(
      async (res) => {
        if (res.result.status_response === '200 OK') {
          this.navigate();
          // await Storage.set({
          //   key: 'userData',
          //   value: JSON.stringify(res.result.data),
          // });
          localStorage.setItem('userData', JSON.stringify(res.result.data))
        }
      },
      (error: any) => {
        console.error('error', error);
      }
    );
  }

  navigate() {
    this.routeNameUrl = false
    window.location.reload();
    this.language = localStorage.getItem(LANGUAGE);
  }
  ngOnInit() {
	  this.createOnline$().subscribe(isOnline => {
      this.online = isOnline
      if(this.online){
        this.showMsgOffline = true
      }
    });
    if(!localStorage.getItem('userData')) this.router.navigate([''])
  }
  
  ngOnDestroy() {
    this.language = null;
  }

  successError(){
    this.showMsgOffline = false
    let delay = ms => new Promise(res => setTimeout(res, ms));
    delay(15000).then(() => {
      if(!this.online && !this.showMsgOffline){
        this.showMsgOffline = true
      } 
    }) // 2 minutes to seconds
  }

  

  openMenu() {
    this.menuCtrl.open();
  }

  closeMenu() {
    this.menuCtrl.close();
  }
}
