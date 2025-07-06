import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatJobsComponent } from './chat-jobs.component';

describe('ChatJobsComponent', () => {
  let component: ChatJobsComponent;
  let fixture: ComponentFixture<ChatJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
