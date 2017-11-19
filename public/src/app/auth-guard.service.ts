import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';
import {LoginService} from './login.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _loginService: LoginService, private router: Router) { }
  canActivate() {
    if(this._loginService.isLoggedIn()){
      return true;
    }
    else{
      this.router.navigate(["/"]);
      return false;
    }
  }
}