import { TestBed } from '@angular/core/testing';

import { CurrentRouteParamsService } from './current-route-params.service';

describe('CurrentRouteParamsService', () => {
  let service: CurrentRouteParamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentRouteParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
