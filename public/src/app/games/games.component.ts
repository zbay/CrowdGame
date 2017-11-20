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
  user_id: String;
  joinErr;

  constructor(private _router: Router, private _loginService: LoginService, private _gameService: GameService) { }

  ngOnInit() {
      console.log("games init");
        this._gameService.getOpenGames((data) => {
          this.games = data.games;
          this.user_id = this._loginService.getDecodedToken().sub;
        }, () => {
          this.redirect.bind(this);
        });
  }

  redirect(){
    this._router.navigate(['/']);
  }

  joinGame(gameID){
    this._gameService.joinGame({gameID: gameID}, () => {
      this.joinErr = undefined;
      for(let i = 0; i < this.games.length; i++){ // join the game without reloading from the server
        if(gameID === this.games[i]._id){
          this.games[i].players.push(this.user_id);
          break;
        }
      }
    }, ()=> {
      this.joinErr = "Failed to join this game! Maybe it was closed or deleted.";
    });
  }

  leaveGame(gameID){
    this._gameService.leaveGame({gameID: gameID}, () => {
      this.joinErr = undefined;
      for(let i = 0; i < this.games.length; i++){ // quit the game without reloading from the server
        if(gameID === this.games[i]._id){
          this.games[i].players.splice(i, 1);
          break;
        }
      }
    }, ()=> {
      this.joinErr = "Failed to leave this game! Maybe it was deleted.";
    });
  }

}
