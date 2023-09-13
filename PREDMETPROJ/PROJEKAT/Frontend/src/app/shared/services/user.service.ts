import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UpdateUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) { }

  verify(id: number){
    return this.http.patch(this.baseUrl + '/v1/user/verify/' + id, null , this.getHttpHeader());
  }

  deny(id: number){
    return this.http.patch(this.baseUrl + '/v1/user/deny/' + id, null, this.getHttpHeader());
  }

  getSeller(){
    return this.http.get(this.baseUrl + '/v1/user/sellers', this.getHttpHeader());
  }

  getUserDetails(id: number){
    return this.http.get(this.baseUrl + '/v1/user/' + id, this.getHttpHeader());
  }

  update(user: UpdateUser){
    return this.http.patch(this.baseUrl + '/v1/user/update', user, this.getHttpHeader());
  }

  addPhoto(email: string, file: FormData){
    return this.http.post(this.baseUrl + '/v1/user/photo/' + email, file, this.getHttpHeaderNoToken())
  }

  updatePhoto(id: number, file: FormData){
    return this.http.post(this.baseUrl + '/v1/user/photo/update/' + id, file, this.getHttpHeader())
  }
  getHttpHeaderNoToken(): { headers: HttpHeaders; }{
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: "application/json"
      })
    };
    return httpOptions;
  }
  getHttpHeader(): { headers: HttpHeaders; }{
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: "application/json",
        Authorization: 'Bearer '+ localStorage.getItem('token')
      })
    };
    return httpOptions;
  }
}
