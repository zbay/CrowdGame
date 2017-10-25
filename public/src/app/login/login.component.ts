import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user = {email: "", password: ""}
  errorMsg = undefined;
  that = this;

  constructor(private _router: Router, private _loginService: LoginService) { }

  ngOnInit() {
    console.log("login component");
  }

  login(){
    // need to bind this, since the callbacks are called from within the service
    this._loginService.login(this.user, this.goBrowse.bind(this), this.showError.bind(this)); 
  }

  goBrowse(user){
    console.log(user);
    this._router.navigate(['/games']);
  }

  showError(err){
    console.log(err);
    this.errorMsg = JSON.parse(err._body).error;
  }
}
