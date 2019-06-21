import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';
import { AuthGuardService } from '../../services/auth-guard.service';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      // tab1
      {
        path: 'todos',
        children: [
          { path: ''      , loadChildren: '../todos-list/todos-list.module#TodosListPageModule'   , canActivate: [AuthGuardService   ] },
          { path: 'detail', loadChildren: '../todo-detail/todo-detail.module#TodoDetailPageModule', canActivate: [AuthGuardService   ] },
        ]
      },

      // tab2

      // tab3

      // Catch-all for non-existing routes (must be last):
      { path: '**', redirectTo: 'todos', pathMatch: 'full', }
    ]
  },

  // Catch-all for non-existing routes (must be last):
  { path: '**', redirectTo: 'tabs', pathMatch: 'full', }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
