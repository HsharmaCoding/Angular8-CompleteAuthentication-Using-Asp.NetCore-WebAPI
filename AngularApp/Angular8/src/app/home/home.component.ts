import { Component, OnInit } from '@angular/core';
import { UserService } from './../shared/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userDetails

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res;
      },
      err => {
        console.log(err);
      },
    )
  }

  onLogout() {
    this.userService.logoutCurrentUser().subscribe(

      res => {
        
      },
      err => {

      },
    )
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }

}
