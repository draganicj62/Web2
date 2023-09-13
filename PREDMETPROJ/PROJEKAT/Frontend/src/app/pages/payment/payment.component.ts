import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Article } from 'src/app/shared/models/article';
import { CreateOrder, PaymentPrice } from 'src/app/shared/models/order';
import { ArticleService } from 'src/app/shared/services/article.service';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit{
    amount: any;
    @ViewChild('paymentRef', {static:true}) paymentRef! : ElementRef;
    newOrder: CreateOrder = {
      comment: "",
      address: "",
      sellerId: -1,
      userId: -1,
      item: {
        articleId: -1,
        quantity: -1
      },
    };
    article!:Article;

    constructor(private route: ActivatedRoute, 
                private router: Router, 
                private toastr: ToastrService, 
                private orderService: OrderService, 
                private articleService: ArticleService) {}


    ngOnInit() {
      this.newOrder = this.orderService.newOrderPom;
      console.log(this.newOrder);
      this.articleService.getArticalDetails(this.newOrder.item.articleId).subscribe(
        data => {
          this.article = data as Article;
          console.log('Usao u fju');
          console.log(this.article);
          this.amount = this.newOrder.item.quantity * this.article.price + 7;
        }, error =>{
            this.toastr.error("Faild to get article details", 'Error!' , {
              timeOut: 3000,
              closeButton: true,
            });
        }
      );
      
      console.log('USAO U PAYMENT')
      console.log(window.paypal);
      window.paypal.Buttons(
        {
          style:{
            layout: 'horizontal',
            color: 'blue',
            shape: 'rect',
            label: 'paypal'
          },
          createOrder: (data:any, actions:any) => {
              return actions.order.create({
                purchase_units: [
                  {
                    description: 'Primer proizvoda 1',
                    amount: {
                      value: this.amount,
                      currency_code: 'USD'
                    },
                   
                  }
                ]
              })
          },
          onApprove: (data: any, actions: any)  => {
              return actions.order.capture().then((details : any) => {
                console.log(details);
                if(details.status === 'COMPLETED'){
                  this.orderService.orderId = details.id;
                  this.orderService.createOrderPayPal(this.newOrder).subscribe(
                    data => {
                      this.toastr.success('You successfully made order!', 'Succes!', {
                        timeOut: 3000,
                        closeButton: true,
                      });
                    },
                    error => {
                      this.toastr.error("Faild to create order", 'Error!' , {
                        timeOut: 3000,
                        closeButton: true,
                      });
                    }
                  );
                  this.toastr.success('Your transaction is completed! Transaction id: ' + details.id, 'Succes!', {
                    timeOut: 3000,
                    closeButton: true,
                  });
                  this.router.navigateByUrl('home/dashboard');
                }
              })
          },
          onError: (error: any) => {
            console.log(error);
          }
        }
      ).render(this.paymentRef.nativeElement);
    }

    Order(){
      this.orderService.createOrder(this.newOrder).subscribe(
        data => {
          this.toastr.success('You successfully made order!', 'Succes!', {
            timeOut: 3000,
            closeButton: true,
          });
        },
        error => {
          this.toastr.error("Faild to create order", 'Error!' , {
            timeOut: 3000,
            closeButton: true,
          });
        }
      );
    }

}
