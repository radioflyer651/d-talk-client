import { TestBed } from '@angular/core/testing';

import { TextDocumentService } from './text-document.service';

describe('TextDocumentService', () => {
  let service: TextDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
