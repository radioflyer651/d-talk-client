import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDocumentEditorComponent } from './chat-document-editor.component';

describe('ChatDocumentEditorComponent', () => {
  let component: ChatDocumentEditorComponent;
  let fixture: ComponentFixture<ChatDocumentEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatDocumentEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatDocumentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
