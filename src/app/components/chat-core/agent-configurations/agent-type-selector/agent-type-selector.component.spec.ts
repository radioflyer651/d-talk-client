import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentTypeSelectorComponent } from './agent-type-selector.component';

describe('AgentTypeSelectorComponent', () => {
  let component: AgentTypeSelectorComponent;
  let fixture: ComponentFixture<AgentTypeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentTypeSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
