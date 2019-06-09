import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TodosListComponent } from './todos-list/todos-list.component';

@NgModule({
  declarations: [
    TodosListComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    TodosListComponent
  ]
})
export class ComponentsModule { }
