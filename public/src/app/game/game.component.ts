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
  game = {_id: "", name: "No game!", time: "N/A", details: "No game with this ID exists. Maybe it was deleted?", location: "N/A", size: 0, players: [], creator: {}};
  gameID: String;
  joinErr;
  user_id: String;

  constructor(private _router: Router, private _loginService: LoginService, private _gameService: GameService, private _route: ActivatedRoute) { 
    this._route.paramMap.subscribe(params => {
      this.gameID = params.get('id');
    });
  }
  
    ngOnInit() {
      this._gameService.getGame(this.gameID, (data) => {
        this.game = data.game;
        this.user_id = this._loginService.getDecodedToken().sub;
      }, this.redirect.bind(this));
    }

    redirect(){
      this._router.navigate(['/']);
    }

    joinGame(gameID){
      this._gameService.joinGame({gameID: gameID}, () => {
        this.joinErr = undefined;
        // join the game without reloading from the server
        if(gameID === this.game._id){
          this.game.players.push(this.user_id);
        }
      }, ()=> {
        this.joinErr = "Failed to join this game! Maybe it was closed or deleted.";
      });
    }
  
    leaveGame(gameID){
      console.log("Deleting: " + gameID);
      this._gameService.leaveGame({gameID: gameID}, () => {
        this.joinErr = undefined;
        if(gameID === this.game._id){
          for(let i = 0; i < this.game.players.length; i++){
            if(this.game.players[i] === this.user_id){
              this.game.players.splice(i, 1);
              break;
            }
          }
        }
      }, ()=> {
        this.joinErr = "Failed to leave this game! Maybe it was deleted.";
      });
    }
}