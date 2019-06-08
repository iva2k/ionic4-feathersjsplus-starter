import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { NonauthGuardService } from './services/nonauth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
// ?  { path: '', redirectTo: 'login', pathMatch: 'full', canActivate: [NonauthGuardService] },
// ?  { path: '', redirectTo: 'menu', pathMatch: 'full', canActivate: [AuthGuardService] },
  // TODO: (soon) try canLoad instead of canActivate
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule', canActivate: [NonauthGuardService] },
  { path: 'menu' , loadChildren: './pages/menu/menu.module#MenuPageModule'   , canActivate: [AuthGuardService   ] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
