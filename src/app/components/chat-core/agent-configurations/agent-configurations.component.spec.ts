import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentConfigurationsComponent } from './agent-configurations.component';

describe('AgentConfigurationsComponent', () => {
  let component: AgentConfigurationsComponent;
  let fixture: ComponentFixture<AgentConfigurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentConfigurationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
