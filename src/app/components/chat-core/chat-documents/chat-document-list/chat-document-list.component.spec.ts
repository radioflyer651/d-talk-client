import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDocumentListComponent } from './chat-document-list.component';

describe('ChatDocumentListComponent', () => {
  let component: ChatDocumentListComponent;
  let fixture: ComponentFixture<ChatDocumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatDocumentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
