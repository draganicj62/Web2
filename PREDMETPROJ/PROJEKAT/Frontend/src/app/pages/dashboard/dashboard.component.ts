import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  admin: string[] = ['Administrator'];
  customer: string[] = ['Customer'];
  seller: string[] = ['Seller'];
  constructor() { }

  ngOnInit() {
  }

}
