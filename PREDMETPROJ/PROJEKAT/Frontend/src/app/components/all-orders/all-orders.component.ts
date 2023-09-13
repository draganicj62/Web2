import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AllOrder } from 'src/app/shared/models/order';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit {
  orders!: AllOrder[];
  token: any;
  userId: any;

  constructor(private orderService: OrderService,
              private toastr: ToastrService,
              private authService: AuthService) { }

  ngOnInit() {
    this.getAllOrders();
  }

  getAllOrders(): void{
    this.orderService.getAllOrders().subscribe(
      data=>{
        this.orders = data as AllOrder[];
      }, error =>{
        console.log('Error occurred at order-list.component.ts')
      }
    );
  }

}
