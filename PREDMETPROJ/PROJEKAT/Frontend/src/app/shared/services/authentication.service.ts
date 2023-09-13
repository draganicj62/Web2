import { Injectable } from '@angular/core';
import { LogGogle, LoginUser, RegistrationUser } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  login(user: LoginUser){
    return this.http.post(this.baseUrl + '/v1/user/authentication', user, this.getHttpHeader());
  }

  loginGoogle(user: LogGogle){
    return this.http.post(this.baseUrl + '/v1/user/googleAuth', user, this.getHttpHeader());
  }

  register(user: RegistrationUser){
    return this.http.post(this.baseUrl + '/v1/user/register', user);
  }

  getHttpHeader(): { headers: HttpHeaders; }{
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: "application/json"
      })
    };
    return httpOptions;
  }
}
