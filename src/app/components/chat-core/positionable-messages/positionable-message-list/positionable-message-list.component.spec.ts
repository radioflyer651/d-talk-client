import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionableMessageListComponent } from './positionable-message-list.component';

describe('PositionableMessageListComponent', () => {
  let component: PositionableMessageListComponent;
  let fixture: ComponentFixture<PositionableMessageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionableMessageListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionableMessageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
