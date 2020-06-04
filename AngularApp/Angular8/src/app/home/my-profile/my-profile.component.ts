import { Component, OnInit } from '@angular/core';
import { UserService } from './../../shared/user.service'
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  //Annonymous object to store the response.
  userDetails
  constructor(public userService: UserService,
    private toastrService: ToastrService) { }

  ngOnInit() {
    this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res;
        this.userService.myProfileModel.get('Email').setValue(this.userDetails.email);
        this.userService.myProfileModel.get('FirstName').setValue(this.userDetails.firstName);
        this.userService.myProfileModel.get('LastName').setValue(this.userDetails.lastName);
        this.userService.myProfileModel.get('Role').setValue(this.userDetails.role);
        this.userService.myProfileModel.get('UserID').setValue(this.userDetails.userId);
      },
      err => {
        console.log(err);
      },
    )

  }

  onSubmit() {
    this.userService.updateProfile().subscribe(

      (res: any) => {
        if (res.success == true) {
          this.toastrService.success(res.message, 'Success');
        }
        else {
          this.toastrService.error(res.message, 'Error');
        }
      },
      err => {
        this.toastrService.error('There is some problem while updating the profile, Please contact to administrator.', 'Error');
      }
    )
  }

}
