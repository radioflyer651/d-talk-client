import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDocumentsComponent } from './chat-documents.component';

describe('ChatDocumentsComponent', () => {
  let component: ChatDocumentsComponent;
  let fixture: ComponentFixture<ChatDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
