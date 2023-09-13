import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LogGogle, LoginUser, UpdateUser } from 'src/app/shared/models/user';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  user!: LoginUser;
  auth2: any;
  googleUser!: LogGogle;
  @ViewChild('loginRef', {static: true }) loginElement!: ElementRef;

  constructor(private router: Router,
              private fb: FormBuilder,
              private authService: AuthenticationService,
              private toastr: ToastrService,
              private ngZone: NgZone) {
  }

  ngOnInit() {
    this.googleAuthSDK();
    this.createLoginForm();
  }

  createLoginForm(){
    this.loginForm = this.fb.group({
      email: [null,[Validators.required,Validators.email]],
      password: [null,[Validators.required,Validators.minLength(8)]]
    })
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value)
      this.authService.login(this.loginForm.value).subscribe(
        (res: any) => {
          console.log(res)
          localStorage.setItem("token", res);
          this.toastr.success('You are now loged in. Welcome!', 'Succes!', {
            timeOut: 3000,
            closeButton: true,
          });
          this.router.navigateByUrl('home/dashboard');
        },
        err => {
          console.log(err);
            this.toastr.error("Wrong email or password", 'Error!' , {
              timeOut: 3000,
              closeButton: true,
            });
        }
      );
    }
  }

  googleUserData(profile: any): LogGogle{
    return this.googleUser = {
      username: profile.getName(),
      role: "Customer",
      id: Number((profile.getId() as string).substring(0,9))
    };
  }

  userData(): LoginUser {
    return this.user = {
        email: this.email.value,
        password: this.password.value
    };
  }

  callLoginButton() {

    console.log('usao u callLoginButton');
    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},

      (googleAuthUser:any) => {
        let profile = googleAuthUser.getBasicProfile();
        console.log('Token || ' + googleAuthUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        localStorage.setItem('tokenGoogle', googleAuthUser.getAuthResponse().id_token);
        localStorage.setItem('id', profile.getId());

        this.authService.loginGoogle(this.googleUserData(profile)).subscribe(
          (res: any) => {
            console.log('Token aplikacije: ' + res)
            localStorage.setItem("token", res);
            this.toastr.success('You are now loged in. Welcome!', 'Succes!', {
              timeOut: 3000,
              closeButton: true,
            });
            this.router.navigateByUrl('home/dashboard');
          },
          err => {
            console.log(err);
              this.toastr.error("Something went wrong.", 'Error!' , {
                timeOut: 3000,
                closeButton: true,
              });
          }
        );

       /* Write Your Code Here */
       console.log('HURAAAAAAAAAAAAAAA');
       //this.ngZone.run(() => this.router.navigateByUrl('/home/dashboard'))
       this.router.navigateByUrl('/home/dashboard');
      }, (error:any) => {
        this.toastr.error(error.error.errorMessage, 'Error!' , {
          timeOut: 3000,
          closeButton: true,
        });
      });

  }

  /**
   * Write code on Method
   *
   * @return response()
   */
  googleAuthSDK() {
    console.log('usao u googleAuthSDK');
    (<any>window)['googleSDKLoaded'] = () => {
      (<any>window)['gapi'].load('auth2', () => {
        this.auth2 = (<any>window)['gapi'].auth2.init({
          client_id: '918432122938-cd6oba2qtpsle40ehi05pde64rf8p1ka.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          plugin_name:'login',
          scope: 'profile email'
        });
        this.callLoginButton();
      });
    }
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement('script');
      js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs?.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
  }

  get email() {
    return this.loginForm.get('email') as FormControl;
  }
  get password() {
    return this.loginForm.get('password') as FormControl;
  }
}
