import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TodosComponent } from './todos/todos.component';

@NgModule({
  declarations: [
    TodosComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    TodosComponent
  ]
})
export class ComponentsModule { }
