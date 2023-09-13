import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrderHistory } from 'src/app/shared/models/order';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders!: OrderHistory[];
  token: any;
  userId: any;

  constructor(private orderService: OrderService,
              private toastr: ToastrService,
              private authService: AuthService) { }

  ngOnInit() {
    this.getOrderHistory();
  }

  getOrderHistory(): void{
    this.token = localStorage.getItem('token');
    this.userId = this.authService.getUserId(this.token);
    this.orderService.getOrderHistory(this.userId).subscribe(
      data=>{
        this.orders = data as OrderHistory[];
      }, error =>{
        this.toastr.error("Failed to get any data", 'Error!' , {
          timeOut: 3000,
          closeButton: true,
        });
      }
    );
  }
}
