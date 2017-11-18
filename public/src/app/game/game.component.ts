import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game: Object = {name: "No game!", time: "N/A", details: "No game with this ID exists. Maybe it was deleted?", location: "N/A", size: 0};
  gameID: String;

  constructor(private _router: Router, private _loginService: LoginService, private _gameService: GameService, private _route: ActivatedRoute) { 
    this._route.paramMap.subscribe(params => {
      this.gameID = params.get('id');
    });
  }
  
    ngOnInit() {
      this._gameService.getGame(this.gameID, (data) => {
        this.game = data.game;
      }, () => {});
    }
}

// categories: Sport, In-Person Game, Online Game, Activism