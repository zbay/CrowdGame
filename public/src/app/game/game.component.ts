import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from '../game.service';
import * as io from 'socket.io-client'
import { FriendService } from '../friend.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game = {_id: "", name: "No game!", time: "N/A", details: "No game with this ID exists. Maybe it was deleted?",
    location: "N/A", size: 0, category: "N/A", players: [], creator: {}, comments: [], open: true};
  comment: "";
  gameID: string;
  joinErr;
  user_id: string;
  user_name: string;
  socket;
  commentErr;
  idSubscription;

  constructor(private _router: Router, private _loginService: LoginService, private _gameService: GameService, private _friendService: FriendService, private _route: ActivatedRoute) { 
    this.socket = io.connect();
    this.idSubscription = this._route.paramMap.subscribe(params => {
      if(this.gameID){
        this.socket.emit("leaveRoom", this.gameID);
      }
      this.gameID = params.get('id');
      this.socket.emit("joinRoom", this.gameID);
    });
  }
  
    ngOnInit() {
      let token = this._loginService.getDecodedToken();
      this._gameService.getGame(this.gameID, (data) => {
        if(!data.game.friends_only || token.sub === data.game.creator._id){
          this.setupGame(data, token);
        }
        else{
          this._friendService.verifyFriendship({hostID: data.game.creator._id}, (res) => {
            if(res.areFriends){
              this.setupGame(data, token);
            }
            this.redirect.bind(this);
          }, 
          this.redirect.bind(this));
        }
      }, this.redirect.bind(this));
    }

    ngOnDestroy(){
      this.socket.emit("leaveRoom", this.gameID);
      this.idSubscription.unsubscribe();
    }

    setupGame(data, token){
      this.game = data.game;
      this.user_id = token.sub;
      this.user_name = token.name;
      this.socket.on("newMessage", function(newComment){
        this.game.comments.push(newComment);
      }.bind(this));      
    }

    redirect(){
      this._router.navigate(['/events']);
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

    deleteGame(gameID){
      this._gameService.deleteGame({gameID: gameID}, () =>{
        this.redirect();
      },
    () => {
      this.joinErr = "Failed to delete game! Are you logged in?";
    });
    }
  
    closeGame(gameID){
      this._gameService.closeGame({gameID: gameID}, () =>{
        this.joinErr = undefined;
        this.game.open = false;
      },
    () => {
      this.joinErr = "Failed to close game! Are you logged in?";
    });
    }

    openGame(gameID){
      this._gameService.openGame({gameID: gameID}, () => {
        this.joinErr = undefined;
        this.game.open = true;
      },
    () => {
      this.joinErr = "Failed to open game! Are you logged in?";
    });
    }
  
    editGame(game){
      console.log("Editing game");
      this._gameService.editGame({game: game}, () => {
        this.joinErr = undefined;
      }, () => {
        this.joinErr = "Failed to edit game! Make sure all fields are valid, and that you are logged in.";
      });
    }

    newComment(){
      this._gameService.newComment({comment: {message: this.comment, author: this.user_name}}, this.game._id, (savedMsg) => {
        this.commentErr = undefined;
        this.socket.emit("newMessage", savedMsg, this.game._id);
      }, ()=>{
        this.commentErr = "Failed to save comment!";
      });
    }
}