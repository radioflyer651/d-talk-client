import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InstructionItemComponent } from "./instruction-item/instruction-item.component";
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-instruction-editor',
  imports: [
    CommonModule,
    FormsModule,
    InstructionItemComponent,
    ButtonModule,
  ],
  templateUrl: './instruction-editor.component.html',
  styleUrl: './instruction-editor.component.scss'
})
export class InstructionEditorComponent {

  private _instructions: string[] = [];
  @Input()
  get instructions(): string[] {
    return this._instructions;
  }
  set instructions(value: string[]) {
    this._instructions = value;
  }

  addInstruction() {
    this.instructions.push('');
  }

  onDeleteClicked(index: number) {
    this.instructions.splice(index, 1);
  }
}
