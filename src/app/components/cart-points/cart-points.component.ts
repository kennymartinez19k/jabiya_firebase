import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ShoppingCartService } from 'src/app/services/cartServices/shopping-cart.service';
import { Storage } from '@capacitor/storage';
import { LandingPageService } from '../../services/landingPageServices/landing-page.service';


@Component({
  selector: 'app-cart-points',
  templateUrl: './cart-points.component.html',
  styleUrls: ['./cart-points.component.scss'],
})
export class CartPointsComponent implements OnInit {

  public orderForm: FormGroup;
  userData: any
  minPoints: any;
  maxPoints: any;
  point = 0
  
  minPointsRequired = 250
  constructor(private formBuilder: FormBuilder, public shoppingCartService: ShoppingCartService, private alertController: AlertController,     private landingPageService: LandingPageService,
    ) {
  }

  async ngOnInit() {
    this.orderForm = this.intializeForm()
    // const { value } = await Storage.get({ key: 'userData' });
    const value = JSON.parse(localStorage.getItem('userData'))
    this.userData = value
    this.minPoints = this.userData.minimum_number_points;

  }

  getPoints() {
    return this.shoppingCartService.points
  }

  

  getPointsHistory() {
    
    this.landingPageService.getPointsHistory(this.userData.sub_user_id).subscribe(
      (res) => {
        if (res.result.status_response === '200 OK') {
          this.point = res.result.data.partner_loyalty_points
        }
      },
      (error: any) => {
        this.point = this.getPointDefinition().currentClientPoints
        console.log('error', error);
      }
    );
  }

  getPointDefinition() {
    return this.shoppingCartService.getPointDefinition()
  }

  intializeForm(): FormGroup {
    return this.formBuilder.group({
      orderPoints: [this.shoppingCartService.points, [Validators.required]],
    });
  }

  getMaxPoints() {
    let maxPoints = this.shoppingCartService.getPointDefinition().currentClientPoints
    if (this.shoppingCartService.maxNumberPointsToReedem < maxPoints) maxPoints = this.shoppingCartService.maxNumberPointsToReedem
    let maxPointsFromTotalOrder = this.shoppingCartService.getCostFromOrderLines().totalPriceWithoutTax / this.shoppingCartService.loyaltyPointsToRedeem
    if (maxPointsFromTotalOrder < maxPoints) maxPoints = maxPointsFromTotalOrder
    return Math.round(maxPoints)
  }
  async changePoint(event) {
    let max = this.getMaxPoints()

    event.target.value = Math.floor(Number(event.target.value))
    
    if(Number(event.target.value) > max){
      let delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(1500)

      this.shoppingCartService.points = max 
      event.target.value = max
    }else if(Number(event.target.value) < 0){
      event.target.value = 0
      this.shoppingCartService.points = 0
    }else{
      let value = Number(event.target.value)
      this.shoppingCartService.points = value
    }
  }

}
