import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserDetails } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-seller-list',
  templateUrl: './seller-list.component.html',
  styleUrls: ['./seller-list.component.css']
})
export class SellerListComponent implements OnInit {
  sellers!: UserDetails[];
  pending!: string;
  
  constructor(private userService: UserService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.pending = "Pending";
    this.getAllDeliverers()
  }
  getAllDeliverers(): void{
    this.userService.getSeller().subscribe(
      data=>{
        this.sellers = data as UserDetails[];
      }, error =>{
        console.log('Error occurred at deliverers-list.component.ts')
      }
    );
  }

  Accept(id: number): void{
    this.userService.verify(id).subscribe(
      data=>{
        this.toastr.success('You hired another worker!', 'Succes!', {
          timeOut: 3000,
          closeButton: true,
        });
      }, error =>{
        this.toastr.error("Faild to hire a person", 'Error!', {
          timeOut: 3000,
          closeButton: true,
        });
      }

    );
  }

  Deny(id: number): void{
    this.userService.deny(id).subscribe(
      data=>{
        this.toastr.success('You have declined a job application!', 'Succes!', {
        timeOut: 3000,
        closeButton: true,
      });
      }, error =>{
        this.toastr.error("Faild to decline a job application", 'Succes!', {
          timeOut: 3000,
          closeButton: true,
        });
      }

    );
  }

}
