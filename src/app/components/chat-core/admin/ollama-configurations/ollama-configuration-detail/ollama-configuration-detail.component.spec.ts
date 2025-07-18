import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OllamaConfigurationDetailComponent } from './ollama-configuration-detail.component';

describe('OllamaConfigurationDetailComponent', () => {
  let component: OllamaConfigurationDetailComponent;
  let fixture: ComponentFixture<OllamaConfigurationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OllamaConfigurationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OllamaConfigurationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
