import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';
import { AuthGuardService } from '../../services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      { path: 'app', loadChildren: '../tabs/tabs.module#TabsPageModule', canActivate: [AuthGuardService   ] },

      // Catch-all for non-existing routes (must be last):
      { path: '**', redirectTo: 'app', pathMatch: 'full', }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
