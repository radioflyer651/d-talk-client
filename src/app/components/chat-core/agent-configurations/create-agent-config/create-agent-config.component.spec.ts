import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAgentConfigComponent } from './create-agent-config.component';

describe('CreateAgentConfigComponent', () => {
  let component: CreateAgentConfigComponent;
  let fixture: ComponentFixture<CreateAgentConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAgentConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAgentConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
