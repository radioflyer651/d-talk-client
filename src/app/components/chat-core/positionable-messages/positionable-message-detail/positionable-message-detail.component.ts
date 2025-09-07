import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { ComponentBase } from '../../../component-base/component-base.component';
import { PositionableMessage } from '../../../../../model/shared-models/chat-core/positionable-message.model';
import { StoredMessage } from '@langchain/core/messages';
import { StoredMessageWrapper } from '../../../../../model/shared-models/chat-core/stored-message-wrapper.utils';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { storedMessageAgentTypeOptions } from '../../../../../model/shared-models/chat-core/stored-message-agent-types.data';
import { positionableMessageLocationOptions } from '../../../../../model/positionable-message-options.data';
import { CheckboxModule } from 'primeng/checkbox';
import { MonacoEditorComponent, MonacoEditorOptions } from "../../../monaco-editor/monaco-editor.component";
import { Dialog } from "primeng/dialog";
import { PageSizeService } from '../../../../services/page-size.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-positionable-message-detail',
  imports: [
    CommonModule,
    FormsModule,
    TextareaModule,
    InputTextModule,
    SelectModule,
    CardModule,
    ButtonModule,
    PanelModule,
    FloatLabelModule,
    InputNumberModule,
    CheckboxModule,
    MonacoEditorComponent,
    Dialog
  ],
  templateUrl: './positionable-message-detail.component.html',
  styleUrl: './positionable-message-detail.component.scss'
})
export class PositionableMessageDetailComponent extends ComponentBase {
  constructor(
    readonly pageSizeService: PageSizeService,
  ) {
    super();
  }

  private _message!: PositionableMessage<StoredMessage>;
  @Input({ required: true })
  get message(): PositionableMessage<StoredMessage> {
    return this._message;
  }
  set message(value: PositionableMessage<StoredMessage>) {
    this._message = value;

    if (value) {
      this.messageController = new StoredMessageWrapper(value.message);
    } else {
      this.messageController = undefined;
    }
  }

  ngOnInit() {
    this.pageSizeService.pageResized$.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(newSize => {
      if (newSize.width <= 600 || newSize.height <= 600) {
        this.editDialogStyle = { width: '100vw', height: '100vh', };
      } else {
        this.editDialogStyle = { width: '70vw', height: '80vh', };
      }
    });
  }

  editDialogStyle = { width: '70vw', height: '80vh', };

  /** Options for the agent type in the select box. */
  agentTypeOptions = storedMessageAgentTypeOptions;

  /** Options for selecting the position type. */
  positioningTypeOptions = positionableMessageLocationOptions;

  @Input({ required: true })
  messageIndex!: number;

  get showOffset(): boolean {
    const option = this.positioningTypeOptions.find(o => o.value === this.message.location);
    return option?.requiresOffset ?? false;
  }

  messageController?: StoredMessageWrapper;

  @Output()
  deleteClicked = new EventEmitter<number>();

  onDeleteClicked() {
    this.deleteClicked.emit(this.messageIndex);
  }

  get displayName(): string {
    if (!this.message.description) {
      if (!this.messageController) {
        return '';
      }

      return this.messageController!.content.substring(0, 60);
    } else {
      return this.message.description;
    }
  }

  isEditDialogVisible: boolean = false;

  monacoEditorOptions: MonacoEditorOptions = {
    currentLanguage: 'plaintext',
    wordWrapOn: true,
  };

  /** Gets or sets the dialog message that will be used to update this message if submitted. */
  editDialogMessage: string = '';
  editDialogTitle: string = '';

  editMessage(): void {
    if (!this.messageController) {
      throw new Error(`No message controller exists.`);
    }

    this.editDialogMessage = this.messageController.content;
    this.editDialogTitle = this.message.description ?? '';
    this.isEditDialogVisible = true;
  }

  closeEditDialog(cancelled: boolean) {
    if (!cancelled) {
      this.message.description = this.editDialogTitle;
      this.messageController!.content = this.editDialogMessage;
    }

    this.isEditDialogVisible = false;
  }
}
