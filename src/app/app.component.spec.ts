import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';

// stub components to avoid testing child components
@Component({
  selector: 'app-barista-menu',
  standalone: true,
  template: '<div>Barista Menu Stub</div>',
})
class BaristaMenuStubComponent {}

@Component({
  selector: 'app-inventory-display',
  standalone: true,
  template: '<div>Inventory Display Stub</div>',
})
class InventoryDisplayStubComponent {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        BaristaMenuStubComponent,
        InventoryDisplayStubComponent,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect(component.title).toEqual('Barista-matic');
  });

  it('should include the header with app title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-toolbar')?.textContent).toContain(
      'Barista-matic'
    );
  });

  it('should include both the inventory display and barista menu components', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-inventory-display')).toBeTruthy();
    expect(compiled.querySelector('app-barista-menu')).toBeTruthy();
  });
});
