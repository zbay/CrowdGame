import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { tokenNotExpired, AuthHttp } from 'angular2-jwt';
//import * as jwtDecode from 'jwt-decode';

@Injectable()
export class FriendService {
  api_url: String="/api/";

  constructor(private _authHttp: AuthHttp) { }

  requestFriend(data, successCallback, failCallback): Promise<void>{
    return this._authHttp.post(this.api_url + "requestFriend", data)
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });      
  }

  cancelFriendRequest(data, successCallback, failCallback): Promise<void>{
    return this._authHttp.post(this.api_url + "cancelFriendRequest", data)
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });      
  }

  denyFriend(data, successCallback, failCallback): Promise<void>{
    return this._authHttp.post(this.api_url + "denyFriend", data)
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });      
  }

  approveFriend(data, successCallback, failCallback): Promise<void>{
    return this._authHttp.post(this.api_url + "approveFriend", data)
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });      
  }

  deleteFriend(data, successCallback, failCallback): Promise<void>{
    return this._authHttp.post(this.api_url + "deleteFriend", data)
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });      
  }

  getFriends(successCallback, failCallback): Promise<void>{
    return this._authHttp.get(this.api_url + "friendInfo")
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });      
  }

  getUsers(data, successCallback, failCallback): Promise<void>{
    console.log("should be getting users....");
    return this._authHttp.post(this.api_url + "users", data)
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });      
  }

  getRequestedFriends(successCallback, failCallback): Promise<void>{
    return this._authHttp.get(this.api_url + "requestedFriends")
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });      
  }

  getRequesteeFriends(successCallback, failCallback): Promise<void>{
    return this._authHttp.get(this.api_url + "requesteeFriends")
    .map(response => response.json())
    .toPromise()
    .then((user) => {
      successCallback(user);
    })
    .catch((err) => {
      failCallback(err);
    });      
  }

  verifyFriendship(data, successCallback, failCallback): Promise<void>{
    return this._authHttp.post(this.api_url + "verifyFriendship", data)
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
