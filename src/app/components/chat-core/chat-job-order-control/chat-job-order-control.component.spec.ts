import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatJobOrderControlComponent } from './chat-job-order-control.component';

describe('ChatJobOrderControlComponent', () => {
  let component: ChatJobOrderControlComponent;
  let fixture: ComponentFixture<ChatJobOrderControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatJobOrderControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatJobOrderControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
