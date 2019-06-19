import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowHidePassDirective } from './show-hide-pass.directive';

@NgModule({
  declarations: [
    ShowHidePassDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    // Must exxport directives so binding will work properly
    ShowHidePassDirective,
  ]
})
export class DirectivesModule { }
