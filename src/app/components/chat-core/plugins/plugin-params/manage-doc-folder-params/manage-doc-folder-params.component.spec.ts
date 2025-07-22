import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDocFolderParamsComponent } from './manage-doc-folder-params.component';

describe('ManageDocFolderParamsComponent', () => {
  let component: ManageDocFolderParamsComponent;
  let fixture: ComponentFixture<ManageDocFolderParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDocFolderParamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDocFolderParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
