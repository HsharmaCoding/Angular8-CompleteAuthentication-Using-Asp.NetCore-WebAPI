import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { ForgetPasswordComponent } from './user/forget-password/forget-password.component';
import { HomeComponent } from './home/home.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AuthGuard } from './auth/auth.guard';
import { AccountActivationComponent } from './user/account-activation/account-activation.component';
import { PasswordResetComponent } from './user/password-reset/password-reset.component';
import { ChangePasswordComponent } from './home/change-password/change-password.component';
import { MyProfileComponent } from './home/my-profile/my-profile.component';
import { Program1Component } from './home/program1/program1.component';
import { Program2Component } from './home/program2/program2.component';

const routes: Routes = [
  {path:'',redirectTo:'user/login',pathMatch:'full'},
  {
    path:'user',component:UserComponent,
    children:[
      {path:'login',component:LoginComponent},
      {path:'registration',component:RegistrationComponent},
      {path:'forgetPassword',component:ForgetPasswordComponent},
      {path:'accountActivation',component:AccountActivationComponent},
      {path:'passwordReset',component:PasswordResetComponent},
    ]
  },
  {
    path:'home',component:HomeComponent,canActivate:[AuthGuard],
    children:[
      {path:'changePassword',component:ChangePasswordComponent},
      {path:'myProfile',component:MyProfileComponent},
      //Below just an example role based access of component
      {path:'program1',component:Program1Component,canActivate:[AuthGuard],data:{permittedRoles:['Admin']}},
      {path:'program2',component:Program2Component,canActivate:[AuthGuard],data:{permittedRoles:['Customer']}}
    ]
  },
  {path:'forbidden', component:ForbiddenComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
