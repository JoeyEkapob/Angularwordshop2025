import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsumpermonthComponent } from './reportsumpermonth.component';

describe('ReportsumpermonthComponent', () => {
  let component: ReportsumpermonthComponent;
  let fixture: ComponentFixture<ReportsumpermonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsumpermonthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsumpermonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
