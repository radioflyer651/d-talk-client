import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ComponentBase } from '../../component-base/component-base.component';
import { Observable } from 'rxjs';
import { LinkedJobInstance } from '../../../../model/linked-job-instance.model';
import { ChatRoomsService } from '../../../services/chat-core/chat-rooms.service';
import { ChatJobsService } from '../../../services/chat-core/chat-jobs.service';
import { ChatRoomData } from '../../../../model/shared-models/chat-core/chat-room-data.model';
import { ChatJobInstance } from '../../../../model/shared-models/chat-core/chat-job-instance.model';

@Component({
  selector: 'app-chat-job-order-control',
  imports: [
    FormsModule,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './chat-job-order-control.component.html',
  styleUrl: './chat-job-order-control.component.scss'
})
export class ChatJobOrderControlComponent extends ComponentBase {
  constructor(
    readonly chatRoomService: ChatRoomsService,
    readonly chatJobsService: ChatJobsService,
  ) {
    super();
  }

  chatJobInstances$!: Observable<LinkedJobInstance[]>;
  currentChatRoom$!: Observable<ChatRoomData>;

  ngOnInit() {

  }

  get chatRoom(): ChatRoomData {
    return this.chatRoomService.selectedChatRoom!;
  }

  get chatJobs(): ChatJobInstance[] {
    return this.chatRoom.jobs;
  }

  private _targetChatJob!: ChatJobInstance;
  /** Gets or sets the chat job being worked with. */
  @Input({ required: true })
  get targetChatJob(): ChatJobInstance {
    return this._targetChatJob;
  }
  set targetChatJob(value: ChatJobInstance) {
    this._targetChatJob = value;
  }

  moveJobForward() {
    this.chatRoomService.setChatJobOrder(this.targetChatJob.id, this.jobIndex + 1).then(() => {
      this.chatRoomService.reloadSelectedChatRoom();
    });
  }

  moveJobBack() {
    this.chatRoomService.setChatJobOrder(this.targetChatJob.id, this.jobIndex - 1).then(() => {
      this.chatRoomService.reloadSelectedChatRoom();
    });
  }

  get jobIndex() {
    return this.chatRoom.jobs.findIndex(j => j.id === this.targetChatJob.id);
  }

  get isMoveForwardDisabled() {
    return this.jobIndex >= this.chatRoom.jobs.length - 1;
  }

  get isMoveBackDisabled() {
    return this.jobIndex <= 0;
  }
}
