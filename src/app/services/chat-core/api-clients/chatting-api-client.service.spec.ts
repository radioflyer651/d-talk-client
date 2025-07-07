import { TestBed } from '@angular/core/testing';

import { ChattingApiClientService } from './chatting-api-client.service';

describe('ChattingApiClientService', () => {
  let service: ChattingApiClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChattingApiClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
