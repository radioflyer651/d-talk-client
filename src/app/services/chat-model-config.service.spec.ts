import { TestBed } from '@angular/core/testing';

import { ChatModelConfigService } from './chat-model-config.service';

describe('ChatModelConfigService', () => {
  let service: ChatModelConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatModelConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
