import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganuzationComponent } from './organuzation.component';

describe('OrganuzationComponent', () => {
  let component: OrganuzationComponent;
  let fixture: ComponentFixture<OrganuzationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganuzationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganuzationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
