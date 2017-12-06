import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { SettingsComponent } from './settings/settings.component';
import { GamesComponent } from './games/games.component';
import { GameComponent } from './game/game.component';
import { NewgameComponent } from './newgame/newgame.component';
import { AuthGuard } from './auth-guard.service';
import { FriendsComponent } from './friends/friends.component';
import { MygamesComponent } from './mygames/mygames.component';
import { UserComponent } from './user/user.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: LandingComponent},
  {path: 'about', pathMatch: 'full', component: AboutComponent},
  {path: 'settings', pathMatch: 'full', component: SettingsComponent, canActivate: [AuthGuard]},
  {path: 'events', pathMatch: 'full', component: GamesComponent, canActivate: [AuthGuard]},
  {path: 'myEvents', pathMatch: 'full', component: MygamesComponent, canActivate: [AuthGuard]},
  {path: 'new', pathMatch: 'full', component: NewgameComponent, canActivate: [AuthGuard]},
  {path: 'event/:id', pathMatch: 'full', component: GameComponent, canActivate: [AuthGuard]},
  {path: 'friends', pathMatch: 'full', component: FriendsComponent, canActivate: [AuthGuard]},
  {path: 'user/:id', pathMatch: 'full', component: UserComponent, canActivate: [AuthGuard]},
  {path: '**', component: LandingComponent},     
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
