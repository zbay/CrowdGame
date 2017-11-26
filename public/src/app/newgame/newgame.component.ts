import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-newgame',
  templateUrl: './newgame.component.html',
  styleUrls: ['./newgame.component.css']
})
export class NewgameComponent implements OnInit {
  game = {name: "", time: "", date: "", details: "", location: "", size: 2, category: "Sport"};
  errorMsg;

  constructor(private _router: Router, private _loginService: LoginService, private _gameService: GameService) { }

  ngOnInit() {
    this._loginService.getMe((data) => {
      if(!data.user.email){
        this._router.navigate(['/']);
      }
    }, ()=>{}); 
  }

  newGame(){
    console.log(this.game);
    this._gameService.newGame(this.game, this.goHome.bind(this), this.showErrors.bind(this));
  }

  goHome(){
    this._router.navigate(['/events']);
  }

  showErrors(err){
    this.errorMsg = JSON.parse(err._body).error;
  }
}
