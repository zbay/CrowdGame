import { Component, OnInit } from '@angular/core';
import { FriendService } from '../friend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  friends = [];
  pendingFriends = [];
  pendingFriendsRequested = [];
  users = [];
  pageNum: Number = 1;

  constructor(private _friendService: FriendService, private _router: Router) {

  }

  ngOnInit() {
    let that = this;
    that._friendService.getFriends((friendsData) => {
      that.friends = friendsData.friends;
      that._friendService.getRequestedFriends((requestedFriendsData) =>{
        that.pendingFriends = requestedFriendsData.friend_requesters;
        that._friendService.getRequesteeFriends((requesteeFriendsData) => {
          that.pendingFriendsRequested = requesteeFriendsData.requestees;
          that._friendService.getUsers(
            {pageNum: that.pageNum, filterOut: that.concatIDs(that.friends, that.pendingFriends, that.pendingFriendsRequested)},
             (userData) => {
              that.users = userData.users;      
          }, 
          that.redirect.bind(that));
        },
        that.redirect.bind(that));
      }, 
      that.redirect.bind(that));
    }, 
    that.redirect.bind(that));
  }

  redirect(){
    this._router.navigate(['/events']);
  }

  concatIDs(arr1, arr2, arr3){
    let arr4 = [];
    for(let i = 0; i < arr1.length; i++){
      arr4.push(arr1[i]._id);
    }
    for(let i = 0; i < arr2.length; i++){
      arr4.push(arr2[i]._id);
    }
    for(let i = 0; i < arr3.length; i++){
      arr4.push(arr3[i]._id);
    }
    return arr4;
  }

  approveFriend(pendingFriendID: String){
    console.log("approving friend...");
    this._friendService.approveFriend({pendingFriendID: pendingFriendID}, () => {
      for(let i = 0; i < this.pendingFriends.length; i++){
        if(pendingFriendID == this.pendingFriends[i]._id){
          let newFriend = this.pendingFriends.splice(i, 1);
          this.friends.push(newFriend[0]);
        }
      }
    },
    this.redirect.bind(this));
  }

  unfriend(friendID: String){
    this._friendService.deleteFriend({friendID: friendID}, () => {
      for(let i = 0; i < this.pendingFriends.length; i++){
        if(friendID == this.friends[i]._id){
          let oldFriend = this.friends.splice(i, 1)[0];
          this.users.push(oldFriend);
        }
      }
    },
    this.redirect.bind(this));
  }

  friendRequest(pendingFriendID: String){
    this._friendService.requestFriend({pendingFriendID: pendingFriendID}, () => {
      for(let i = 0; i < this.users.length; i++){
        if(pendingFriendID == this.users[i]._id){
          this.pendingFriendsRequested.push(this.users.splice(i, 1)[0]); 
        }
      }
  }, this.redirect.bind(this));
}

deny(pendingFriendID: String){
  this._friendService.denyFriend({pendingFriendID: pendingFriendID}, () => {
    for(let i = 0; i < this.pendingFriends.length; i++){
      if(pendingFriendID == this.pendingFriends[i]._id){
        this.users.push(this.pendingFriends.splice(i, 1)[0]);
      }
    }
  }, this.redirect.bind(this));
}

cancel(pendingFriendID: String){
  this._friendService.cancelFriendRequest({pendingFriendID: pendingFriendID}, () => {
    for(let i = 0; i < this.pendingFriendsRequested.length; i++){
      if(pendingFriendID == this.pendingFriendsRequested[i]._id){
        this.users.push(this.pendingFriendsRequested.splice(i, 1)[0]);
      }
    }
  },
this.redirect.bind(this));
}

}
