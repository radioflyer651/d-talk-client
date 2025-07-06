import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatJobInstanceListComponent } from './chat-job-instance-list.component';

describe('ChatJobInstanceListComponent', () => {
  let component: ChatJobInstanceListComponent;
  let fixture: ComponentFixture<ChatJobInstanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatJobInstanceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatJobInstanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
