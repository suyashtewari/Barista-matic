import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkDispenserComponent } from './drink-dispenser.component';

describe('DrinkDispenserComponent', () => {
  let component: DrinkDispenserComponent;
  let fixture: ComponentFixture<DrinkDispenserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrinkDispenserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrinkDispenserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
