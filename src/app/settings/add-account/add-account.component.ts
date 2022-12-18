/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/authServices/auth.service';
import { Geolocation } from '@capacitor/geolocation';
import { JabiyaService } from 'src/app/services/jabiyaService/jabiya.service';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { LANGUAGE } from 'src/app/util/constants';
@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss'],
})
export class AddAccountComponent implements OnInit, OnDestroy {
  // selectedLang = 'spanish';
  public languageJson = {
    addaccPage: {
      spanish: {
        account: 'Añadir Cuenta',
        details: 'Por favor proporcione los siguientes detalles',
        code: 'Código de la Tienda',
        codereq:' Código de la Tienda is required',
        storename:'Nombre de la Tienda',
        storereq:'Nombre de la Tienda is required',
        direction:'Dirección',
        dirreq:'Dirección is required',
        directionLine1: 'Dirección Fisica',
        province:'Provincia',
        proreq:'Provincia is required',
        town:'Ciudad',
        townreq:'Ciudad is required',
        seller:'Vendedor',
        storetype:'Tipo de Tienda',
        typereq:'Tipo de Tienda is required',
        add:'Agregar',
        cancel:'cancelar',
        selprovince:'Seleccionar Provincia',
        selcity:'Seleccionar Ciudad',
        selsector:'Seleccionar Sector',
        selstore:'Seleccionar Tienda',
        salesPerson: 'Asesor'
      },
      english:{
        account: 'Add Account',
        details: 'Please provide the following details',
        code: 'Store Code',
        codereq:'Store Code is required',
        storename:'Store name',
        storereq:'Store Name is required',
        direction:'Direction',
        dirreq:'Address is required',
        directionLine1: 'Physical Address',
        province:'Province',
        proreq:'Province is required',
        town:'Town',
        townreq:'Town is required',
        seller:'Seller',
        storetype:'Type of store',
        typereq:'Store type is required',
        add:'Add',
        cancel:'cancel',
        selprovince:'Select Province',
        selcity:'Select city',
        selsector:'Select Sector',
        selstore:'Select Store',
        salesPerson: 'Adviser'

      }
    }
  }
  public language:any;
  states: [];
  cities: [];
  sectors: [];
  clientTypes: [];
  salespersons = [ ]
  public isSubmitted = false;

  public userData: any;
  signupForm: FormGroup;
  getStateSubscription: Subscription;
  getCitySubscription: Subscription;
  getSectorSubscription: Subscription;
  getClientTypeSubscription: Subscription;
  emailVerifySubscription: Subscription;
  permissionSubscription: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private jabiyaService: JabiyaService,
    private router: Router
  ) {
    this.language=localStorage.getItem(LANGUAGE);
  }

  ngOnInit() {
    this.signupForm = this.buildRegistrationForm();
    this.getStates();
    this.getClientTypes();
    this.getCurrentLocation();
    this.getUserData();
    this.getAdviser()
  }

  async getUserData() {
    // const { value } = await Storage.get({ key: 'userData' });
    this.userData = JSON.parse(localStorage.getItem('userData'));
  }

  buildRegistrationForm(): FormGroup {
    return this.formBuilder.group({
      userId: [this.userData?.id, Validators.required],
      company_name: ['', Validators.required],
      company_code: '',
      type_client_id: '',
      salesperson: '',
      sector_id: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      latitude: [''],
      longitude: [''],
      address_line_1: ['', Validators.required],
      address_line_2: '',
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


  submit(): void {
    let userData = JSON.parse(localStorage.getItem('userData'))
    this.isSubmitted = true;
    const formValues = this.signupForm.value;
    formValues.type_client_id = 1
    formValues.address_line_2 = ' '
  formValues.company_code = userData.lastname + new Date().getTime()
    this.signupForm.value.userId = this.userData.id;
    
    if (formValues.latitude === '') {
      if( this.language === 'Spanish'){
        this.jabiyaService.alertCreater(
          '',
          'Todos los permisos se utilizan para funciones específicas. Otorgue amablemente todos los permisos para continuar usando la aplicación Jabiya',
          'Conceder',
          'Permiso de ubicación'
        );
      }
      else{
      this.jabiyaService.alertCreater(
        '',
        'All permissions are used for specific functionality. Kindly Grant all Permissions to continue using Jabiya Application',
        'Grant',
        'locationPermission'
      );}
      this.permissionSubscription = this.jabiyaService.eventTriggerer.subscribe(
        (event) => {
          if (event === 'locationPermission') {
            this.getCurrentLocation();
          }
        }
      );
      this.isSubmitted = false;
    } else {
      // if (this.signupForm.valid) {
        this.authService.addNewAccount(this.signupForm.value).subscribe(
          (response) => {
            if (response.result.status_response === '200 OK') {
              this.checkMail();
            }
          },
          (error: any) => {
            console.log(error)
            if (error.error.result.coreError === 2001) {
              if( this.language === 'Spanish'){
              this.jabiyaService.presentToast(
                // eslint-disable-next-line max-len
                'Error: correo electrónico o teléfono duplicado. Cuenta ya registrada:' +
                  ' ingrese un nuevo correo electrónico o vaya directamente a la pantalla de inicio de sesión'
              );
              }else{
                this.jabiyaService.presentToast(
                  // eslint-disable-next-line max-len
                  'Error: Duplicate email or phone. account already registered:' +
                    ' Enter a new email or go directly to the login screen'
                ); 
              }
            } else {
              this.jabiyaService.presentToast('error');
            }
            this.isSubmitted = false;
          }
        );
      // }
    }
  }

  async checkMail() {
    if( this.language === 'Spanish'){
    this.jabiyaService.alertCreater(
      'Cuenta Agregada!',
      'Se ha agregado con éxito la cuenta deseada',
      'OK',
      'emailVerify'
    );
    }
    else{
    this.jabiyaService.alertCreater(
      'Account Added!',
      'The desired account has been successfully added',
      'OK',
      'emailVerify'
    );
    }
    this.emailVerifySubscription = this.jabiyaService.eventTriggerer.subscribe(
      (event) => {
        if (event === 'emailVerify') {
          this.router.navigate(['/home']);
        }
      }
    );
  }

  getStates(): void {
    this.getStateSubscription = this.authService.getStates().subscribe(
      (states: any) => {
        this.states = states.result.data.filter(state => state.name == 'Distrito Nacional');
      },
      (error) => {
        console.error('State Fetch Failed: ', error);
      }
    );
  }

  getClientTypes(): void {
    this.getClientTypeSubscription = this.authService
      .getClientTypes()
      .subscribe(
        (clientTypes) => {
          this.clientTypes = clientTypes.result.data;
        },
        (error) => {
          console.error('State Fetch Failed: ', error);
        }
      );
  }

  async getCurrentLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    const locCordinates = coordinates.coords;
    this.signupForm.get('latitude').setValue(locCordinates.latitude.toString());
    this.signupForm
      .get('longitude')
      .setValue(locCordinates.longitude.toString());
  }

  stateSelected(stateId) {
    this.getCitySubscription = this.authService.getCities(stateId).subscribe(
      (cities: any) => {
        this.cities = cities.result.data.filter(city => city.name === 'SANTO DOMINGO CENTRO');
      },
      (error) => {
        console.error('City Fetch Failed: ', error);
      }
    );
  }

  citySelected(cityId) {
    this.getSectorSubscription = this.authService.getSectors(cityId).subscribe(
      (sectors: any) => {
        this.sectors = sectors.result.data;
      },
      (error) => {
        console.error('City Fetch Failed: ', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.unSubscribe(this.getStateSubscription);
    this.unSubscribe(this.getCitySubscription);
    this.unSubscribe(this.getSectorSubscription);
    this.unSubscribe(this.getClientTypeSubscription);
    this.unSubscribe(this.emailVerifySubscription);
    this.unSubscribe(this.permissionSubscription);
    this.signupForm = null;
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

  get errorControl() {
    return this.signupForm.controls;
  }
}
