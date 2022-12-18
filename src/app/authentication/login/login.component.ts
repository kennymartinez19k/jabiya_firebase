import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { PopoverController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/authServices/auth.service';
import { LangPopoverComponent } from '../lang-popover/lang-popover.component';
import { SAVED_CREDENTIAL } from 'src/app/util/constants';
import { Output, EventEmitter } from '@angular/core';
import { LANGUAGE, ENVVARIABLE } from 'src/app/util/constants';
import { apiUrl, } from '../../util/constants';
// import { environment } from 'src/environments/environment';
import { setUrl, environment } from 'src/environments/settingUrl';
import { ShoppingCartService } from 'src/app/services/cartServices/shopping-cart.service';
import { LandingPageService } from '../../services/landingPageServices/landing-page.service';
import { OrderService } from 'src/app/order.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public selectedLang = 'Spanish';

  languages = [
    { lang: 'Spanish', imagesrc: './././assets/images/Spanish.png' },
    { lang: 'English', imagesrc: './././assets/images/English.png' },
  ];
  signinForm: any;
  showPassword = 'password';
  public loading = false;
  loginClicked = false;
  envVariable = environment.name;
  routeNameUrl = this.router.url

  public languageJson = {
    loginPage: {
      spanish: {
        welcomemsg: 'Entrar a su Cuenta',
        description:
          'Ingrese su correo electrónico y contraseña y presione iniciar sesión para ingresar a su cuenta',
        email: 'Teléfono / Correo electrónico',
        password: 'Contraseña',
        resetPasswordText: '¿Olvidaste tu contraseña?',
        registerAccountText: '¿No tienes una cuenta?',
        registerAccountButtonText: 'Inscríbete',
        loginButtonText: 'Entra a tu cuenta',
        errorMessage: 'Contraseña o nombre de usuario incorrecto',
        servererror:'Error de servidor interno. Por favor intente después de algún tiempo',
        remember: 'Recuérdame',
      },
      english: {
        welcomemsg: 'Login to your account',
        description:
          'Enter your email and password and press login to go into your account',
        email: 'Phone Number / Email',
        password: 'Password',
        resetPasswordText: 'Forgot your password?',
        registerAccountText: 'Don’t have an account?',
        registerAccountButtonText: 'Register',
        loginButtonText: 'Login',
        errorMessage: 'Wrong password or username',
        servererror:'Internal server Error. Please try after sometime',
        remember: 'Remember Me',
      },
    },
  };
  loginSubscription: Subscription;

  constructor(
    private router: Router,
    public popoverController: PopoverController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public toastController: ToastController,
    private landingPageService: LandingPageService,
    private orderService: OrderService,

    private shoppingCartService: ShoppingCartService
  ) {
    let env = localStorage.getItem(ENVVARIABLE)
    if (env) {
      this.envVariable = env
    } else {
      localStorage.setItem(ENVVARIABLE, this.envVariable);
    }

    localStorage.setItem(LANGUAGE, this.selectedLang);
  }
  langSelection(value) {
    const selectedLang = 'Spanish';
    if (value !== null) {
      localStorage.setItem(LANGUAGE, value);
    } else {
      localStorage.setItem(LANGUAGE, selectedLang);
    }
  }
  async langPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LangPopoverComponent,
      cssClass: 'lang-popover-css',
      event: ev,
      backdropDismiss: true,
      showBackdrop: true,
      mode: 'ios',
      translucent: true,
    });
    await popover.present();
    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  navigate(url = '/home') {
    this.router.navigate([url]);
  }



  ngOnInit() {
    localStorage.removeItem('products')
    localStorage.removeItem('CapacitorStorage.userData')
    this.signinForm = this.intializeLoginForm();
    const savedCredential = JSON.parse(localStorage.getItem(SAVED_CREDENTIAL));
    if (savedCredential !== null) {
      this.signinForm.patchValue(savedCredential);
    }
    
  }
  msg(){
    document.location.reload()
  }

  intializeLoginForm(): FormGroup {
    return this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [true],
    });
  }

  envVariableSelection(varible) {
    this.envVariable = varible.detail.value;
    localStorage.setItem(ENVVARIABLE, this.envVariable);
    // setUrl(this.envVariable)
    const dict = {
      prod: import('src/environments/environment.prod'),
      test: import('src/environments/environment.test'),
      erp: import('src/environments/environment.odoo14')
    };

    dict[varible.detail.value].then(result => {
      apiUrl.URL = result.environment.URL;
    });
  }

  isEmail(email){
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(regexEmail)) {
      return true; 
    } else {
      return false; 
    }
  }

  replaceCodeNumber(phoneNumber){
    if (phoneNumber && phoneNumber.indexOf('+1') === 0) {
      phoneNumber = phoneNumber.substring(2);
    }else if (phoneNumber && phoneNumber.indexOf('1') === 0) {
        phoneNumber = phoneNumber.substring(1);
    }

    return phoneNumber
  }

  async getFreeDays(){
    this.orderService.getFreeDays().subscribe((response: any) => {
     localStorage.setItem("freeDays", JSON.stringify(response.result.data))

    },(error: any) => {
     console.log(error)
   })
 }

  login(): void {
    try{
      this.getFreeDays()

    }catch(e){}
    
    this.loading = true;
    this.loginClicked = true;
    const formValues = this.signinForm.value;

    if(!this.isEmail(formValues.login)){
      formValues.login =  this.replaceCodeNumber(formValues.login)
    }

    this.loginSubscription = this.authService.login(formValues).subscribe(
      async (response) => {
        if (formValues.rememberMe) {
          delete formValues.rememberMe;
          localStorage.setItem(SAVED_CREDENTIAL, JSON.stringify(formValues));
        }
        if (response.result.status_response === '200 OK') {
          this.loginClicked = false;
          // await Storage.remove({ key: 'userData' })
          localStorage.removeItem('userData')

          localStorage.setItem('userData', JSON.stringify(response.result.data))


          // await this.getProductByField()
          this.shoppingCartService.getUserData()
          this.navigate();
          this.loading = false;
          
          this.authService.setUser.next();
        }
      },
      (error: any) => {
        this.loginClicked = false;
        this.loading = false;
        console.error('error', error);
        if(error.status===404){
        this.presentToast(
          this.selectedLang === 'Spanish'
            ? this.languageJson.loginPage.spanish.errorMessage
            : this.languageJson.loginPage.english.errorMessage
        );
        }
        else if(error.status===500){
          this.presentToast(
            this.selectedLang === 'Spanish'
              ? this.languageJson.loginPage.spanish.servererror
              : this.languageJson.loginPage.english.servererror
          );
          }
      }
    );
  }

  async getProductByField() {
    this.loading = true;
    this.landingPageService.getProductsForField()
    .subscribe(
      (response) => {
        this.loading = false;
        if (response.result.status_response === '200 OK') {
          localStorage.setItem('products', JSON.stringify(response.result.data))
        }
      },
      (error: any) => {
        this.loading = false;
      }
    );
  }

  loadLang() {
    setTimeout(() => {
      const radios = document.getElementsByClassName('alert-radio-label');
      for (let index = 0; index < radios.length; index++) {
        const singrad = radios[index];
        singrad.innerHTML = singrad.innerHTML.concat(
          '<img src=' +
          this.languages[index].imagesrc +
          ' style="width:24px; position:absolute; right:20px;"/>'
        );
        (singrad as HTMLElement).style.fontSize = '22px';
        (singrad as HTMLElement).style.textTransform = 'uppercase';
      }
    }, 200);
  }
  async presentToast(error) {
    const toast = await this.toastController.create({
      message: error,
      duration: 2000,
    });
    toast.present();
  }

  changePasswordType() {
    this.showPassword = this.showPassword === 'password' ? 'text' : 'password';
  }

  ngOnDestroy() {
    this.unSubscribe(this.loginSubscription);
    this.selectedLang = null;
    this.languages = null;
    this.signinForm = null;
    this.showPassword = null;
    this.loading = null;
    this.languageJson = null;
    this.router = null;
    this.popoverController = null;
    this.formBuilder = null;
    this.authService = null;
    this.toastController = null;
  }

  unSubscribe(subscription: Subscription) {
    if (subscription !== null && subscription !== undefined) {
      subscription.unsubscribe();
    }
  }
}
