import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { SettingsComponent } from './settings/settings.component';
import { GamesComponent } from './games/games.component';
import { GameComponent } from './game/game.component';
import { NewgameComponent } from './newgame/newgame.component';
import { AuthGuard } from './auth-guard.service';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: LandingComponent},
  {path: 'settings', pathMatch: 'full', component: SettingsComponent, canActivate: [AuthGuard]},
  {path: 'games/:page', pathMatch: 'full', component: GamesComponent, canActivate: [AuthGuard]},
  {path: 'new', pathMatch: 'full', component: NewgameComponent, canActivate: [AuthGuard]},
  {path: 'game/:id', pathMatch: 'full', component: GameComponent, canActivate: [AuthGuard]},
  {path: '**', component: LandingComponent},     
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
