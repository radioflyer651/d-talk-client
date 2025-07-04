import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentConfigListComponent } from './agent-config-list.component';

describe('AgentConfigListComponent', () => {
  let component: AgentConfigListComponent;
  let fixture: ComponentFixture<AgentConfigListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentConfigListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentConfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
