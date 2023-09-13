import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActiveOrder, CancelOrder } from 'src/app/shared/models/order';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { CountdownComponent,CountdownEvent,CountdownConfig} from 'ngx-countdown';
import { Router } from '@angular/router';

const KEY = 'time';
const DEFAULT = 100;

@Component({
  selector: 'app-active-orders',
  templateUrl: './active-orders.component.html',
  styleUrls: ['./active-orders.component.css']
})
export class ActiveOrdersComponent implements OnInit {
  orders!: ActiveOrder[];
  token: any;
  userId: any;
  customerAndSeller: string[] = ['Customer', 'Seller'];
  seller: string[] = ['Seller'];
  customer: string[] = ['Customer'];
  cancelOrder: CancelOrder = {
    userId: -1,
    orderId: -1
  } 
  endTime!: Date;
  countdownConfig!: CountdownConfig;
  config: CountdownConfig = { leftTime: DEFAULT, notify: 0, format: 'h:m:s' };
  @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;

  constructor(private orderService: OrderService,
              private toastr: ToastrService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.getActiveOrder();
  }

  UnclamedOrders(){
    this.router.navigateByUrl('home/map');
  }

  getActiveOrder(): void{
    this.token = localStorage.getItem('token');
    this.userId = this.authService.getUserId(this.token);
    this.orderService.getActiveOrder(this.userId).subscribe(
      data=>{
        this.orders = data as ActiveOrder[];
        for(let key in this.orders) {
          console.log("key: " + key);
          let child = this.orders[key];
          const currentTime = new Date().getTime();
          const endTime = new Date(child.deliveryTime).getTime();
          
            const timeDiff = endTime - currentTime;

            // Check if the time difference is within 2 hours
            if (timeDiff > 0 && timeDiff <= 2 * 60 * 60 * 1000) {
              child.showCountdown = true;
              this.countdownConfig = {
                leftTime: timeDiff / 1000, // Convert milliseconds to seconds
                notify: 0,
                format: 'HH:mm:ss'
              };
            
            } else {
              child.showCountdown = false;
            }
            child.config = this.countdownConfig;
          
        }
      }, error =>{
        this.toastr.error("Failed to get any data", 'Error!' , {
          timeOut: 3000,
          closeButton: true,
        });  
      }
    );
  }

  Cancel(orderId: number){
    this.token = localStorage.getItem('token');
    this.cancelOrder.orderId = orderId;
    this.cancelOrder.userId = this.authService.getUserId(this.token);
    /*console.log('CANCELLLL');

    this.orderService.refundOrder().subscribe(
      data=> {
        this.toastr.success("Successfully canceled order", 'Success!' , {
          timeOut: 3000,
          closeButton: true,
        });
      }, 
      error =>{
        this.toastr.error("Failed to cancel order", 'Error!' , {
          timeOut: 3000,
          closeButton: true,
        });  
      }
    );*/

    this.orderService.cancelOrder(this.cancelOrder).subscribe(
      data=> {
        this.toastr.success("Successfully canceled order", 'Success!' , {
          timeOut: 3000,
          closeButton: true,
        });
      }, 
      error =>{
        this.toastr.error("Failed to cancel order", 'Error!' , {
          timeOut: 3000,
          closeButton: true,
        });  
      }
    );
  }

  handleEvent(ev: CountdownEvent) {
    if (ev.action === 'notify') {
      localStorage.setItem(KEY, `${ev.left / 1000}`);
    }
  }
}
