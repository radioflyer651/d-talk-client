import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionItemComponent } from './instruction-item.component';

describe('InstructionItemComponent', () => {
  let component: InstructionItemComponent;
  let fixture: ComponentFixture<InstructionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructionItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
