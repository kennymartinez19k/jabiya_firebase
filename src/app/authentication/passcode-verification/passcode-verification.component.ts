import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-passcode-verification',
  templateUrl: './passcode-verification.component.html',
  styleUrls: ['./passcode-verification.component.scss'],
})
export class PasscodeVerificationComponent implements OnInit {
  showStatus=false;
  constructor(private router: Router) { }
  onSubmit(){
    this.showStatus=true;
  }
  // this called every time when user changed the code
  onCodeChanged(code: string) {
  }
  // this called only if user entered full code
  onCodeCompleted(code: string) {
  }
  ngOnInit() {}

}
