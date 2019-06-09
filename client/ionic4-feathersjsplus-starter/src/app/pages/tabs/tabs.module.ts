import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      // tab1
      {
        path: 'todos',
        children: [
          {
            path: '',
            loadChildren: '../todos-list/todos-list.module#TodosListPageModule'
          },
          {
            path: 'detail',
            loadChildren: '../todo-detail/todo-detail.module#TodoDetailPageModule'
          },
        ]
      },

      // tab2

      // tab3

      {
        path: '',
        redirectTo: '/tabs/todos',
        pathMatch: 'full',
      }
    ]
  },

  // Default:
  {
    path: '',
    redirectTo: '/tabs/todos',
    pathMatch: 'full'
  }
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
