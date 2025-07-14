import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDocumentDetailComponent } from './chat-document-detail.component';

describe('ChatDocumentDetailComponent', () => {
  let component: ChatDocumentDetailComponent;
  let fixture: ComponentFixture<ChatDocumentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatDocumentDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatDocumentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
