import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  constructor(private _router: Router, private _loginService: LoginService) { }

  ngOnInit() {
    this._loginService.getMe((data) => {
      console.log("checking login status");
      console.log(data.user);
      console.log(data.user.useremail);
      if(!data.user.email){
        this._router.navigate(['/']);
      }
    }, ()=>{}); 
  }

}
