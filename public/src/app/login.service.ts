import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { tokenNotExpired } from 'angular2-jwt';
import * as jwtDecode from 'jwt-decode';

@Injectable()
export class LoginService {

  constructor(private _http: Http) { }

  register(data, successCallback, failCallback): Promise<void>{
    return this._http.post("/api/user", data)
      .map(response => response.json())
      .toPromise()
      .then((response) => {
        localStorage.setItem('token', response.token);
        successCallback(response);
      })
      .catch((err) => {
        failCallback(err);
      });  
  }

  login(data, successCallback, failCallback): Promise<void>{
    return this._http.post("/api/login", data)
    .map(response => response.json())
    .toPromise()
    .then((response) => {
      localStorage.setItem('token', response.token);
      console.log(response);
      successCallback(response);
    })
    .catch((err) => {
      console.log(err);
      failCallback(err);
    });      
  }

  editMe(data, successCallback, failCallback): Promise<void>{
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

  getMe(successCallback, failCallback): Promise<void>{
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

  logout(successCallback): void{
    localStorage.removeItem("token");
    successCallback();
  }

  isLoggedIn(): boolean{
    console.log(typeof localStorage.getItem("token"));
    console.log(localStorage.getItem("token"));
    if(!localStorage.getItem("token")){
      return false;
    }
    return tokenNotExpired("token");
  }

  getToken(): string{
    return localStorage.getItem("token");
  }

  isAdmin(): boolean{
    return jwtDecode(this.getToken()).scope === "admin";
  }

  getId(): string{
    return jwtDecode(this.getToken()).sub;
  }

}
