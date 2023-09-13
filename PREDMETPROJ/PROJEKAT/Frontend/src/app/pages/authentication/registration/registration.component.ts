import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserRole } from 'src/app/shared/enums/user-role.enum';
import { RegistrationUser } from 'src/app/shared/models/user';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  alertify: any;
  title = 'google-places-autocomplete';
  registerationForm!: FormGroup ;
  selectedFile!: File;
  user!: RegistrationUser;
  userRole!: string;
  id: any;

  // options = {
  // types: ['address'],
  // componentRestrictions: { country: ['rs'] }
  // } as unknown as Options;

  handleAddressChange(address: any) {
  }

  constructor(private router: Router,
              private fb: FormBuilder,
              private authService: AuthenticationService,
              private toastr: ToastrService,
              private userService: UserService
              ) {

      this.createRegisterationForm();
  }

  ngOnInit() {

  }

  createRegisterationForm() {
    this.registerationForm = this.fb.group({
      username: ["asdsad",Validators.required],
      email: ["a@a.com",[Validators.required,Validators.email]],
      firstname: ["sadsad",[Validators.required,Validators.minLength(3)]],
      lastname: ["asdasd",[Validators.required,Validators.minLength(3)]],
      birthday: ["2001-05-05",[Validators.required]],
      address: ["KASD",[Validators.required]],
      password: ["password", [Validators.required, Validators.minLength(8)]],
      confirmPassword: ["password", Validators.required],
    },{validators: this.passwordMatchingValidatior});

  }

  passwordMatchingValidatior(fg: FormGroup): Validators {
      return fg.get('password')?.value === fg.get('confirmPassword')?.value ? true : {notmatched: true};
  }

  // streetAddressValid(): boolean{
  //     let valid : boolean = true;
  //     this.locationService.getLocation(this.registerationForm.get('address')?.value).subscribe(
  //       data=>{
  //         if(data && data.status != "ZERO_RESULTS"){

  //         }
  //         else{
  //           valid = false;
  //         }
  //       },
  //       error =>{
  //         this.toastr.error(error.error.errorMessage, 'Error!', {
  //           timeOut: 3000,
  //           closeButton: true,
  //         });
  //       }
  //     );

  //     return valid;
  // }

  onSubmitUser() {
    this.userRole = "Customer"
    this.OnSubmit();
  }

  onSubmitDeliverer() {
    this.userRole = "Seller"
    this.OnSubmit();
  }

  OnSubmit(){
    if (this.registerationForm.valid) { 
      if(this.selectedFile){
        console.log(this.userData())
        this.authService.register(this.userData()).subscribe(
          data=>{
            this.toastr.success('You have registered correctly, try loging in now', 'Succes!', {
              timeOut: 3000,
              closeButton: true,
            });
              let formData = new FormData();
              formData.append("myfile",this.selectedFile);
              this.userService.addPhoto(this.email.value,formData).subscribe(
                data=>{
                  this.toastr.success('Photo added', 'Succes!', {
                    timeOut: 3000,
                    closeButton: true,
                  });
                }, error => {
                  this.toastr.error("Faild to upload photo", 'Error!', {
                    timeOut: 3000,
                    closeButton: true,
                  });
                }
              );
            this.router.navigate(['/authentication/login']);
          }, error =>{
            this.toastr.error("Invalid input", 'Error!' , {
              timeOut: 3000,
              closeButton: true,
            });
          }

        );
      }
      else{
        this.toastr.error("Please select profile picture", 'Error!' , {
          timeOut: 3000,
          closeButton: true,
        });
      }
    }
    else{
      this.toastr.error("You have to input every field valid", 'Error!' , {
        timeOut: 3000,
        closeButton: true,
      });
    }
  }

  userData(): RegistrationUser {
    return this.user = {
        username: this.username.value,
        email: this.email.value,
        firstName: this.firstname.value,
        lastName: this.lastname.value,
        birthday: this.registerationForm.value['birthday'],
        address: this.address.value,
        role: this.userRole,
        password: this.password.value
    };
  }

  onFileChanged(imageInput: any){
    this.selectedFile = imageInput.files[0];
  }

  get username() {
    return this.registerationForm.get('username') as FormControl;
  }
  get email() {
    return this.registerationForm.get('email') as FormControl;
  }
  get firstname() {
    return this.registerationForm.get('firstname') as FormControl;
  }
  get lastname() {
    return this.registerationForm.get('lastname') as FormControl;
  }
  get address() {
    return this.registerationForm.get('address') as FormControl;
  }
  get password() {
      return this.registerationForm.get('password') as FormControl;
  }
  get confirmPassword() {
      return this.registerationForm.get('confirmPassword') as FormControl;
  }

}
