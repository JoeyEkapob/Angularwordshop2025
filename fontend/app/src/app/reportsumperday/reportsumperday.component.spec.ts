import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsumperdayComponent } from './reportsumperday.component';

describe('ReportsumperdayComponent', () => {
  let component: ReportsumperdayComponent;
  let fixture: ComponentFixture<ReportsumperdayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsumperdayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsumperdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
