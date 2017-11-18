import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';
import {LoginService} from './login.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _loginService: LoginService, private router: Router) { }
  canActivate() {
    return this.isLoggedIn();
  }
  isLoggedIn(){
    return true;
    /*this._loginService.getMe((data) => { // success function. return true if a user is saved in session
      console.log(data.user.email);
      if(data.user.email){
        return true;
      }
      else{
        console.log("returning false???");
        this.router.navigate(['/']); // redirect to home
        return false;
      }
    },
  ()=>{ // error function
    console.log("returning false, with an error???");
    this.router.navigate(['/']);
    return false;
  }); */
  }
}