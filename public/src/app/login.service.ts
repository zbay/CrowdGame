import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LoginService {

  constructor(private _http: Http) { }

  register(data, successCallback, failCallback){
    return this._http.post("/api/user", data)
      .map(response => response.json())
      .toPromise()
      .then((user) => {
        successCallback(user);
      })
      .catch((err) => {
        failCallback(err);
      });  
  }

  login(data, successCallback, failCallback){
    return this._http.post("/api/login", data)
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      console.log(user);
      successCallback(user);
    })
    .catch((err) => {
      console.log(err);
      failCallback(err);
    });      
  }

  editMe(data, successCallback, failCallback){
    return this._http.post("/api/settings", data)
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });      
  }

  getMe(successCallback, failCallback){
    return this._http.get("/api/me")
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });      
  }

  logout(successCallback){
    return this._http.get("/api/logout")
    .map(response => response.json())
    .toPromise()
    .then(() => {
      successCallback();
    })
    .catch((err) => {
      console.log(err);
    });  
  }

}
