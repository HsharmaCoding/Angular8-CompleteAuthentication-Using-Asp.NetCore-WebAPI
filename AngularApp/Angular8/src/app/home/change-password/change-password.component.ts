import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './../../shared/user.service'
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private activeRout: ActivatedRoute,
    private router: Router,
    public userService: UserService,
    private toastrService: ToastrService) { }

  ngOnInit() {
    this.userService.resetPasswordModel.reset();
  }

  onSubmit() {

    this.userService.changePassword().subscribe(

      (res: any) => {
        if (res.success == true) {
          this.userService.resetPasswordModel.reset();
          this.toastrService.success(res.message, 'Success');
        }
        else {
          this.userService.resetPasswordModel.reset();
          this.toastrService.error(res.message, 'Error');
        }
      },
      err => {
        this.userService.resetPasswordModel.reset();
        this.toastrService.error('There is some problem while updating the password, Please contact to administrator.', 'Error');
      }
    )
  }

}
