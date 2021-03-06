import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { NonauthGuardService } from './services/nonauth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // TODO: (soon) try canLoad instead of canActivate
  { path: 'login'                       , loadChildren: './pages/login/login.module#LoginPageModule', canActivate: [NonauthGuardService] },
  { path: 'menu'                        , loadChildren: './pages/menu/menu.module#MenuPageModule'   , canActivate: [AuthGuardService   ] },
  { path: 'reset-password'              , loadChildren: './pages/reset-password/reset-password.module#ResetPasswordPageModule' }, // No entry guard
  { path: 'reset-password/:token'       , loadChildren: './pages/reset-password/reset-password.module#ResetPasswordPageModule' }, // No entry guard

  // Catch-all for non-existing routes (must be last):
  { path: '**', redirectTo: '/login', pathMatch: 'full', }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
