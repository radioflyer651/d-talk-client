import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceConfigurationComponent } from './voice-configuration.component';

describe('VoiceConfigurationComponent', () => {
  let component: VoiceConfigurationComponent;
  let fixture: ComponentFixture<VoiceConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoiceConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
