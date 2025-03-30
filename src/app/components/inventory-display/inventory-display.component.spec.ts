import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDisplayComponent } from './inventory-display.component';

describe('InventoryDisplayComponent', () => {
  let component: InventoryDisplayComponent;
  let fixture: ComponentFixture<InventoryDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
