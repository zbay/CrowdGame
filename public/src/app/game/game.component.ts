import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from '../game.service';
import * as io from 'socket.io-client'

// https://www.djamware.com/post/58e0d15280aca75cdc948e4e/building-chat-application-using-mean-stack-angular-4-and-socketio

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game = {_id: "", name: "No game!", time: "N/A", details: "No game with this ID exists. Maybe it was deleted?",
    location: "N/A", size: 0, players: [], creator: {}, comments: []};
  comment: "";
  gameID: String;
  joinErr;
  user_id: String;
  user_name: String;
  socket;
  commentErr;

  constructor(private _router: Router, private _loginService: LoginService, private _gameService: GameService, private _route: ActivatedRoute) { 
    this.socket = io.connect();
    this._route.paramMap.subscribe(params => {
      if(this.gameID){
        this.socket.emit("leaveRoom", this.gameID);
      }
      this.gameID = params.get('id');
      this.socket.emit("joinRoom", this.gameID);
    });
  }
  
    ngOnInit() {
      this._gameService.getGame(this.gameID, (data) => {
        this.game = data.game;
        let token = this._loginService.getDecodedToken();
        this.user_id = token.sub;
        this.user_name = token.name;
        this.socket.on("newMessage", function(newComment){
          this.game.comments.push(newComment);
        }.bind(this));
      }, this.redirect.bind(this));
    }

    ngOnDestroy(){
      this.socket.emit("leaveRoom", this.gameID);
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

    newComment(){
      this._gameService.newComment({comment: {message: this.comment, createdAt: Date.now(), author: this.user_name}}, this.game._id, (savedMsg) => {
        this.commentErr = undefined;
        this.socket.emit("newMessage", savedMsg, this.game._id);
      }, ()=>{
        this.commentErr = "Failed to save comment!";
      });
    }
}