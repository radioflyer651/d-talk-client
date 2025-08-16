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

type HelpMessageTypes = 'respond-to-last-inner-voice' | 'consider-last-message' | 'add-dummy-message';

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

  private _params!: InnerVoicePluginParams;

  @Input({ required: true })
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

  helpMessages = {
    ['respond-to-last-inner-voice']: `When not checked, the last message in the message list will be considered last instructions to the AI, which should usually indicate ` +
      `to the AI how to process the previous interactions when considering the next one.`,
    ['consider-last-message']: `
    When checked, indicates that the AI should consider the last message in chat when processing the inner voice.  Sometimes,
    the last message in chat may be a command or something like that, and hijack the inner voice, so this may alleviate that.
    `,
    ['add-dummy-message']: `Boolean value indicating whether or not a dummy AI message will be added to the chat history
     to attempt to block the AI from trying to respond to the last message in the chat.`
  };

  helpText: string = '';
  showHelpMessage: boolean = false;

  closeHelpDialog() {
    this.showHelpMessage = false;
  }

  showHelpDialog(helpId: HelpMessageTypes) {
    this.helpText = this.helpMessages[helpId];
    this.showHelpMessage = true;
  }

  moveMessageUp(id: number) {
    const messages = this.params.messageList;
    const message = messages.splice(id, 1)[0];

    messages.splice(id - 1, 0, message);
  }

  moveMessageDown(id: number) {
    const messages = this.params.messageList;
    const message = messages.splice(id, 1)[0];

    messages.splice(id + 1, 0, message);
  }
}
