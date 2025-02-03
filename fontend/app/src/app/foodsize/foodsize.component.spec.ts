import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodsizeComponent } from './foodsize.component';

describe('FoodsizeComponent', () => {
  let component: FoodsizeComponent;
  let fixture: ComponentFixture<FoodsizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodsizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodsizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
