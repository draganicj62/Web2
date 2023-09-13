import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/shared/models/article';
import { ArticleService } from 'src/app/shared/services/article.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-seller-articles',
  templateUrl: './seller-articles.component.html',
  styleUrls: ['./seller-articles.component.css']
})
export class SellerArticlesComponent implements OnInit {
  articles!: Article[];
  page: number = 1;
  token!: any;
  id!: any;
  constructor(private articleService: ArticleService,
              private authService: AuthService) { }

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.id = this.authService.getUserId(this.token);
    this.articleService.getSellerArticles(this.id).subscribe(
      data=>{
        this.articles = data as Article[];
      }, error =>{
        console.log('Error occurred at all-articles.comp.ts')
      }

    );
  }
}
