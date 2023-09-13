import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetails } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-show-user-profile',
  templateUrl: './show-user-profile.component.html',
  styleUrls: ['./show-user-profile.component.css']
})
export class ShowUserProfileComponent implements OnInit {
  user!: UserDetails;
  id: any;
  token: any;
  pomUser: any;

  constructor(private route: Router,
              private userService: UserService,
              private authService: AuthService) { }

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails(){
    if(localStorage.getItem('tokenGoogle')==null || localStorage.getItem('tokenGoogle') == ""){
      //ulogovali smo se preko aplikacije
      this.token = localStorage.getItem('token');
      this.id = this.authService.getUserId(this.token);
      this.userService.getUserDetails(this.id).subscribe(
        data=>{
          this.user = data as UserDetails;
        }, error =>{
          console.log('Error occurred at show-user-profile.component.ts')
        }
      );
    }
    else
    {
      this.pomUser = this.authService.getUser(localStorage.getItem('tokenGoogle') as string);
      console.log(this.pomUser);
      this.user = this.pomUser as UserDetails;
      this.user.username = this.pomUser.name;
      this.user.verificationStatus = "Verified";
    }
  }

  ChangeProfile(): void {
    this.route.navigateByUrl('home/profile');
  }
}
