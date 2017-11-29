import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class GameService {

  constructor(private _http: Http, private _authHttp: AuthHttp) { }

  getOpenGames(data, successCallback, failCallback){
    return this._authHttp.post("/api/getGames/", data)
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });
  }

  getGame(id, successCallback, failCallback){
    return this._authHttp.get("/api/game/" + id)
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });
  }

  newGame(data, successCallback, failCallback){
    // save date, in local time
    // assumes YYYY-MM-DD format for date and HH:MM format for time
    data.date = this.padDatesWithZeroes(data.date);
    data.datetime = new Date(data.date + "T" + data.time);
    return this._authHttp.post("/api/newGame", data)
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });
  }

  getMyGames(successCallback, failCallback){
    return this._authHttp.get("/api/myGames")
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });
  }

  deleteGame(data, successCallback, failCallback){
    return this._authHttp.delete("/api/game/" + data.gameID)
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });
  }

  editGame(data, successCallback, failCallback){
    return this._authHttp.post("/api/editGame/" + data.game._id, data)
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });
  }

  padDatesWithZeroes(date){
    let firstDashIndex = date.indexOf("-");
    let temp = date.slice(firstDashIndex+1);
    if(temp.indexOf("-") === 1){ // tack on a zero to the month, if necessary
      date = date.slice(0, firstDashIndex+1) + "0" + date.slice(firstDashIndex+1);
    }
    temp = temp.slice(temp.indexOf("-")+1);
    if(temp.length === 1){ // tack on a zero to the day, if necessary
      date = date.slice(0, date.length-1) + "0" + date.charAt(date.length-1);
    }
    return date;
  }

  closeGame(data, successCallback, failCallback){
    return this._authHttp.post("/api/close/" + data.gameID, {})
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });
  }

  openGame(data, successCallback, failCallback){
    return this._authHttp.post("/api/open/" + data.gameID, {})
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });
  }

  joinGame(data, successCallback, failCallback){
    return this._authHttp.post("/api/join", data)
    .map(response => response.json())
    .toPromise()
    .then((response) => {
      successCallback(response);
    })
    .catch((err) => {
      failCallback(err);
    });
  }

  leaveGame(data, successCallback, failCallback){
    return this._authHttp.post("/api/leave", data)
    .map(response => response.json())
    .toPromise()
    .then((response) => {
      successCallback(response);
    })
    .catch((err) => {
      failCallback(err);
    });
  }

  newComment(data, gameID, successCallback, failCallback){
    return this._authHttp.post("/api/game/" + gameID + "/comment", data)
    .map(response => response.json())
    .toPromise()
    .then((response) => {
      successCallback(response);
    })
    .catch((err) => {
      failCallback(err);
    });
  }

  getFriendGames(data, successCallback, failCallback): Promise<void>{
    return this._authHttp.post("/api/friendGames", data)
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });      
  }
}
