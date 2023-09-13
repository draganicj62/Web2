import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  admin: string[] = ['Administrator'];
  customer: string[] = ['Customer'];
  seller: string[] = ['Seller'];
  constructor(private router: Router) { }

  ngOnInit() {
  }

  SignOut(): void{
    localStorage.clear();
    this.router.navigateByUrl('/authentication/login');
  }

  CheckDashboard(): void{
    this.router.navigateByUrl('/home/dashboard')
  }

  CheckProfile(): void{
    this.router.navigateByUrl('home/profile')
  }

  CheckCart(): void{
    this.router.navigateByUrl('/home/cart')
  }

  CheckHistory(): void{
    this.router.navigateByUrl('/home/history')
  }
}
