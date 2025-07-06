import { Component } from '@angular/core';
import { ChatRoomListComponent } from "./chat-room-list/chat-room-list.component";
import { ChatRoomDetailComponent } from "./chat-room-detail/chat-room-detail.component";

@Component({
  selector: 'app-chat-rooms',
  imports: [ChatRoomListComponent, ChatRoomDetailComponent],
  templateUrl: './chat-rooms.component.html',
  styleUrl: './chat-rooms.component.scss'
})
export class ChatRoomsComponent {
  
}
