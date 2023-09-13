import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActiveOrder } from 'src/app/shared/models/order';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  orderId!: string;
  order!: ActiveOrder;


  constructor(private route: ActivatedRoute, private orderService: OrderService, private toastr: ToastrService, private router: Router){}
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.orderId = params.get('id') as string;
    }); 
    
    this.orderService.getActiveOrderUnclamed(parseInt(this.orderId, 10)).subscribe(
      data=>{
        this.order = data as ActiveOrder;
        console.log(this.order);
      }, error =>{
        this.toastr.error("Failed to get any data", 'Error!' , {
          timeOut: 3000,
          closeButton: true,
        });  
      }
    );
  }

  Confirm(){
    this.orderService.updateOrderUnclamed(parseInt(this.orderId, 10)).subscribe(
      data=>{
        this.order = data as ActiveOrder;
        console.log(this.order);
        this.toastr.success('You successfully confirmed order!', 'Succes!', {
          timeOut: 6000,
          closeButton: true,
        });
        this.router.navigateByUrl('/home/dashboard');
      }, error =>{
        this.toastr.error("Failed to confirm", 'Error!' , {
          timeOut: 3000,
          closeButton: true,
        });  
      }
    );
  }
}
