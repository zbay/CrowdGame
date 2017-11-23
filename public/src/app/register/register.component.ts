import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user = {firstName: "", lastName: "", email: "", password: "", passwordConfirmation: "", imgURL: ""}
  errorMsg = undefined;

  constructor(private _router: Router, private _loginService: LoginService) { }

  ngOnInit() {}

  register(){
    this._loginService.register(this.user, this.goBrowse.bind(this), this.showError.bind(this));
  }

  goBrowse(response){
    this._router.navigate(['/games']);
  }

  showError(err){
    console.log(err);
    this.errorMsg = JSON.parse(err._body).error;
  }
}
