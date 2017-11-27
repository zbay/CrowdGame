import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileSelectDirective } from 'ng2-file-upload';
const uploadURL = 'http://localhost:7654/api/profilePic';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  user = {firstName: "", lastName: "", email: "", currentPassword: "", newPassword: "", imgURL: ""};
  errorMsg: String;
  successMsg: String;
  lastSavedImgURL: String;

  constructor(private _router: Router, private _loginService: LoginService) { }
  
    ngOnInit() {
      this.getMe();
    }

    getMe(){
      this._loginService.getMe((data) => {
          this.user = data.user;
          this.lastSavedImgURL = this.user.imgURL;
          this.user.currentPassword = "";
          this.user.newPassword = "";
        },
        this.redirect.bind(this)
      ); 
    }

    redirect(){
      this._router.navigate(['/']);
    }

    showError(err){
      console.log(err);
      this.errorMsg = JSON.parse(err._body).error;
    }

    saveChanges(){
      this._loginService.editMe(this.user, (response) => {
        this.successMsg = response.success;
        this.errorMsg = undefined;
        this.getMe();
      }, (err) => {
        console.log(err);
        this.errorMsg = err;
      });
    }
  }
