import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, RequestOptions, Http } from '@angular/http';
import { ValidUrlDirective } from './shared/url.validator';
import { ValidEmailDirective } from './shared/email.validator';
import { ValidTimeDirective } from './shared/time.validator';
import { ValidDateDirective } from './shared/date.validator';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { GamesComponent } from './games/games.component';
import { NewgameComponent } from './newgame/newgame.component';
import { GameComponent } from './game/game.component';
import { SettingsComponent } from './settings/settings.component';
import { NavComponent } from './nav/nav.component';
import { SearchComponent } from './search/search.component';

import { LoginService } from './login.service';
import { GameService } from './game.service';
import { FriendService } from './friend.service';
import { AuthGuard } from './auth-guard.service';
import { AdminComponent } from './admin/admin.component';
import { provideAuth, AuthHttp, AuthConfig } from 'angular2-jwt';
import { GameboxComponent } from './gamebox/gamebox.component';
import { MygamesComponent } from './mygames/mygames.component';
import { FriendsComponent } from './friends/friends.component';
import { UserComponent } from './user/user.component';
import { AboutComponent } from './about/about.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenGetter: () => { return localStorage.getItem('token'); }
  }), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LoginComponent,
    RegisterComponent,
    GamesComponent,
    NewgameComponent,
    GameComponent,
    SettingsComponent,
    NavComponent,
    SearchComponent,
    ValidUrlDirective,
    ValidEmailDirective,
    ValidTimeDirective,
    ValidDateDirective,
    AdminComponent,
    GameboxComponent,
    MygamesComponent,
    FriendsComponent,
    UserComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule
  ],
  providers: [LoginService, GameService, FriendService, AuthGuard, 
  {
    provide: AuthHttp,
    useFactory: authHttpServiceFactory,
    deps: [Http, RequestOptions]
  }], // pass JWT token with every request
  bootstrap: [AppComponent]
})
export class AppModule { }