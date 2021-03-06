import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  @Input() myGamesTab = false;
  games = [];
  user_id: string;
  searchTerm: string;
  category: string;
  joinErr;
  pageNum: number = 1;
  perPage: number = 3;
  justMine: boolean = false;
  justFriends: boolean = false;

  constructor(private _router: Router, private _loginService: LoginService, private _gameService: GameService) {
   }

  ngOnInit() {
    if(this.myGamesTab){
      this.justMine = true;
    }
    this.getGames();
  }

  getGames(){
    let queryObj = {pageNum: this.pageNum, searchTerm: this.searchTerm || "", category: this.category || "Any", justMine: this.justMine};
    this._gameService.getOpenGames(queryObj, (data) => {
      console.log("getting games?");
      this.games = data.games;
      this.user_id = this._loginService.getDecodedToken().sub;
    }, () => {
      this.redirect.bind(this);
    });
  }

  getFriendGames(){
    let queryObj = {pageNum: this.pageNum, searchTerm: this.searchTerm || "", category: this.category || "Any", justMine: this.justMine};
    this._gameService.getFriendGames(queryObj, (data) => {
      console.log("getting friend games?");
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
      this.joinErr = "Failed to join game! Maybe it was closed or deleted.";
    });
  }

  leaveGame(gameID){
    this._gameService.leaveGame({gameID: gameID}, () => {
      this.joinErr = undefined;
      for(let i = 0; i < this.games.length; i++){ // quit the game without reloading from the server
        if(gameID === this.games[i]._id){
          for(let j = 0; j < this.games[i].players.length; j++){
            if(this.games[i].players[j] == this.user_id){
              this.games[i].players.splice(j, 1);
              if(this.justMine && this.games[i].creator != this.user_id){ // delete game if you only want yours, and you didn't create it
                this.games.splice(i, 1);
              }
              break;
            }
          }
      }
      }
    }, ()=> {
      this.joinErr = "Failed to leave game! Maybe it was deleted.";
    });
  }

  deleteGame(gameID){
    this._gameService.deleteGame({gameID: gameID}, () =>{
      this.joinErr = undefined;
      // delete game without reloading from server
      for(let i = 0; i < this.games.length; i++){
        if(gameID === this.games[i]._id){
          this.games.splice(i, 1);
        }
      }
    },
  () => {
    this.joinErr = "Failed to delete game! Are you logged in?";
  });
  }

  closeGame(gameID){
    this._gameService.closeGame({gameID: gameID}, () =>{
      this.joinErr = undefined;
      // remove game from list without reloading from server
      for(let i = 0; i < this.games.length; i++){
        if(gameID === this.games[i]._id){
          this.games[i].open = false;
          if(!this.justMine){
            this.games.splice(i, 1);
          }
        }
      }
    },
  () => {
    this.joinErr = "Failed to close game! Are you logged in?";
  });
  }

  openGame(gameID){
    this._gameService.openGame({gameID: gameID}, () =>{
      this.joinErr = undefined;
      // remove game from list without reloading from server
      for(let i = 0; i < this.games.length; i++){
        if(gameID === this.games[i]._id){
          this.games[i].open = true;
        }
      }
    },
  () => {
    this.joinErr = "Failed to close game! Are you logged in?";
  });
  }

  editGame(game){
    this._gameService.editGame({game: game}, () => {
      this.joinErr = undefined;
    }, () => {
      this.joinErr = "Failed to edit game! Make sure all fields are valid, and that you are logged in.";
    });
  }

  incPage(){
    this.pageNum++;
    this.getGames();
  }

  decPage(){
    this.pageNum--;
    this.getGames();
  }

  search(query){
    this.searchTerm = query.searchTerm;
    this.category = query.category;
    this.justMine = query.justMine;
    this.justFriends = query.justFriends;
    this.pageNum = 1;
    if(this.justFriends){
      this.getFriendGames();
    }
    else{
      this.getGames();
    }
  }

  resetSearch(){
    this.searchTerm = "";
    this.justFriends = false;
    this.category = "Any";
    this.pageNum = 1;
    this.getGames();
  }
}
