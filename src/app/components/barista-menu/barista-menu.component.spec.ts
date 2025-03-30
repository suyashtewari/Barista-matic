import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaristaMenuComponent } from './barista-menu.component';

describe('BaristaMenuComponent', () => {
  let component: BaristaMenuComponent;
  let fixture: ComponentFixture<BaristaMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaristaMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaristaMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
