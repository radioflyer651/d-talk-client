import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenaiConfigEditorComponent } from './openai-config-editor.component';

describe('OpenaiConfigEditorComponent', () => {
  let component: OpenaiConfigEditorComponent;
  let fixture: ComponentFixture<OpenaiConfigEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenaiConfigEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenaiConfigEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
