import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Article } from 'src/app/shared/models/article';
import { ArticleService } from 'src/app/shared/services/article.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  articleId!: string;

  article!: Article;
  id!: number;
  token: any;
  selectedFile!: File;
  updateForm!: FormGroup;
  updatedArticle!: Article;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private authService: AuthService,
              private toastr: ToastrService,
              private articleService: ArticleService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.articleId = params.get('id') as string;
    });  
    this.createUpdateForm();
    this.getUserDetails();
  }

  
  createUpdateForm() {
    this.updateForm = this.fb.group({
      name: [null,Validators.required],
      price: [1,[Validators.required,Validators.min(1), Validators.max(10000)]],
      quantity: [1,[Validators.required,Validators.min(1), Validators.max(10000)]],
      description: [null,[Validators.required,Validators.minLength(3)]],
    });
  }
  getUserDetails(){
    try{
      this.id = parseInt(this.articleId, 10);
    }
    catch{
      this.id = 0;
    }
    this.articleService.getArticalDetails(this.id).subscribe(
      data => {
        this.article = data as Article;
        this.updateForm.patchValue({
          name : this.article.name,
          description: this.article.description,
          price: this.article.price,
          quantity: this.article.quantity,
        });
      }, error =>{
          this.toastr.error("Faild to get article details", 'Error!' , {
            timeOut: 3000,
            closeButton: true,
          });
      }
    );
  }

  onFileChanged(imageInput: any){
    this.selectedFile = imageInput.files[0];
  }

  SaveChanges(){
    if (this.updateForm.valid) {
      // if(this.selectedFile){
        this.articleService.update(this.userData()).subscribe(
          data=>{
            this.toastr.success('Your article has been successfully updated', 'Succes!', {
              timeOut: 3000,
              closeButton: true,
            });
            
          }, error =>{
            this.toastr.error("Invalid input", 'Error!' , {
              timeOut: 3000,
              closeButton: true,
            });
          }

        );
      // }
      // else{
      //   this.toastr.error("Chose photo", 'Error!' , {
      //     timeOut: 3000,
      //     closeButton: true,
      //   });
      // }
    }
    else{
      this.toastr.error("You have to input every field valid", 'Error!' , {
        timeOut: 3000,
        closeButton: true,
      });
    }
  }


  userData(): Article {
    this.token = localStorage.getItem('token');
    return this.updatedArticle = {
        id:parseInt(this.articleId, 10),
        name: this.name.value,
        description: this.description.value,
        price: this.price.value,
        quantity: this.quantity.value,
        picture: this.article.picture,
        userId: this.authService.getUserId(this.token),
        file: this.selectedFile
    };
  }

  get name() {
    return this.updateForm.get('name') as FormControl;
  }
  get quantity() {
    return this.updateForm.get('quantity') as FormControl;
  }
  get price() {
    return this.updateForm.get('price') as FormControl;
  }
  get description() {
    return this.updateForm.get('description') as FormControl;
  }


}
