import { Injectable } from '@angular/core';
import { UserAuthorization } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
  
  user!: UserAuthorization;   
  userId!: number;
  theToken: any;
  pom:any;

constructor() { }
  getUser(token: string): UserAuthorization {
    if(token){
      this.pom = JSON.parse(atob(token.split('.')[1]));
      if(this.pom.iss == "accounts.google.com")
        this.pom['role']="Customer";
      return this.pom as UserAuthorization;
    }
    else {
      let fakeUser: UserAuthorization = {
        unique_name: "fake",
        nameid: "fake",
        role: "fake"
      }
      return fakeUser
    }
  }

  getUserId(token: string): number{
    this.user = JSON.parse(atob(token.split('.')[1]));
    this.userId = Number(this.user.nameid);
    return this.userId;
  }

  hasRole(role: string[]): boolean {
    this.user = this.getUser(localStorage.getItem('token') as string);
    if(this.user.role =="fake"){
      return false;
    }
    else{
      for (let i = 0; i < role.length; i++) {
        if (this.user.role.includes(role[i])) {
          return true;
        }    
      }
      return false;
    }
  }
}
