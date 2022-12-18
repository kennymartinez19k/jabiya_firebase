import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/authServices/auth.service';
import { Router } from '@angular/router';
import { LANGUAGE } from 'src/app/util/constants';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss'],
})
export class EditAccountComponent implements OnInit, OnDestroy {
  public userData: any;
  public editAccountForm: any;
  public loading = false;
  editAccountSubscription: Subscription;
  getSessionInfoSubscription: Subscription;
  public language: any;
  public var1: any;
  public var2: any;
  states: any[];
  cities: any[];
  sectors: any[];
  getStateSubscription: Subscription;
  getCitySubscription: Subscription;
  getSectorSubscription: Subscription;
  showSectors = false
  sectorsFilter = []
  sectorInfo = {
    id: null,
    name: null
  }
  inputField = ''
  public languageJson = {
    editPage: {
      spanish: {
        profile: 'Editar perfil',
        fname: 'Primer Nombre',
        lname: 'Apellido',
        email: 'Correo Electrónico',
        phone: 'Teléfono',
        update: 'Actualización del perfil',
        success: 'Éxito',
        rncStore: 'RNC / Identificacion de tienda',
        direction: 'Dirección (calle y numero)',
        owner: 'Nombre del Dueño',
        city: 'city',
        state: 'state',
        country: 'country',
        province: 'Provincia',
        provincereq: 'Provincia is required',
        town: 'Ciudad',
        townreq: 'Ciudad is required',
        selprovince: 'Seleccionar Provincia',
        selcity: 'Seleccionar Ciudad',
        selsector: 'Seleccionar Sector',
        details: 'Póngase en contacto con el vendedor para actualizar el correo electrónico y el teléfono',
        edittitle:'Editable',
        nonedittitle:'No editable'
      },
      english: {
        profile: 'Edit profile',
        fname: 'First name',
        lname: 'Last name',
        email: 'Email',
        phone: 'Telephone',
        update: 'Profile Update',
        success: 'Success',
        rncStore: 'RNC / Store identification',
        direction: 'Direction',
        owner: 'Owner Name',
        city: 'city',
        state: 'state',
        country: 'country',
        province: 'Province',
        provincereq: 'Province is required',
        town: 'Town',
        townreq: 'Town is required',
        selprovince: 'Select Province',
        selcity: 'Select city',
        selsector: 'Select Sector',
        details: 'Please contact Salesperson to update email and phone',
        edittitle:'Non editable',
        nonedittitle:'Non editable'
      }
    }
  }
  constructor(
    public alertController: AlertController,
    private formBuilder: FormBuilder,
    public toastController: ToastController,
    private authService: AuthService,
    private router: Router
  ) {
    this.language = localStorage.getItem(LANGUAGE);
  }
  selectSector(sector) {
    this.sectorInfo = sector
    this.editAccountForm.value.sector_id = sector.id
    this.inputField = null
    this.sectorsFilter = this.sectors
  }

  ngOnInit() {
    this.getUserAccount();
    this.getStates();
    this.editAccountForm = this.intializeEditAccountForm();
  }

  async getUserAccount() {
    // const { value } = await Storage.get({ key: 'userData' });
    
    this.userData = JSON.parse(localStorage.getItem('userData'));
    if (this.userData.client !== undefined) {
      const name = this.userData.client;
      const words = name.split(" ");
      this.userData.firstname = this.var1 = words[0];
      this.userData.lastname = this.var2 = words[1]
      
      const { phone, email, firstname, lastname, document_number, owner_name, city, state, sector_id } = this.userData;
      this.editAccountForm.patchValue({
        phone,
        email,
        firstname,
        lastname,
        document_number,
        city,
        state,
        sector_id,
        owner_name
      });
    }
    else {
      const { phone, email, firstname, lastname, document_number } = this.userData;
      const { owner_name, city, state, sector_id } = this.userData;
      this.editAccountForm.patchValue({
        phone,
        email,
        firstname,
        lastname,
        document_number,
        city,
        state,
        sector_id,
        owner_name
      });
    }
  }

  intializeEditAccountForm(): FormGroup {
    return this.formBuilder.group({
      phone: [this.userData?.phone, Validators.required],
      email: [this.userData?.email, Validators.required],
      firstname: [this.userData?.client, Validators.required],
      lastname: [this.userData?.client, Validators.required],
      address_line_1: [this.userData.full_address, Validators.required],
      document_number: [this.userData?.document_number, Validators.required],
      owner_name: [this.userData?.owner_name, Validators.required],
      city: [this.userData?.city, Validators.required],
      state: [this.userData?.state, Validators.required],
      sector_id: [this.userData?.sector_id, Validators.required]
    });
  }
  getStates(): void {
    this.getStateSubscription =
      this.authService.getStates().subscribe((states: any) => {
        this.states = states.result.data.filter(state => state.name === 'Distrito Nacional');
      }, error => {
        console.error('State Fetch Failed: ', error);
      });
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
  filterSector(e) {
    this.inputField = e.target.value
    let name = e.target.value
    this.sectorsFilter = this.sectors.filter(sector => sector.name.toLowerCase().includes(name.toLowerCase()))
  }


  sendEditAccountDetails(): void {
    this.loading = true;
    const formValues = this.editAccountForm.value;
    this.editAccountSubscription = this.authService.editAccount(formValues, this.userData.id).subscribe(
      async (response) => {
        // this.loading = false;
        if (response.result.status_response === '200 OK') {
          // this.presentToast('Success');
          this.getSessionInfoSubscription = this.authService.getSessionInfo().subscribe(
            async (res) => {
              this.loading = false;
              if (res.result.status_response === '200 OK') {
                localStorage.setItem('userData', JSON.stringify(res.result.data))
                // await Storage.set({
                //   key: 'userData',
                //   value: ,
                // });
                this.router.navigate(['/home']);
                this.presentToast(this.language === 'Spanish'
                  ? this.languageJson.editPage.spanish.success
                  : this.languageJson.editPage.english.success);
              }
            },
            (err: any) => {
              this.loading = false;
              console.error('error1', err);
              if (err.error.result.error.message === 'Error.Session expired') {
                this.router.navigate(['']);
                this.presentToast(this.language === 'Spanish'
                  ? this.languageJson.editPage.spanish.success
                  : this.languageJson.editPage.english.success);
              } else {
                this.presentToast('Error!');
              }
            }
          );
        }
      },
      (error: any) => {
        this.loading = false;
        console.error('error2', error);
        this.presentToast('Error!');
      }
    );
  }

  async presentToast(error) {
    const toast = await this.toastController.create({
      message: error,
      duration: 2000,
    });
    toast.present();
  }

  async updateprofile() {
    const alert = await this.alertController.create({
      // cssClass: 'successfull-registration',
      header: this.language === 'Spanish' ? 'Perfil actualizado con éxito' : 'Profile Updated Successfully',
      // subHeader: 'Subtitle',
      message: this.language === 'Spanish' ? 'Your profile has been updated successfully' : '',
      buttons: [{ text: 'OK', handler: (d) => console.log('Update Profile') }],
    });

    await alert.present();
  }

  ngOnDestroy() {
    this.unSubscribe(this.editAccountSubscription);
    this.unSubscribe(this.getSessionInfoSubscription);
    this.unSubscribe(this.getStateSubscription);
    this.unSubscribe(this.getCitySubscription);
    this.unSubscribe(this.getSectorSubscription);
    this.states = null;
    this.cities = null;
    this.sectors = null;
    this.showSectors = null;
    this.sectorsFilter = null;
    this.sectorInfo = null;
    this.inputField = null;
    this.userData = null;
    this.editAccountForm = null;
    this.loading = null;
    this.router = null;
    this.formBuilder = null;
    this.authService = null;
    this.toastController = null;
    this.alertController = null;
  }

  unSubscribe(subscription: Subscription) {
    if (subscription !== null && subscription !== undefined) {
      subscription.unsubscribe();
    }
  }
}
