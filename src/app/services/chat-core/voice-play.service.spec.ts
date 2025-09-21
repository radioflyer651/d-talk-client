import { TestBed } from '@angular/core/testing';

import { VoicePlayService } from './voice-play.service';

describe('VoicePlayService', () => {
  let service: VoicePlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoicePlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
