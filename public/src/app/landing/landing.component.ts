import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private _router: Router, private _loginService: LoginService) {}

  ngOnInit() {
    this._loginService.getMe((data) => {
      if(data.user.email){
        this._router.navigate(['/games']);
      }
    },
  ()=>{}); 
  }

}
