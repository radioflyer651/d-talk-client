import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Sanitizer, SecurityContext } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-instruction-item',
  imports: [
    CommonModule,
    FormsModule,
    TextareaModule,
    CardModule,
    ButtonModule,
  ],
  templateUrl: './instruction-item.component.html',
  styleUrl: './instruction-item.component.scss'
})
export class InstructionItemComponent {
  constructor(
    readonly sanitizer: DomSanitizer,
  ) {

  }

  private _value: string = '';
  @Input({ required: true })
  get value(): string {
    return this._value;
  }
  set value(value: string) {
    // Avoid infinite loops.
    if (value === this._value) {
      return;
    }

    this._value = value;
    this.editValue = value;

    this.valueChange.next(value);
  }

  private _editValue: string = '';
  get editValue(): string {
    return this._editValue;
  }
  set editValue(value: string) {
    this._editValue = value;
  }

  get inactiveValue() {
    return this.sanitizer.bypassSecurityTrustHtml(this.editValue.replaceAll('\n', '<br/>'));
  }

  @Output()
  valueChange = new EventEmitter<string>();

  ngOnInit() {
    this.id = Math.floor(Math.random() * 1000000);
  }

  @Input({ required: true })
  id!: number;

  isActive: boolean = false;

  @Output()
  deleteClicked = new EventEmitter<void>();

  delete(): void {
    this.deleteClicked.next();
  }

  setActive(isActive: boolean) {
    this.isActive = isActive;
  }

  onComplete(cancelled: boolean) {
    this.isActive = false;
    if (cancelled) {
      this.editValue = this.value;
      return;
    }

    this.value = this.editValue;
  }

}
