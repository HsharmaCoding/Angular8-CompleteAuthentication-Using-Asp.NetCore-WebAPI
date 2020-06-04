import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from './../../shared/user.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})


export class ForgetPasswordComponent implements OnInit {

  constructor(public userService: UserService,
    private toastrService: ToastrService,
    private router: Router) { }

  isDisabled:boolean= false;

  //forgetPasswordModel : Model (Template driver approach for validation. validation handled in UI)
  forgetPasswordModel = {
    Email: ""
  }

  ngOnInit() {
  }

  onSubmit(event: any, form: NgForm) {
    this.isDisabled = true;
    this.userService.SendPasswordResetLink(form.value.Email).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.toastrService.success('The Password reset link has been successfully sent to your registered email', 'Success');
          this.isDisabled = false;
          form.form.reset();
        }
        else {
          this.toastrService.error('There is some problem while sending password reset link to your email, Please contact to administrator.', 'Error');
          this.isDisabled = false;
          form.form.reset();
        }
      },
      err => {
        this.toastrService.error('There is some problem while sending password reset link to your email, Please contact to administrator.', 'Error');
        this.isDisabled = false;
        form.form.reset();
      }
    )
  }

}
