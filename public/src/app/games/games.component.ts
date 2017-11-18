import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  games = [];

  constructor(private _router: Router, private _loginService: LoginService, private _gameService: GameService) { }

  ngOnInit() {
      console.log("games init");
        this._gameService.getOpenGames((data) => {
          this.games = data.games;
        }, () => {});
  }

}
