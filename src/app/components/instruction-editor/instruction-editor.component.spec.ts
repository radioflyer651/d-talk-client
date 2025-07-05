import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionEditorComponent } from './instruction-editor.component';

describe('InstructionEditorComponent', () => {
  let component: InstructionEditorComponent;
  let fixture: ComponentFixture<InstructionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructionEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
