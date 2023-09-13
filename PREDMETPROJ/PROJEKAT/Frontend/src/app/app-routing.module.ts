import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { LoginComponent } from './pages/authentication/login/login.component';
import { RegistrationComponent } from './pages/authentication/registration/registration.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RouteGuard } from './core/route.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';
import { ArticleComponent } from './pages/article/article.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { MapComponent } from './pages/map/map.component';
import { ConfirmComponent } from './pages/confirm/confirm.component';

const routes: Routes = [
  {path:'', redirectTo:'/authentication/login',pathMatch:'full'},
  {
    path:'authentication', component: AuthenticationComponent,
    children:[
      { path: 'login', component: LoginComponent},
      { path: 'registration', component: RegistrationComponent},
    ]
  },
  {path:'home', component: HomeComponent, canActivate: [RouteGuard],
    data:{
      role1: "Administrator",
      role2: "Seller",
      role3: "Customer"
    },
    children:[
      {
        path:'dashboard', component: DashboardComponent, canActivate: [RouteGuard],
        data: {
          role1: "Administrator",
          role2: "Seller",
          role3: "Customer"
        }
      },
      {
        path:'profile', component: ProfileComponent, canActivate: [RouteGuard],
        data: {
          role1: "Administrator",
          role2: "Seller",
          role3: "Customer"
        }
      },
      {
        path:'article/:id', component: ArticleComponent, canActivate: [RouteGuard],
        data: {
          role2: "Seller",
        }
      },
      {
        path:'payment', component: PaymentComponent, canActivate: [RouteGuard],
        data: {
          role3: "Customer",
        }
      },
      {
        path:'map', component: MapComponent, canActivate: [RouteGuard],
        data: {
          role3: "Seller",
        }
      },
      {
        path:'confirm/:id', component: ConfirmComponent, canActivate: [RouteGuard],
        data: {
          role3: "Seller",
        }
      }
    ]
  },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
