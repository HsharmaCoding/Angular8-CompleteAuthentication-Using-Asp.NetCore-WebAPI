import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient) { }

  readonly BaseURI = 'https://localhost:44355/api';

  //Registration model with Reactive Form Approach/Validation
  registrationModel = this.formBuilder.group({
    FirstName: ['', Validators.required],
    LastName: ['', Validators.required],
    Email: ['', [Validators.email, Validators.required]],
    Passwords: this.formBuilder.group({
      Password: ['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.comparePasswords })
  });

  //Reset Password model with Reactive Form Approach/Validation
  resetPasswordModel = this.formBuilder.group({
    Passwords: this.formBuilder.group({
      Password: ['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.comparePasswords })
  });

  //Reset Password model with Reactive Form Approach/Validation
  changePasswordModel = this.formBuilder.group({
    CurrentPassword: ['', [Validators.required, Validators.minLength(4)]],
    Passwords: this.formBuilder.group({
      Password: ['', [Validators.required, Validators.minLength(4)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.comparePasswords })
  });

  //My profile model with Reactive Form Approach/Validation
  myProfileModel = this.formBuilder.group({
    FirstName: ['', Validators.required],
    LastName: ['', Validators.required],
    Email: ['', [Validators.email, Validators.required]],
    Role: [''],
    UserID: ['']
  });


  //Method to check password and confirm password
  comparePasswords(formBuilder: FormGroup) {
    let confirmPswrdCtrl = formBuilder.get('ConfirmPassword')

    if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      if (formBuilder.get('Password').value != confirmPswrdCtrl.value) {
        confirmPswrdCtrl.setErrors({ passwordMismatch: true })
      }
      else {
        confirmPswrdCtrl.setErrors(null);
      }
    }
  }

  //Get the role match for user
  roleMatch(allowedRoles): boolean {
    var isMatch = false;
    var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    var userRole = payLoad.role;
    allowedRoles.forEach(element => {
      if (userRole == element) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }

  //CreateUser : API
  registration() {
    var body = {
      FirstName: this.registrationModel.value.FirstName,
      LastName: this.registrationModel.value.LastName,
      Email: this.registrationModel.value.Email,
      Password: this.registrationModel.value.Passwords.Password,
    };
    return this.http.post(this.BaseURI + '/User/CreateUser', body);
  }

  //Login : API
  login(loginModel) {
    return this.http.post(this.BaseURI + '/User/Login', loginModel);
  }

  //GetUserProfile : API
  getUserProfile() {
    return this.http.get(this.BaseURI + '/User/GetUserProfile');
  }

  //SignOut : API
  logoutCurrentUser() {
    return this.http.get(this.BaseURI + '/User/SignOut');
  }

  //SaveUserInformation : API
  updateProfile() {
    var body = {
      FirstName: this.myProfileModel.value.FirstName,
      LastName: this.myProfileModel.value.LastName,
      Email: this.myProfileModel.value.Email,
      Role: this.myProfileModel.value.Role,
      UserID: this.myProfileModel.value.UserID,
    };

    return this.http.post(this.BaseURI + '/User/SaveUserInformation', body);
  }

  //ChangePassword : API
  changePassword() {
    var body = {
      CurrentPassword: this.changePasswordModel.value.CurrentPassword,
      Password: this.changePasswordModel.value.Passwords.Password,
    };
    return this.http.post(this.BaseURI + '/User/ChangePassword', body);
  }

  //ConfirmEmail : API
  confirmUserEmail(userId, code) {
    return this.http.get(this.BaseURI + '/User/ConfirmEmail', {
      params: {
        userId: userId,
        code: code
      }
    });
  }

  //SendForgotPasswordEmail : API
  SendPasswordResetLink(email) {
    return this.http.get(this.BaseURI + '/User/SendForgotPasswordEmail', {
      params: {
        email: email
      }
    });
  }

  //ResetPassword : API
  resetUserPassword(userId, code) {
    var body = {
      Password: this.resetPasswordModel.value.Passwords.Password,
      UserID: userId,
      Code: code,
    };
    return this.http.post(this.BaseURI + '/User/ResetPassword', body);
  }

}
