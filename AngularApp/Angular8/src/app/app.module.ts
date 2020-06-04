import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule,FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './user/login/login.component';
import { RegistrationComponent } from './user/registration/registration.component';
import {UserService} from './shared/user.service';
import { ForgetPasswordComponent } from './user/forget-password/forget-password.component';
import { HomeComponent } from './home/home.component';
import { ForbiddenComponent } from './forbidden/forbidden.component'
import { AuthInterceptor } from './auth/auth.interceptor';
import { AccountActivationComponent } from './user/account-activation/account-activation.component';
import { PasswordResetComponent } from './user/password-reset/password-reset.component';
import { ChangePasswordComponent } from './home/change-password/change-password.component';
import { MyProfileComponent } from './home/my-profile/my-profile.component';
import { Program1Component } from './home/program1/program1.component';
import { Program2Component } from './home/program2/program2.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LoginComponent,
    RegistrationComponent,
    ForgetPasswordComponent,
    HomeComponent,
    ForbiddenComponent,
    AccountActivationComponent,
    PasswordResetComponent,
    ChangePasswordComponent,
    MyProfileComponent,
    Program1Component,
    Program2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      progressBar:true
    })
  ],
  providers: [UserService,{
    provide:HTTP_INTERCEPTORS,
    useClass:AuthInterceptor,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
