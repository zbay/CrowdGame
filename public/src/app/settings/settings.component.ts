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
  public uploader:FileUploader = new FileUploader({url: uploadURL, itemAlias: 'photo'});

  constructor(private _router: Router, private _loginService: LoginService) { }
  
    ngOnInit() {
      this._loginService.getMe((data) => {
        if(!data || !data.user || !data.user.email){
          this._router.navigate(['/']);
        }
        else{
          this.user = data.user;
       //override the onAfterAddingfile property of the uploader so it doesn't authenticate with //credentials.
       this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
       //overide the onCompleteItem property of the uploader so we are 
       //able to deal with the server response.
       this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
            console.log("ImageUpload:uploaded:", item, status, response);
        };
        }
      }, this.showError.bind(this)); 
    }

    showError(err){
      console.log(err);
      this.errorMsg = JSON.parse(err._body).error;
    }

}
