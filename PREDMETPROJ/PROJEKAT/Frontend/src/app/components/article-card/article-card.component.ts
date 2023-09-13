import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Article } from 'src/app/shared/models/article';
import { CreateOrder } from 'src/app/shared/models/order';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css']
})
export class ArticleCardComponent implements OnInit {
  @Input() article!: Article;
  orderArticle!: FormGroup;
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

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private orderService: OrderService,
              private router: Router) {
    this.createOrderForm();
  }
  ngOnInit(): void {
  }

  createOrderForm() {
    this.orderArticle = this.fb.group({
      quantity: [1,[Validators.required, Validators.min(1), Validators.max(10000)]],
      address: [null,[Validators.required,Validators.minLength(1)]],
      comment: [null,[Validators.required,Validators.minLength(1)]],
    });
  }

  Order(theArticle: Article){
    if(this.orderArticle.valid){
      this.newOrder.sellerId = theArticle.userId;
      this.newOrder.item.articleId = theArticle.id;
      this.newOrder.item.quantity = this.quantity.value;
      this.newOrder.address = this.address.value;
      this.newOrder.comment = this.comment.value;
      this.orderService.newOrderPom = this.newOrder;
      
      this.orderService.getOrderQuanity(this.newOrder).subscribe(
        data => {
          this.router.navigateByUrl('home/payment');
        },
        error => {
          this.toastr.error("We are out of requested article!", 'Error!' , {
            timeOut: 3000,
            closeButton: true,
          });
        }
      );
    }
    else{
      this.toastr.error("Input not valid", 'Error!' , {
        timeOut: 3000,
        closeButton: true,
      });
    }
  }

  get address() {
    return this.orderArticle.get('address') as FormControl;
  }
  get comment() {
    return this.orderArticle.get('comment') as FormControl;
  }
  get quantity() {
    return this.orderArticle.get('quantity') as FormControl;
  }
}
