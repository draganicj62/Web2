import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UserAuthorization } from "../shared/models/user";
import { AuthService } from "../shared/services/auth.service";

@Injectable({
    'providedIn': 'root'
})
export class RouteGuard  {

    user!: UserAuthorization;
    constructor(private router: Router,
                private authService: AuthService) { }

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
       
        if (localStorage.getItem('token')){

            this.user = this.authService.getUser(localStorage.getItem('token') as string);
            console.log('/////////////////////////////');
            if(this.user.role.includes(_route.data['role1']) || 
               this.user.role.includes(_route.data['role2']) || 
               this.user.role.includes(_route.data['role3'])){
               return true; 
            }
            else{
            this.router.navigate(['']);
            return false;
            }
        }
        else {
           this.router.navigate(['']);
           return false;
        }
    }

}