import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/shared/models/article';
import { ArticleService } from 'src/app/shared/services/article.service';

@Component({
  selector: 'app-all-articles',
  templateUrl: './all-articles.component.html',
  styleUrls: ['./all-articles.component.css']
})
export class AllArticlesComponent implements OnInit {
  articles!: Article[];
  page: number = 1;

  constructor(private articleService: ArticleService) { }

  ngOnInit() {
    this.articleService.getAllArticles().subscribe(
      data=>{
        this.articles = data as Article[];
      }, error =>{
        console.log('Error occurred at all-articles.comp.ts')
      }

    );
  }

}
