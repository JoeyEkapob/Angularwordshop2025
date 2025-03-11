import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsaleComponent } from './billsale.component';

describe('BillsaleComponent', () => {
  let component: BillsaleComponent;
  let fixture: ComponentFixture<BillsaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillsaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
