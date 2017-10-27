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
  user;
  errorMsg;

  constructor(private _router: Router, private _loginService: LoginService) { }
  
    ngOnInit() {
      this._loginService.getMe((data) => {
        if(!data || !data.user || !data.user.email){
          this._router.navigate(['/']);
        }
        else{
          this.user = data.user;
        }
        },
        this.showError.bind(this)
      ); 
    }

    showError(err){
      console.log(err);
      this.errorMsg = JSON.parse(err._body).error;
    }
  }
