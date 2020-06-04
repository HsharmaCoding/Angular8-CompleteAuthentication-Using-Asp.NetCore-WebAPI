import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './../../shared/user.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.css']
})
export class AccountActivationComponent implements OnInit {

  constructor(private activeRout: ActivatedRoute,
    private router: Router,
    public userService: UserService,
    private toastrService: ToastrService) { }

  userId:string = "";
  code:string = "";
  encodedCode:string = "";
  isAccountActivated:boolean = false;
  serverResponseMessage:string = "";
  isShowAccountActivationResponseBlock:boolean = false;

  ngOnInit() {

    //Get url query string parameter
    this.activeRout.queryParams.subscribe(params => {
      this.userId = params['userId'];
      this.code = params['code'];
    });
    //encoding the code to send appropriately for verfication
    this.encodedCode = encodeURIComponent(this.code);
    this.confirmEmail(this.userId, this.encodedCode)
  }

  confirmEmail(userId, code) {

    this.userService.confirmUserEmail(userId, code).subscribe(

      (res: any) => {
        if (res.success == true) {
          this.isShowAccountActivationResponseBlock = true;
          this.isAccountActivated = true;
          this.serverResponseMessage = res.message;
        }
        else {
          this.isShowAccountActivationResponseBlock = true;
          this.isAccountActivated = false;
          this.serverResponseMessage = res.message;
        }
      },
      err => {
        this.isShowAccountActivationResponseBlock = true;
        this.isAccountActivated = false;
        this.serverResponseMessage = "Unable to verify the account";
      },
    )
  }
}
