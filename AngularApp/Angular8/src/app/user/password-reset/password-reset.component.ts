import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './../../shared/user.service'
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  constructor(private activeRout: ActivatedRoute,
    private router: Router,
    public userService: UserService,
    private toastrService: ToastrService) { }

  userId: string = "";
  code: string = "";
  encodedCode: string = "";

  ngOnInit() {
    this.userService.resetPasswordModel.reset();
    //Get the query string parameter from url
    this.activeRout.queryParams.subscribe(params => {
      this.userId = params['userId'];
      this.code = params['code'];
    });
    //Encoded the code to send appropriately for verfication
    this.encodedCode = encodeURIComponent(this.code);
  }

  onSubmit() {
    this.userService.resetPasswordModel.disable();
    this.userService.resetUserPassword(this.userId, this.encodedCode).subscribe(

      (res: any) => {
        debugger
        if (res.success == true) {
          this.toastrService.success(res.message, 'Success');
          this.userService.resetPasswordModel.reset();
          this.userService.resetPasswordModel.enable();
          this.router.navigateByUrl('user/login');
        }
        else {
          this.toastrService.error(res.message, 'Error');
          this.userService.resetPasswordModel.reset();
          this.userService.resetPasswordModel.enable();
        }
      },
      err => {
        debugger
        this.toastrService.error('There is some problem while updating your password, Please contact to administrator.', 'Error');
        this.userService.resetPasswordModel.reset();
        this.userService.resetPasswordModel.enable();
      }
    )
  }

}
