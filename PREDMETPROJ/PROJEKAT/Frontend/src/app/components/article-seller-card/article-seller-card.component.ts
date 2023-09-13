import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Article } from 'src/app/shared/models/article';
import { ArticleService } from 'src/app/shared/services/article.service';

@Component({
  selector: 'app-article-seller-card',
  templateUrl: './article-seller-card.component.html',
  styleUrls: ['./article-seller-card.component.css']
})
export class ArticleSellerCardComponent implements OnInit {
  @Input() article!: Article;
  quantity: any = 1;

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private articleService: ArticleService,
              private router: Router) {
  }
  ngOnInit(): void {
  }

  Delete(id: number): void{
    this.articleService.deleteArticle(id).subscribe(
      data=>{
        this.toastr.success('You successfully deleted article!', 'Succes!', {
          timeOut: 3000,
          closeButton: true,
        });
      }, error =>{
        this.toastr.error("Failt to delete article", 'Error!', {
          timeOut: 3000,
          closeButton: true,
        });
      }
    )
  }

  Edit(id: number): void{
    this.router.navigateByUrl('home/article/' + id);
  }
}
