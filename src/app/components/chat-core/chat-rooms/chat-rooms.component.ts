import { Component } from '@angular/core';
import { ChatRoomListComponent } from "./chat-room-list/chat-room-list.component";
import { ChatRoomDetailComponent } from "./chat-room-detail/chat-room-detail.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatRoomsService } from '../../../services/chat-core/chat-rooms.service';

@Component({
  selector: 'app-chat-rooms',
  imports: [
    CommonModule,
    ChatRoomListComponent,
    RouterModule,
  ],
  templateUrl: './chat-rooms.component.html',
  styleUrl: './chat-rooms.component.scss'
})
export class ChatRoomsComponent {
  constructor(
    readonly chatRoomService: ChatRoomsService,
  ) {

  }
}
