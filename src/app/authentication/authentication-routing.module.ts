import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationPage } from './authentication.page';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { IntroComponent } from './intro/intro.component';
import { LangPopoverComponent } from './lang-popover/lang-popover.component';
import { LoginComponent } from './login/login.component';
import { PasscodeVerificationComponent } from './passcode-verification/passcode-verification.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  // { path: 'intro', component: IntroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'resetPassword', component: ResetPasswordComponent },
  { path: 'passcodeVerification', component: PasscodeVerificationComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'langPopover', component: LangPopoverComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationPageRoutingModule {}
