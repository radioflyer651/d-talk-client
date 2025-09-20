import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumeVoiceParametersComponent } from './hume-voice-parameters.component';

describe('HumeVoiceParametersComponent', () => {
  let component: HumeVoiceParametersComponent;
  let fixture: ComponentFixture<HumeVoiceParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumeVoiceParametersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumeVoiceParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
