import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appShowHidePass]'
})
export class ShowHidePassDirective {
  @Input('appShowHidePass') targetInput: any;

  constructor(private el: ElementRef) {}

  @HostListener('click') onClick() {
    // console.log('DEBUG directive onClick, el: %o, targetInput: %o', this.el, this.targetInput);
    const newType = (this.targetInput.type === 'text') ? 'password' : 'text';
    this.targetInput.type = newType;
    // TODO: (later) implement toggling class on the button this.el, so it can be styled
  }

}
