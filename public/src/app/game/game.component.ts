import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(private _router: Router, private _loginService: LoginService) { }
  
    ngOnInit() {
      this._loginService.getMe((data) => {
        if(!data.user.email){
          this._router.navigate(['/']);
        }
      }, () => {}); 
    }
}
