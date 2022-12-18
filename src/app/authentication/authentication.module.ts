import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthenticationPageRoutingModule } from './authentication-routing.module';

import { AuthenticationPage } from './authentication.page';
import { IntroComponent } from './intro/intro.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasscodeVerificationComponent } from './passcode-verification/passcode-verification.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CodeInputModule } from 'angular-code-input';
import { LangPopoverComponent } from './lang-popover/lang-popover.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AuthenticationPageRoutingModule,
    CodeInputModule.forRoot({
      codeLength: 6,
      isCharsCode: true,
      code: ''
    })
  ],
  declarations: [AuthenticationPage,
    IntroComponent,
    LoginComponent,
    ForgotPasswordComponent,
    PasscodeVerificationComponent,
    RegisterComponent,
    ResetPasswordComponent,
    LangPopoverComponent,
  ]
})
export class AuthenticationPageModule {}
