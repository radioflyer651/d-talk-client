import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IgnoreSpecificAgentPluginParamsComponent } from './ignore-specific-agent-plugin-params.component';

describe('IgnoreSpecificAgentPluginParamsComponent', () => {
  let component: IgnoreSpecificAgentPluginParamsComponent;
  let fixture: ComponentFixture<IgnoreSpecificAgentPluginParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IgnoreSpecificAgentPluginParamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IgnoreSpecificAgentPluginParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
