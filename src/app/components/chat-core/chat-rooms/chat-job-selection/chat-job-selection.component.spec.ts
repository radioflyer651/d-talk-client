import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatJobSelectionComponent } from './chat-job-selection.component';

describe('ChatJobSelectionComponent', () => {
  let component: ChatJobSelectionComponent;
  let fixture: ComponentFixture<ChatJobSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatJobSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatJobSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
