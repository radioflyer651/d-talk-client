import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatJobDetailComponent } from './chat-job-detail.component';

describe('ChatJobDetailComponent', () => {
  let component: ChatJobDetailComponent;
  let fixture: ComponentFixture<ChatJobDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatJobDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatJobDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
