import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TodoDetailPage } from './todo-detail.page';

import { ComponentsModule } from '../../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: TodoDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TodoDetailPage]
})
export class TodoDetailPageModule {}
