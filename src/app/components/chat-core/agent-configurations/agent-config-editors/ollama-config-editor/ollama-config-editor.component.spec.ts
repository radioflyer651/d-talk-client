import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OllamaConfigEditorComponent } from './ollama-config-editor.component';

describe('OllamaConfigEditorComponent', () => {
  let component: OllamaConfigEditorComponent;
  let fixture: ComponentFixture<OllamaConfigEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OllamaConfigEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OllamaConfigEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
