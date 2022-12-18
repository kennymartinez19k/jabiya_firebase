import { Component, OnInit } from '@angular/core';
import { LANGUAGE } from 'src/app/util/constants';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@capacitor/storage';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  public language:any;
  public languageJson={
    passPage:{
      spanish:{
        title:'Cambiar la Contraseña',
        phone:'Teléfono',
        name:'Tu nombre',
        pass:'Contraseña',
        confirmpass:'Confirmar contraseña',
        confirmbutton:'Confirmar',
        resetalert: 'Contraseña reestablecida correctamente.'
      },
      english:{
        title: 'Change Password',
        phone:'Telephone',
        name:'Your name',
        pass:'Password',
        confirmpass:'Confirm Password',
        confirmbutton:'Confirm',
        resetalert:'Password reset successfully.'
      }
    }    
  }
  passForm: FormGroup;
  showPassword = 'password';
  public userData: any;
  constructor( private formBuilder: FormBuilder,) {
    this.language=localStorage.getItem(LANGUAGE);
   }

  ngOnInit() {
    this.passForm = this.buildPassForm();
    this.getUserData();
  }
  async getUserData() {
    // const { value } = await Storage.get({ key: 'userData' });
    
    this.userData = JSON.parse(localStorage.getItem('userData'));
    const { phone,  company_name} = this.userData;
    this.passForm.patchValue({
      phone,
      company_name      
    });
  }
  buildPassForm(): FormGroup{
    return this.formBuilder.group({
      userId: [this.userData?.id, Validators.required],
      company_name: ['', Validators.required],
      phone: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_pwd:['',Validators.required]
  })
}
changePasswordType() {
  this.showPassword = this.showPassword === 'password' ? 'text' : 'password';
}
}
