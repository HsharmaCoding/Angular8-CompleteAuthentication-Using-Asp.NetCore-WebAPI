import { Component, OnInit } from '@angular/core';
import { UserService } from './../../shared/user.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(public userService: UserService,
    private toastrService: ToastrService) { }


  ngOnInit() {
    this.userService.registrationModel.reset();
  }

  onSubmit() {
    this.userService.registrationModel.disable();
    this.userService.registration().subscribe(
      (res: any) => {
        if (res.succeeded) {
          this.userService.registrationModel.reset();
          this.toastrService.success('New user has been created.', 'Registration successful.');
          this.userService.registrationModel.enable();
        } else {
          debugger
          res.errors.forEach(element => {
            debugger
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastrService.error('Username is already taken', 'Registration failed.');
                this.userService.registrationModel.enable();
                break;

              default:
                this.toastrService.error(element.description, 'Registration failed.');
                this.userService.registrationModel.enable();
                break;
            }
          });
        }
      }
    )
  }
}
