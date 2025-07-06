import { TestBed } from '@angular/core/testing';

import { ChatJobsService } from './chat-jobs.service';

describe('ChatJobsService', () => {
  let service: ChatJobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatJobsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
