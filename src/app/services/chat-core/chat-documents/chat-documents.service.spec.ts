import { TestBed } from '@angular/core/testing';

import { ChatDocumentsService } from './chat-documents.service';

describe('ChatDocumentsService', () => {
  let service: ChatDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
