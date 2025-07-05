import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionableMessageDetailComponent } from './positionable-message-detail.component';

describe('PositionableMessageDetailComponent', () => {
  let component: PositionableMessageDetailComponent;
  let fixture: ComponentFixture<PositionableMessageDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionableMessageDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionableMessageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
