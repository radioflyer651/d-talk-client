import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPopoutComponent } from './document-popout.component';

describe('DocumentPopoutComponent', () => {
  let component: DocumentPopoutComponent;
  let fixture: ComponentFixture<DocumentPopoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentPopoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentPopoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
