import {Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

/**
 * Implements a directive that ties a button (placed anywhere) to toggling password field between hide and show.
 * Also toggles class on the button between toggle-text and toggle-password, so it can be styled like a toggle.
 */
const classPrefix = 'toggle-';
@Directive({
  selector: '[appShowHidePass]'
})
export class ShowHidePassDirective implements OnInit {
  @Input('appShowHidePass') targetInput: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private domCtrl: DomController
  ) {}

  ngOnInit() {
    this.domCtrl.write(() => {
      this.renderer.addClass(this.el.nativeElement, classPrefix + this.targetInput.type);
    });
  }

  @HostListener('click') onClick() {
    // console.log('DEBUG directive onClick, el: %o, targetInput: %o', this.el, this.targetInput);
    const newType = (this.targetInput.type === 'text') ? 'password' : 'text';
    // Efficient way to write to DOM:
    this.domCtrl.write(() => {
      this.renderer.removeClass(this.el.nativeElement, classPrefix + this.targetInput.type);
      this.targetInput.type = newType;
      this.renderer.addClass(this.el.nativeElement, classPrefix + this.targetInput.type);
    });
  }

}
