/* eslint-disable @typescript-eslint/naming-convention */
import 'capacitor-plugin-app-tracking-transparency'; // only if you want web support
import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { Subscription } from 'rxjs';
import { JabiyaService } from 'src/app/services/jabiyaService/jabiya.service';
import { apiUrl, EMAIL_PATTERN, NUMBER_ONLY_PATTERN } from 'src/app/util/constants';
import { AuthService } from '../../services/authServices/auth.service';
import { LANGUAGE } from 'src/app/util/constants';
import { AlertController, ToastController } from '@ionic/angular';
import { ShoppingCartService } from 'src/app/services/cartServices/shopping-cart.service';
import { Platform } from '@ionic/angular';
// import { AppTrackingTransparency, IOSAppTrackingResponse } from "capacitor-ios-app-tracking"

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit, OnDestroy {

  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('inputSector') inputSector: ElementRef;
  @ViewChild('info') info: ElementRef;
  @ViewChild('titleInfo') titleInfo: ElementRef;
  @ViewChild('subtitleInfo') subtitleInfo: ElementRef;
  @ViewChild('subtitleInfoRes') subtitleInfoRes: ElementRef;


  selectedLang = 'Spanish';
  languages = [
    { lang: 'Spanish', imagesrc: 'assets/images/Spanish.png' },
    { lang: 'English', imagesrc: 'assets/images/English.png' },  
  ];
  public languageJson = {
    regPage: {
      spanish: {
        account: 'Crea una cuenta',
        details: 'Si ya estás registrado, regresar a la pantalla anterior y usa el botón de “Iniciar Sesión”',
        name: 'Nombre',
        fname:' Primer Nombre es requerido',
        lname:'Apellido',
        lnamereq:'Nombre de la Tienda es requerido',
        email:'Correo Electrónico',
        emailin:'Correo Electrónico es Invalid',
        emailreq:'Correo Electrónico es requerido',
        phone:'Teléfono',
        phonereq:'Teléfono es requerido',
        phonein:'Teléfono es invalid',
        storenamee:'Nombre de la Tienda',
        storenameereq:'Nombre de la Tienda es requerido',
        rncStore:'RNC / Cedula del dueño',
        salesNameCode:'Codigo del Asesor',
        salesNameCodereq: 'Codigo del Asesor es requerido',
        code:'Código de la Tienda',
        codereq:'Código de la Tienda es requerido',
        owner:'Nombre del Dueño',
        ownerreq:'Nombre del Dueño es requerido',
        direction:'Dirección (calle y número)',
        directionreq:'Dirección es requerido',
        directionLine1: 'Dirección Física',
        province:'Provincia',
        provincereq:'Provincia es requerido',
        salesPersonreq: 'Asesor es requerido',
        town:'Ciudad',
        townreq:'Ciudad es requerido',
        seller:'Vendedor',
        sellreq:'Vendedor es requerido',
        storetype:'Tipo de Tienda',
        storetypereq:' Tipo de Tienda es requerido',
        signup:'Regístrate',
        selprovince:'Seleccionar Provincia',
        selcity:'Seleccionar Ciudad',
        selsector:'Seleccionar Sector',
        selstore:'Seleccionar Tienda',
        optional: '(opcional)',
        salesPerson: 'Asesor'
      },
      english:{
        account: 'Create an account',
        details: 'If you are already registered, return to the previous screen and use the "Login" button',
        name: 'First Name',
        fname:'First name is required',
        lname:'Last name',
        lnamereq:'Last Name is required',
        email:'Email',
        emailin:'Email is invalid',
        emailreq:'Email is required',
        phone:'Telephone',
        phonereq:'Telephone is required',
        phonein:'Telephone is invalid',
        storenamee:'Store name',
        storenameereq:'Store name is required',
        rncStore:'RNC / Owner Id',
        code:'Store code',
        codereq:'Store code is required',
        owner:'Owner Name',
        ownerreq:'Owner Name is required',
        direction:'Direction',
        directionreq:'Direction is required',
        directionLine1: 'Physical Address',
        province:'Province',
        provincereq:'Province is required',
        salesPersonreq: 'Sales person is required',
        salesNameCode:'Sales person code',
        salesNameCodereq:'Sales Person code is required',
        town:'Town',
        townreq: 'Town is required',
        seller:'Seller',
        sellreq:'Seller is required',
        storetype:'Type of store',
        storetypereq: 'Store type is required',
        signup:'Sign up',
        selprovince:'Select Province',
        selcity:'Select city',
        selsector:'Select Sector',
        selstore:'Select Store',
        optional: '(optional)',
        salesPerson: 'Sales person'

      }
    }
  }
  signupForm: FormGroup;
  localLanguage: any;
  public isSubmitted = false;
  states: any[];
  cities: any[];
  sectors: any[];
  clientTypes: any[];
  getStateSubscription: Subscription;
  getCitySubscription: Subscription;
  getSectorSubscription: Subscription;
  getClientTypeSubscription: Subscription;
  emailVerifySubscription: Subscription;
  permissionSubscription: Subscription;
  salespersons = [ ]
  showSectors = false
  salesPersonType = 'text'
  sectorsFilter = []
  cordova: any
  sectorInfo = {
    id: null,
    name: null
  }
  inputField = ''
  userData = null

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private jabiyaService: JabiyaService,
    private renderer: Renderer2,
    public alertController: AlertController,
    public shoppingCartService: ShoppingCartService,
    public platform: Platform


  ) {
    this.localLanguage = jabiyaService.language;

    this.renderer.listen('window', 'click',(e:Event)=>{
      
     if(
      e.target !== this.toggleButton?.nativeElement 
      && e.target !== this.inputSector?.nativeElement
      && e.target !== this.info?.nativeElement
      && e.target !== this.titleInfo?.nativeElement
      && e.target !== this.subtitleInfo?.nativeElement
      && e.target !== this.subtitleInfoRes?.nativeElement

      ){
      this.showSectors = false;
      this.inputField = null
      this.sectorsFilter = this.sectors
     }
 });
   }

  toggleMenu() {
    this.showSectors = true
  }
  selectSector(sector){
    this.sectorInfo = sector
    this.inputField = null
    this.sectorsFilter = this.sectors
  }

   
  ngOnInit() {
    this.signupForm = this.buildRegistrationForm();
    this.getCurrentLocation();
    this.getStates();
    this.getClientTypes();
    this.getAdviser()
    this.userData = JSON.parse(localStorage.getItem('userData'));
  }

  buildRegistrationForm(): FormGroup {
    return this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [ Validators.pattern(EMAIL_PATTERN)]],
      phone: ['', [Validators.required, Validators.pattern(NUMBER_ONLY_PATTERN)]],
      company_name: ['', Validators.required],
      company_code: '',
      type_client_id: '',
      document_number: ['', Validators.required],
      salesperson: [null, Validators.required],
      adviserCode: '',
      sector_id: [null],
      owner_name: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      latitude: [''],
      longitude: [''],
      address_line_1: ['', Validators.required],
      address_line_2: ''
    });
  }
  langSelection(value) {   
    const selectedLang = 'Spanish';
    if(value !==null){
    localStorage.setItem(LANGUAGE, value);
    }
    else{
      localStorage.setItem(LANGUAGE,selectedLang)
    }
  }
  getStates(): void {
    this.getStateSubscription =
      this.authService.getStates().subscribe((states: any) => {
        this.states = states.result.data.filter(state => state.name === 'Distrito Nacional');
      }, error => {
        console.error('State Fetch Failed: ', error);
      });
  }

  getAdviser(): void {
    this.getStateSubscription =
      this.authService.getAdviser().subscribe((states: any) => {
        this.salespersons = states.result.data
      }, error => {
        console.error('adviser Fetch Failed: ', error);
      });
  }

  getClientTypes(): void {
    this.getClientTypeSubscription =
      this.authService.getClientTypes().subscribe((clientTypes) => {
        this.clientTypes = clientTypes.result.data;
      }, error => {
        console.error('State Fetch Failed: ', error);
      });
  }
  
  async requestPermissions() {
    try{
      const permResult = await Geolocation.requestPermissions();
    }catch(error){
      console.log(error)

    }
  }

  getAppTracking(){
    // AppTrackingTransparency.getTrackingStatus().then((res: IOSAppTrackingResponse ) => console.log(res))
    // AppTrackingTransparency.requestPermission().then((res: IOSAppTrackingResponse) => console.log(res))
    // Response Example
    // { status: "unrequested", value: "00000000-0000-0000-0000-        // 000000000000" }

  }

 
  async getCurrentLocation() {
    console.log(this.platform.is('ios'))
    if(this.platform.is('ios')){
      this.getAppTracking()
    }

    await this.requestPermissions()
    const coordinates = await Geolocation.getCurrentPosition();
    const locCordinates = coordinates.coords;
    // console.log(locCordinates)
    this.signupForm.get('latitude').setValue(locCordinates.latitude.toString());
    this.signupForm.get('longitude').setValue(locCordinates.longitude.toString());
  }

  get errorControl() {
    return this.signupForm.controls;
  }

  saveLogs(params){
    let body = {
    "requestType":  "POST" ,
      "url": apiUrl.URL + apiUrl.AUTH,
      "json": params,
      "datetime": new Date().toISOString(),
      "userId": this.userData.id,
      "subuserId":  this.userData.sub_user_id 
    }

    this.shoppingCartService.saveLogs(body)
      .subscribe(async (res) => {
      },

      (error: any) => {
        console.log(error)
      }
    );

  }


  submit(): void {
    this.isSubmitted = true;
    const formValues = this.signupForm?.value;
    console.log(formValues )
 
    if(!formValues.adviserCode){
      this.jabiyaService.alertCreater('Por favor, Introduzca el codigo del asesor',
        '', 'Ok','');
        return;
    }
    formValues.address_line_2 = ' '
    formValues.company_code = formValues?.lastname + formValues?.phone
    formValues.type_client_id = this.clientTypes[0]?.id
    delete formValues.city;
    delete formValues.state;
    formValues.sector_id = this.sectorInfo?.id


    if (formValues.email == ''){
      formValues.email = formValues.phone + '@flai.com'
    }
    
    if (formValues.latitude === '') {
      this.jabiyaService.alertCreater('Por favor dar permiso a la aplicación para utilizar el GPS',
        this.localLanguage.locationPermissionText, 'Ok',
        'locationPermission');
      this.permissionSubscription = this.jabiyaService.eventTriggerer.subscribe(event => {
          if (event === 'locationPermission') {
            this.getCurrentLocation();
          }
        });
      this.isSubmitted = false;
    } else {
      if (this.signupForm.valid && formValues.sector_id) {
        try{
          this.saveLogs(this.signupForm.value)
        }catch(e){
          console.log(e)
        }
        this.isSubmitted = false;
        this.authService.signUp(this.signupForm.value).subscribe(
          (response) => {
            if (response.result.status_response === '200 OK') {
              this.checkMail(response);
            }
          },
          (error: any) => {
            console.error('SignUp Error: ', error);
            if (error.error.result.coreError === 2001) {
              if( this.selectedLang === 'Spanish'){
              this.jabiyaService.presentToast(
                // eslint-disable-next-line max-len
                'Error: correo electrónico o teléfono duplicado. Cuenta ya registrada:' +
                ' ingrese un nuevo correo electrónico o vaya directamente a la pantalla de inicio de sesión'
              );}
              else
              this.jabiyaService.presentToast(
                // eslint-disable-next-line max-len
                'Error: Duplicate email or phone. Account already registered.' +
                ' Enter a new email or go directly to the login screen'
              );
            } 
            else if(error.error.result.coreError === 2002){
              if( this.selectedLang === 'Spanish'){
                this.jabiyaService.presentToast(
                  // eslint-disable-next-line max-len
                  'Asesor no encontrado'
                );}
                else
                this.jabiyaService.presentToast(
                  // eslint-disable-next-line max-len
                  'Adviser not found'
                );
            }
            else if(error.error.result.coreError === 2004){
              if( this.selectedLang === 'Spanish'){
                this.jabiyaService.presentToast(
                  // eslint-disable-next-line max-len
                  'Codigo de asesor incorrecto, Por favor introduzca uno valido'
                );}
                else
                this.jabiyaService.presentToast(
                  // eslint-disable-next-line max-len
                  'Incorrect adviser code, please enter a valid one'
                );
            }
            else {
              this.jabiyaService.presentToast('error');
            }
            this.isSubmitted = false;
          }
        );
      }else{
      this.isSubmitted = false;
      }
    }
  }

  navigate() {
    this.router.navigate(['/']);
  }

  async checkMail(response) {
    if( this.selectedLang === 'Spanish'){

      const alert = await this.alertController.create({
        header: 'Te has registrado exitosamente',
        message:  `
        <p style="margin:0px">Te enviamos un correo electrónico y un mensaje de texto a tu celular. sigue las instrucciones que tiene, para restablecer tu contraseña temporal.</p>
        <p>O presione el el siguiente boton "Visitar Enlace" para restablecer su contraseña </p>
      `,
        buttons: [{ text: 'Ok', handler: (d) =>  this.navigate() }, { text: 'Visitar Enlace', handler: (d) =>   location.href = response?.result?.data?.invitation_url }]
      });
      await alert.present();
    }
      else{
        const alert = await this.alertController.create({
          header: 'You have successfully registered!',
          message: `
          <p style="margin:0px">We send an email to your account. Please go to your email, and follow The instructions it has, to change your temporary password.</p>
          <p>If not, Press the following "Visit Link" button to reset your password</p>
          `,
          buttons: [{ text: 'OK',  cssClass: 'alertButton', handler: (d) =>  this.navigate() }, { text: 'Visit Link', handler: (d) =>   location.href=response?.result?.data?.invitation_url }]
        });
    
        await alert.present();
     }
    this.emailVerifySubscription =
      this.jabiyaService.eventTriggerer.subscribe(event => {
        if (event === 'emailVerify') {
          this.router.navigate(['/']);
        }
      });
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

  stateSelected(event) {
    
    const stateId = event.target.value;
    this.getCitySubscription =
      this.authService.getCities(stateId).subscribe((cities: any) => {
        this.cities = cities.result.data.filter(city => city.name === 'SANTO DOMINGO CENTRO (DN)');
      }, error => {
        console.error('City Fetch Failed: ', error);
      });
  }

  citySelected(event) {

    const cityId = event.target.value;
    this.getSectorSubscription =
      this.authService.getSectors(cityId).subscribe((sectors: any) => {
        this.sectors = sectors.result.data;
        this.sectorsFilter = [...this.sectors]
      }, error => {
        console.error('Sector Fetch Failed: ', error);
      });
  }
  filterSector(e){
    this.inputField = e.target.value
    let name = e.target.value
    this.sectorsFilter = this.sectors.filter(sector =>  sector.name.toLowerCase().includes(name.toLowerCase()))
    
  }
  ngOnDestroy(): void {
    this.unSubscribe(this.getStateSubscription);
    this.unSubscribe(this.getCitySubscription);
    this.unSubscribe(this.getSectorSubscription);
    this.unSubscribe(this.getClientTypeSubscription);
    this.unSubscribe(this.emailVerifySubscription);
    this.unSubscribe(this.permissionSubscription);
    this.selectedLang = null;
    this.languages = null;
    this.signupForm = null;
    this.localLanguage = null;
    this.isSubmitted = null;
    this.states = null;
    this.cities = null;
    this.sectors = null;
    this.clientTypes = null;

    this.formBuilder = null;
    this.authService = null;
    this.router = null;
    this.jabiyaService = null;
  }

  unSubscribe(subscription: Subscription): void {
    if (subscription !== null && subscription !== undefined) {
      subscription.unsubscribe();
    }
  }
}
