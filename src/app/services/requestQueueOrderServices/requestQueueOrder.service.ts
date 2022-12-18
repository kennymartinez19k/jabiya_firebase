import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../util/constants';
import { map } from 'rxjs/operators';
import { ShoppingCartService } from '../../services/cartServices/shopping-cart.service';
import { QueueOrderServices } from '../../services/queueServices/queueOrder.service';

@Injectable({
    providedIn: 'root',
})
export class RequestQueueOrderServices {

constructor(private httpClient: HttpClient, public shoppingCartService: ShoppingCartService,  public queueOrderServices: QueueOrderServices) {}
    
  async orderqueue(){
      while (true){
        this.queueOrderServices.deleteTenTries()

        let delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(120000) // 2 minutes to seconds
        
        let userData = JSON.parse(localStorage.getItem('userData'));
        if(!userData) return

        let order = this.queueOrderServices.peek()
        if(order){
            this.shoppingCartService.sendOrder(order).subscribe(async (res) => {
                this.queueOrderServices.dequeue()
              },
                (error: any) => {
                    
                  if(order.try <= 9){
                      order.try += 1
                      this.queueOrderServices.editLast(order)
                  }
                  console.error('err', error);
                }
              );
        }
    }

}
    async sendOrder(order){
        return this.httpClient
        .post(apiUrl.URL + apiUrl.PLACE_ORDER, order.params, order.httpOptions)
        .pipe(map((res: any) => {}))
    }
   
  }
