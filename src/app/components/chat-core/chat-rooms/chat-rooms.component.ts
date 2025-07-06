import { Component } from '@angular/core';
import { ChatRoomListComponent } from "./chat-room-list/chat-room-list.component";

@Component({
  selector: 'app-chat-rooms',
  imports: [ChatRoomListComponent],
  templateUrl: './chat-rooms.component.html',
  styleUrl: './chat-rooms.component.scss'
})
export class ChatRoomsComponent {
  
}
