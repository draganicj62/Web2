import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ArticleService } from 'src/app/shared/services/article.service';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit {
  addArticleForm!: FormGroup;
  selectedFile!: File;

  constructor(private fb: FormBuilder,
              private articleService: ArticleService,
              private toastr: ToastrService) {
    this.createLoginForm();}

  ngOnInit() {
  }

  createLoginForm(){
    this.addArticleForm = this.fb.group({
      name: [null,[Validators.required,Validators.minLength(2)]],
      price: [1,[Validators.required]],
      quantity: [1,[Validators.required]],
      description:[null,[Validators.required,Validators.minLength(2)]],
      picture:["neka putanja"]
    })
  }

  addArticle(): void {
    if (this.addArticleForm.valid){
      if(this.selectedFile){
        this.articleService.create(this.addArticleForm.value, this.selectedFile).subscribe(
          data=>{
            this.toastr.success('You successfully added new product!', 'Succes!', {
              timeOut: 3000,
              closeButton: true,
            });
          }, error =>{
            this.toastr.error("Bad article input", 'Error!', {
              timeOut: 3000,
              closeButton: true,
            });
          }
        )
      }
      else{
        this.toastr.error("PLEASE SELECT PICTURE", 'Error!', {
          timeOut: 3000,
          closeButton: true,
        });
      }
    }
    else{
      this.toastr.error("Invalid article fields", 'Error!', {
        timeOut: 3000,
        closeButton: true,
      });
    }
  }

  onFileChanged(imageInput: any){
    this.selectedFile = imageInput.files[0];
  }

  get name() {
    return this.addArticleForm.get('name') as FormControl;
  }
  get price() {
    return this.addArticleForm.get('price') as FormControl;
  }
  get quantity() {
    return this.addArticleForm.get('quantity') as FormControl;
  }
  get description() {
    return this.addArticleForm.get('description') as FormControl;
  }
}
