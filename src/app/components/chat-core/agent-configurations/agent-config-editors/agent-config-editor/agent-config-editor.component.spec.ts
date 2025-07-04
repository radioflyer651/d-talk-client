import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentConfigEditorComponent } from './agent-config-editor.component';

describe('AgentConfigEditorComponent', () => {
  let component: AgentConfigEditorComponent;
  let fixture: ComponentFixture<AgentConfigEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentConfigEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentConfigEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
