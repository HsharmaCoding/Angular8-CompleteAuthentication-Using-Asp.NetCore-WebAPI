import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from './../../shared/user.service'
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public userService: UserService,
    private toastrService: ToastrService,
    private router: Router) { }

  isDisabled = false;

  //loginModel : Model (Template driver approach for validation. validation handled in UI)
  loginModel = {
    Email: "",
    Password: ""
  }

  ngOnInit() {
    if (localStorage.getItem('token') != null)
    this.router.navigateByUrl('/home');
  }

  onSubmit(event: any, form: NgForm) {
    this.isDisabled = true;
    this.userService.login(form.value).subscribe(
      (res: any) => {
        if (res.success == true) {
          localStorage.setItem('token', res.token);
          this.router.navigateByUrl('/home');
          this.isDisabled = false;
          form.form.reset();
        }
        else {
          this.toastrService.error(res.message);
          this.isDisabled = false;
          form.form.reset();
        }
      },
      err => {
        this.toastrService.error('There is some problem while doing login, Please contact to administrator.', 'Error');
        this.isDisabled = false;
        form.form.reset();
      }
    )
  }
}
