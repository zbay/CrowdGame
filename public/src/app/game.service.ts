import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class GameService {

  constructor(private _http: Http, private _authHttp: AuthHttp) { }

  getOpenGames(successCallback, failCallback){
    return this._authHttp.get("/api/openGames")
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

  deleteGame(id, successCallback, failCallback){
    return this._authHttp.delete("/api/game/" + id)
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
    return this._authHttp.get("/api/editGame", data)
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });
  }

  closeGame(data, successCallback, failCallback){
    return this._authHttp.post("/api/close", data)
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
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });
  }
}
