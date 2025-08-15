import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { InnerVoicePluginParams } from '../../../../../../model/shared-models/chat-core/plugins/inner-voice-plugin.params';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-inner-voice-plugin-params',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    CheckboxModule,
    TextareaModule,
    FloatLabelModule,
    SelectModule,
    DialogModule,
    ButtonModule,
  ],
  templateUrl: './inner-voice-plugin-params.component.html',
  styleUrl: './inner-voice-plugin-params.component.scss'
})
export class InnerVoicePluginParamsComponent extends ComponentBase {
  constructor() {
    super();
  }

  private _params: InnerVoicePluginParams = { messageList: [], callType: 'system' };
  @Input()
  get params(): InnerVoicePluginParams {
    return this._params;
  }
  set params(value: InnerVoicePluginParams) {
    this._params = value;
  }

  messageTypeOptions = [
    {
      label: 'System Message',
      value: 'system'
    },
    {
      label: 'User Message',
      value: 'user'
    }
  ];

  deleteMessage(index: number) {
    this.params.messageList.splice(index, 1);
  }

  addMessage() {
    this.params.messageList.push('');
    this.isNewMessage = true;
    this.editMessage(this.params.messageList.length - 1);
  }

  isEditDialogVisible: boolean = false;
  editDialogMessageIndex: number = 0;
  editDialogMessageValue: string = '';
  isNewMessage: boolean = false;

  editMessage(index: number) {
    this.editDialogMessageIndex = index;
    this.editDialogMessageValue = this.params.messageList[index];
    this.isEditDialogVisible = true;
  }

  closeDialog(cancel: boolean) {
    if (!cancel) {
      this.params.messageList[this.editDialogMessageIndex] = this.editDialogMessageValue;
    }

    this.isEditDialogVisible = false;
    this.isNewMessage = false;
  }
}
