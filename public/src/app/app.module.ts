import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ValidUrlDirective } from './shared/url.validator';
import { ValidEmailDirective } from './shared/email.validator';

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
import { AuthGuard } from './auth-guard.service';

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
    ValidEmailDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule
  ],
  providers: [LoginService, GameService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }