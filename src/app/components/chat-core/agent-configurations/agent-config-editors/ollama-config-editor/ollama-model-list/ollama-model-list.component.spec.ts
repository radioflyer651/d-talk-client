import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OllamaModelListComponent } from './ollama-model-list.component';

describe('OllamaModelListComponent', () => {
  let component: OllamaModelListComponent;
  let fixture: ComponentFixture<OllamaModelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OllamaModelListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OllamaModelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
