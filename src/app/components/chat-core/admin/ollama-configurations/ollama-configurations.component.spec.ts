import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OllamaConfigurationsComponent } from './ollama-configurations.component';

describe('OllamaConfigurationsComponent', () => {
  let component: OllamaConfigurationsComponent;
  let fixture: ComponentFixture<OllamaConfigurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OllamaConfigurationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OllamaConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
