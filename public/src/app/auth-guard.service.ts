import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';
import {LoginService} from './login.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _loginService: LoginService, private router: Router) { }
  canActivate() {
    this._loginService.getMe((data) => { // success function. return true if a user is saved in session
      if(data.user.email){
        return true;
      }
      else{
        this.router.navigate(['/']); // redirect to home
        return false;
      }
    },
  ()=>{ // error function
    this.router.navigate(['/']);
    return false;
  }); 
  return false;
  }
}