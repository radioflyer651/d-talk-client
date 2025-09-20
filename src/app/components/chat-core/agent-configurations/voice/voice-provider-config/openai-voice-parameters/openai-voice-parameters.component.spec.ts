import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenaiVoiceParametersComponent } from './openai-voice-parameters.component';

describe('OpenaiVoiceParametersComponent', () => {
  let component: OpenaiVoiceParametersComponent;
  let fixture: ComponentFixture<OpenaiVoiceParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenaiVoiceParametersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenaiVoiceParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
