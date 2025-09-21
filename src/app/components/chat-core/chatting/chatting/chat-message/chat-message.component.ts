import { Component, Input } from '@angular/core';
import { StoredMessage } from '@langchain/core/messages';
import { StoredMessageWrapper } from '../../../../../../model/shared-models/chat-core/stored-message-wrapper.utils';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ChattingService } from '../../../../../services/chat-core/chatting.service';
import { ButtonModule } from 'primeng/button';
import { combineLatestWith, map, startWith, Subject, takeUntil } from 'rxjs';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { AgentInstanceService } from '../../../../../services/chat-core/agent-instance.service';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { MonacoEditorComponent, MonacoEditorOptions } from "../../../../monaco-editor/monaco-editor.component";
import { getMessageDateTime, getMessageVoiceUrl, getMessageVoiceId } from '../../../../../../model/shared-models/chat-core/utils/messages.utils';
import { AgentConfigurationService } from '../../../../../services/chat-core/agent-configuration.service';
import { ChatAgentIdentityConfiguration } from '../../../../../../model/shared-models/chat-core/agent-configuration.model';
import { VoiceService } from '../../../../../services/chat-core/voice.service';
import { VoicePlayService } from '../../../../../services/chat-core/voice-play.service';
import { UserService } from '../../../../../services/user.service';

type VoicePlayStateTypes = 'can-play' | 'busy-playing-self' | 'busy' | 'no-play';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    TextareaModule,
    MonacoEditorComponent
  ],
})
export class ChatMessageComponent extends ComponentBase {
  constructor(
    readonly sanitizer: DomSanitizer,
    readonly chattingService: ChattingService,
    readonly agentsService: AgentInstanceService,
    readonly agentConfigService: AgentConfigurationService,
    readonly confirmationService: ConfirmationService,
    readonly voiceService: VoiceService,
    readonly voicePlayService: VoicePlayService,
    readonly userService: UserService,
  ) {
    super();
    // We need to do these things here, because the need to exist
    //  when the message gets set.
    const agent$ = this._agentId$.pipe(
      combineLatestWith(this.agentsService.agentInstances$),
      map(([agentId, agents]) => {
        if (!agentId) {
          return undefined;
        }

        return agents.find(a => a._id === agentId);
      }),
    );

    agent$.pipe(takeUntil(this.ngDestroy$))
      .subscribe(agent => {
        if (agent) {
          this._name = agent.name;
        } else {
          this._name = '';
        }
      });

    this.agentConfigService.agentConfigurations$.pipe(
      startWith([]),
      combineLatestWith(agent$),
      takeUntil(this.ngDestroy$)
    ).subscribe(([agents, agent]) => {
      if (agent) {
        // Set the agent's configuration.
        this.agentConfig = agents.find(c => c._id === agent.identity);
      } else {
        this.agentConfig = undefined;
      }
    });
  }

  private _message!: StoredMessage;
  private _agentId$ = new Subject<string | undefined>();

  ngOnInit() {
  }

  private _agentConfig: ChatAgentIdentityConfiguration | undefined = undefined;
  get agentConfig(): ChatAgentIdentityConfiguration | undefined {
    return this._agentConfig;
  }
  set agentConfig(value: ChatAgentIdentityConfiguration | undefined) {
    this._agentConfig = value;
  }

  @Input()
  set message(value: StoredMessage) {
    this._message = value;

    if (!value) {
      this.wrapper = undefined;
      this._agentId$.next(undefined);
    } else {
      this.wrapper = new StoredMessageWrapper(value);
      this._agentId$.next(this.wrapper.agentId);
    }
  }

  get message(): StoredMessage {
    return this._message;
  }

  private _name: string | undefined;
  get name(): string {
    if (this._name) {
      return this._name;
    }

    if (!this.wrapper) {
      return '';
    }

    const wrapperName = this.wrapper.name?.trim();
    if (wrapperName) {
      this._name = wrapperName;
      return wrapperName;
    }

    const agent = this.chattingService.getAgentInstance(this.wrapper.id);
    if (agent) {
      this._name = agent.name;
      return this._name ?? '';
    }

    return '';
  }

  wrapper: StoredMessageWrapper | undefined;

  monacoEditorOptions: MonacoEditorOptions = {
    currentLanguage: 'plaintext',
    wordWrapOn: true
  };

  get innerHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.message.data.content
      .replaceAll(/\n/g, '<br/>')
      .replaceAll(' {2}', '&nbsp;&nbsp;')
      .replaceAll('\t', '&nbsp;'.repeat(5)));
  }

  isEditDialogVisible = false;
  editMessageContent = '';

  get messageDateTime() {
    const dateTime = getMessageDateTime(this.message);
    if (dateTime) {
      return dateTime.toLocaleDateString() + '  ' + dateTime.toLocaleTimeString();
    }

    return '';
  }

  editMessage(): void {
    this.isEditDialogVisible = true;
    this.editMessageContent = this.wrapper!.content;
  }

  async onMessageEditClosed(cancelled: boolean) {
    this.isEditDialogVisible = false;
    if (!cancelled) {
      this.wrapper!.content = this.editMessageContent;
      await this.chattingService.updateChatMessageInChatRoom(this.wrapper!.id, this.wrapper!.content);
    }
  }

  deleteMessage() {
    this.confirmationService.confirm({
      header: 'Confirm Message Deletion',
      message: 'Are you sure you wish to delete this message?',
      accept: () => this.chattingService.deleteChatMessageInChatRoom(this.wrapper!.id)
    });
  }

  copyMessageContent() {
    if (this.wrapper) {
      const content = this.wrapper.content;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(content);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = content;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    }
  }

  /** Returns a boolean value indicating whether or not we
   *   can play the chat message through voice. */
  get canPlayVoiceMessage() {
    // Humans can't do this.
    if (this.wrapper?.agent === 'human') {
      return false;
    }

    // Check for a URL - if we have one, case solved.
    if (getMessageVoiceUrl(this.message)) {
      return true;
    }

    // If we have a reference ID, then we can't actually press the button - it's still processing.
    if (getMessageVoiceId(this.message)) {
      return false;
    }

    // Now, check if we can generate one through the agent.
    if (!this.agentConfig) {
      return false;
    }

    return !!this.agentConfig.voiceMessageParams;
  }

  isVoiceMessageBusy: boolean = false;

  get hasVoicePermission() {
    return this.userService.userHasVoicePermission;
  }

  get hasGeneratedVoiceUrl() {
    return !!getMessageVoiceUrl(this.message);
  }

  get canRegenerateVoiceUrl() {
    return this.hasGeneratedVoiceUrl && this.mediaState !== 'busy' && this.mediaState !== 'no-play';
  }

  get mediaState(): VoicePlayStateTypes {
    if (this.isVoiceMessageBusy) {
      return 'busy-playing-self';
    }

    if (this.voicePlayService.isPlaying) {
      return 'busy';
    }

    if (this.canPlayVoiceMessage) {
      return 'can-play';
    }

    return 'no-play';
  }

  stopVoicePlayback() {
    this.voicePlayService.stop();
  }

  async playVoiceMessage(forceRegeneration: boolean) {
    const chatRoomId = this.chattingService.chatRoom?._id;
    if (!chatRoomId) {
      return;
    }

    this.isVoiceMessageBusy = true;

    try {
      await this.voicePlayService.playMessage(chatRoomId, this.message, forceRegeneration);

      const playingSub = this.voicePlayService.isPlaying$.subscribe(value => {
        // Just to be sure that we have a subscription before we try to cancel it.
        setTimeout(() => {
          if (!value) {
            this.isVoiceMessageBusy = false;
            playingSub.unsubscribe();
          }
        });
      });
    } catch (err) {
      // We probably have an error trying to get the file (403 or 404 maybe).
      //  Either way, we have to re-enable the play button.
      this.isVoiceMessageBusy = false;
    }

  }
}
