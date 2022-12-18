import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LANGUAGE } from 'src/app/util/constants';
import { AuthService } from '../services/authServices/auth.service';
import { LandingPageService } from '../services/landingPageServices/landing-page.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public languageJson = {
    settingPage: {
      spanish: {
        config: 'Configuración',
        acc: 'Mi Cuenta',
        connect: 'Conectar una nueva cuenta',
        pass:'Cambiar la contraseña',
        deleteAccount:'Eliminar Cuenta',
        know:'Conócenos',
        term:'Términos y condiciones',
        policy:'Política de datos personales y aviso de privacidad',
        version:'Versión de la aplicación'
      },
      english:{
        config: 'Configuration',
        acc: 'My account',
        connect: 'Connect a new account',
        deleteAccount:'Delete account',
        pass:'Change Password',
        know:'Know us',
        term:'Terms and Conditions',
        policy:'Personal data policy and privacy notice',
        version:'Application version'
      }
    }}
    public language: any;
    modeEnv = ''
    version = null
    showModalDesactive = false

  constructor(private router: Router, private authService: AuthService,  private landingPageService: LandingPageService) { }
  gotoAddAccount(){
    this.router.navigate(['/settings/addAccount']);
  }
  gotoPass()
  {
    this.router.navigate(['/settings/changePass']);
  }
  logOut(e = true){
    this.authService.logOut().subscribe(
      (response) => {
        if(e && window.location.pathname != '/register'){
          localStorage.removeItem('userData')
          this.router.navigate([`/`], { relativeTo: new ActivatedRoute , skipLocationChange: true });

        }
      },
      (error: any) => {
        console.log(error)
        if(window.location.pathname != '/register'){
          localStorage.removeItem('userData')
          this.router.navigate([`/`], { relativeTo: new ActivatedRoute, skipLocationChange: true });
          
        }
      }
      );
  }


  ngOnInit() {
    this.modeEnv = localStorage.getItem('$$envVariable$$')
    this.version = localStorage.getItem('version')

    this.language=localStorage.getItem(LANGUAGE);
  }
  deleteAccount(){
    let userData = JSON.parse(localStorage.getItem('userData'))
    let account = userData?.accounts?.find(account => account.company_code == userData.company_code)

    this.authService.deleteAccount(account.store_account_id).subscribe(
      async (response) => {
        // this.loading = false;
        if (response.result.status_response === '200 OK') {
          // this.presentToast('Success');
          let index = userData?.accounts?.findIndex(account => account.company_code == userData.company_code)
          userData?.accounts.splice(1, index)
          this.logOut()
        }

      }

    )
  }

  navigate() {
    window.location.reload();
    this.language = localStorage.getItem(LANGUAGE);
  }

  getSession() {
    this.landingPageService.getSession().subscribe(
      (response) => {
      },
      
      (error: any) => {
        
        console.log('error', error.error);
      }
    );
  }

  switchAccount(account) {
    
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


}
