import { ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, DebugElement, ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ShowHidePassDirective } from './show-hide-pass.directive';

// Directive was not functional under the TestBed - it was not getting into
// DomController.write(), until fakeAsync()/tick(50) was added.
// All other methods (async(), multiple fixture.detectChanges, fixture.whenStable())
// did not fix it.

// Component for testing directive
@Component({
  template: `
  <input id="passwordField" type="password" #password />
  <button type="button" [appShowHidePass]="password"></button>`
})
class TestShowHidePassComponent {
}

describe('ShowHidePassDirective', () => {
  let component: TestShowHidePassComponent;
  let fixture: ComponentFixture<TestShowHidePassComponent>;
  let inputEl: DebugElement;
  let buttonEl: DebugElement;

  beforeEach( async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TestShowHidePassComponent,
        ShowHidePassDirective
      ],
      providers: [
        ShowHidePassDirective
      ]
    })
    .compileComponents();
  });

  beforeEach( async () => {
    fixture = TestBed.createComponent(TestShowHidePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit()
    await fixture.whenStable();

    fixture.detectChanges(); // let ngOnInit() resolve
    await fixture.whenStable();

    inputEl = fixture.debugElement.query(By.css('input'));
    buttonEl = fixture.debugElement.query(By.css('button'));
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    inputEl = null;
    buttonEl = null;
  });

  it('should create an instance', () => {
    expect(component).toBeDefined();
    expect(buttonEl).toBeTruthy();
  });

  it('should change type of input and class of button', fakeAsync( () => {
    // const directive = fixture.debugElement.query(By.directive(ShowHidePassDirective))
    //   .injector.get(ShowHidePassDirective) as ShowHidePassDirective;
    // const spy = spyOn(directive, 'onClick');
    // TODO: (soon) setting up the spy causes the onClick() handler to be NOT be called.
    // Can fix by a separate it() test case.

    // Starts as password field
    fixture.detectChanges();
    fixture.whenStable();
    expect(buttonEl.nativeElement.className).toContain('toggle-password');
    expect(buttonEl.nativeElement.className).not.toContain('toggle-text');
    expect(inputEl.nativeElement.type).toBe('password');

    // Click once to show password
    buttonEl.triggerEventHandler('click', null );
    tick(50);
    fixture.detectChanges();
    fixture.whenStable();
    // await expect(directive.onClick).toHaveBeenCalled();
    expect(buttonEl.nativeElement.className).not.toContain('toggle-password');
    expect(buttonEl.nativeElement.className).toContain('toggle-text');
    expect(inputEl.nativeElement.type).toBe('text');

    // Second click returns to password field
    buttonEl.triggerEventHandler('click', null );
    tick(50);
    fixture.detectChanges();
    fixture.whenStable();
    expect(buttonEl.nativeElement.className).toContain('toggle-password');
    expect(buttonEl.nativeElement.className).not.toContain('toggle-text');
    expect(inputEl.nativeElement.type).toBe('password');
  }));

  // TODO: (later) add more tests!

});
