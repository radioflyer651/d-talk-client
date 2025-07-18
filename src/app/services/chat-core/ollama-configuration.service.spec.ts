import { TestBed } from '@angular/core/testing';

import { OllamaConfigurationService } from './ollama-configuration.service';

describe('OllamaConfigurationService', () => {
  let service: OllamaConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OllamaConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
