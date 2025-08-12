import { TestBed } from '@angular/core/testing';

import { ChatLinkingService } from './chat-linking.service';

describe('ChatLinkingService', () => {
  let service: ChatLinkingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatLinkingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
