import { TestBed } from '@angular/core/testing';
import { ClientApiService } from './api-client.service';


describe('ClientApiService', () => {
  let service: ClientApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
