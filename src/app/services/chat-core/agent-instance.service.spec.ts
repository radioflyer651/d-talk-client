import { TestBed } from '@angular/core/testing';

import { AgentInstanceService } from './agent-instance.service';

describe('AgentInstanceService', () => {
  let service: AgentInstanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentInstanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
