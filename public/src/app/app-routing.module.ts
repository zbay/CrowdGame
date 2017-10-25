import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { SettingsComponent } from './settings/settings.component';
import { GamesComponent } from './games/games.component';
import { GameComponent } from './game/game.component';
import { NewgameComponent } from './newgame/newgame.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: LandingComponent},
  {path: 'settings', pathMatch: 'full', component: SettingsComponent},
  {path: 'games', pathMatch: 'full', component: GamesComponent},
  {path: 'new', pathMatch: 'full', component: NewgameComponent},
  {path: 'games/:id', pathMatch: 'full', component: GameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
