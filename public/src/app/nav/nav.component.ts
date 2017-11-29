import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  routeSubscription;
  currentRoute = "/";

  constructor(private _router: Router, private _loginService: LoginService) { 
    this.routeSubscription = _router.events.subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }

  ngOnInit() {}

  ngOnDestroy(){
    this.routeSubscription.unsubscribe();
  }

  logout(){
    this._loginService.logout(this.goHome.bind(this));
  }

  goHome(){
    this._router.navigate(['/']);
  }
}
