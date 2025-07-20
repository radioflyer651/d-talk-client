import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTreeListComponent } from './document-tree-list.component';

describe('DocumentTreeListComponent', () => {
  let component: DocumentTreeListComponent;
  let fixture: ComponentFixture<DocumentTreeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentTreeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentTreeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
