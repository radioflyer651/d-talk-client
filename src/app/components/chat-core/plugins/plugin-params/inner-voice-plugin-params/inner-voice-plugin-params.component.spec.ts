import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerVoicePluginParamsComponent } from './inner-voice-plugin-params.component';

describe('InnerVoicePluginParamsComponent', () => {
  let component: InnerVoicePluginParamsComponent;
  let fixture: ComponentFixture<InnerVoicePluginParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InnerVoicePluginParamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnerVoicePluginParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
