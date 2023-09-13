import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { LoginComponent } from './pages/authentication/login/login.component';
import { RegistrationComponent } from './pages/authentication/registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddArticleComponent } from './components/add-article/add-article.component';
import { HasRoleDirective } from './directives/has-role.directive';
import { SellerListComponent } from './components/seller-list/seller-list.component';
import { AllOrdersComponent } from './components/all-orders/all-orders.component';
import { ShowUserProfileComponent } from './components/show-user-profile/show-user-profile.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AllArticlesComponent } from './components/all-articles/all-articles.component';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { SellerArticlesComponent } from './components/seller-articles/seller-articles.component';
import { ArticleSellerCardComponent } from './components/article-seller-card/article-seller-card.component';
import { ArticleComponent } from './pages/article/article.component';
import { ActiveOrdersComponent } from './components/active-orders/active-orders.component';
import { CountdownModule } from 'ngx-countdown';
import { DisableCertValidationInterceptor } from './disable-cert-validation.interceptor';
import { PaymentComponent } from './pages/payment/payment.component';
import { MapComponent } from './pages/map/map.component';
import { ConfirmComponent } from './pages/confirm/confirm.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    LoginComponent,
    RegistrationComponent,
    DashboardComponent,
    AddArticleComponent,
    SellerListComponent,
    AllOrdersComponent,
    ShowUserProfileComponent,
    HasRoleDirective,
    ProfileComponent,
    NavbarComponent,
    HomeComponent,
    OrderHistoryComponent,
    AllArticlesComponent,
    ArticleCardComponent,
    SellerArticlesComponent,
    ArticleSellerCardComponent,
    ArticleComponent,
    ActiveOrdersComponent,
    PaymentComponent,
    MapComponent,
    ConfirmComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    CountdownModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: DisableCertValidationInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
