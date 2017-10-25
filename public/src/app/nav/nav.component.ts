import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private _router: Router, private _loginService: LoginService) { }

  ngOnInit() {}

  logout(){
    this._loginService.logout(this.goHome.bind(this));
  }

  goHome(){
    this._router.navigate(['/']);
  }
}
