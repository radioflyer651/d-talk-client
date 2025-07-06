import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAgentSelectionComponent } from './chat-agent-selection.component';

describe('ChatAgentSelectionComponent', () => {
  let component: ChatAgentSelectionComponent;
  let fixture: ComponentFixture<ChatAgentSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatAgentSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatAgentSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
