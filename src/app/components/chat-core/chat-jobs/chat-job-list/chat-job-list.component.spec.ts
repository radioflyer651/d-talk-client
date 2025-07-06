import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatJobListComponent } from './chat-job-list.component';

describe('ChatJobListComponent', () => {
  let component: ChatJobListComponent;
  let fixture: ComponentFixture<ChatJobListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatJobListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatJobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
