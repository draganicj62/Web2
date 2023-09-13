import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UpdateUser, UserDetails } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user!: UserDetails;
  id: any;
  token: any;
  selectedFile!: File;
  updateForm!: FormGroup;
  updatedUser!: UpdateUser;

  constructor(private route: Router,
              private fb: FormBuilder,
              private userService: UserService,
              private authService: AuthService,
              private toastr: ToastrService) 
              {
    this.createUpdateForm();
  }

  ngOnInit() {
    this.getUserDetails();
  }

  createUpdateForm() {
    this.updateForm = this.fb.group({
      username: [null,Validators.required],
      email: [null,[Validators.required,Validators.email]],
      firstname: [null,[Validators.required,Validators.minLength(3)]],
      lastname: [null,[Validators.required,Validators.minLength(3)]],
      birthday: [null,[Validators.required]],
      address: [null,[Validators.required]],
      oldpassword: [""],
      newpassword: [""],
    });
  }
  getUserDetails(){
    this.token = localStorage.getItem('token');
    this.id = this.authService.getUserId(this.token);
    this.userService.getUserDetails(this.id).subscribe(
      data=>{
        this.user = data as UserDetails;
        this.updateForm.patchValue({
          username: this.user.username,
          email: this.user.email,
          firstname: this.user.firstName,
          lastname: this.user.lastName,
          address: this.user.address,
        });
        this.updateForm.controls['birthday'].setValue(formatDate(this.user.birthday,'yyyy-MM-dd','en'));
      }, error =>{
        console.log('Error occurred at show-user-profile.component.ts')
      }

    );
  }

  onFileChanged(imageInput: any){
    this.selectedFile = imageInput.files[0];
  }

  SaveChanges(){
    if (this.updateForm.valid) {
      //if(this.streetAddressValid()){
        this.userService.update(this.userData()).subscribe(
          data=>{
            this.toastr.success('Your profile has been successfully updated', 'Succes!', {
              timeOut: 3000,
              closeButton: true,
            });
            if(this.selectedFile){
              let formData = new FormData();
              formData.append("myfile",this.selectedFile);
              this.token = localStorage.getItem('token');
              this.userService.updatePhoto(this.authService.getUserId(this.token),formData).subscribe(
                data=>{
                  this.toastr.success('Your profile has been successfully updated', 'Succes!', {
                    timeOut: 3000,
                    closeButton: true,
                  });
                }, error => {
                  this.toastr.error("Faild to update picture", 'Error!', {
                    timeOut: 3000,
                    closeButton: true,
                  });
                }
              );
            }
          }, error =>{
            this.toastr.error("Invalid input", 'Error!' , {
              timeOut: 3000,
              closeButton: true,
            });
          }

        );
      // }
      // else{
      //   this.toastr.error("Please enter valid street address: ST.NAME ST.NUMBER,CITY,COUNTRY", 'Error!' , {
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


  userData(): UpdateUser {
    return this.updatedUser = {
        id: this.id,
        username: this.username.value,
        email: this.email.value,
        firstName: this.firstname.value,
        lastName: this.lastname.value,
        birthday: this.updateForm.value['birthday'],
        address: this.address.value,
        oldpassword: this.oldpassword.value,
        newpassword: this.newpassword.value
    };
  }
  handleAddressChange(address: any) {
  }
  get username() {
    return this.updateForm.get('username') as FormControl;
  }
  get email() {
    return this.updateForm.get('email') as FormControl;
  }
  get firstname() {
    return this.updateForm.get('firstname') as FormControl;
  }
  get lastname() {
    return this.updateForm.get('lastname') as FormControl;
  }
  get address() {
    return this.updateForm.get('address') as FormControl;
  }
  get oldpassword() {
      return this.updateForm.get('oldpassword') as FormControl;
  }
  get newpassword() {
      return this.updateForm.get('newpassword') as FormControl;
  }

}
