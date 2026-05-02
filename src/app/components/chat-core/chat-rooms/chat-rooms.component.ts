import { Component } from '@angular/core';
import { ChatRoomListComponent } from './chat-room-list/chat-room-list.component';
import { RouterModule } from '@angular/router';
import { ListDetailShellComponent } from '../../list-detail-shell/list-detail-shell.component';

@Component({
  selector: 'app-chat-rooms',
  imports: [ChatRoomListComponent, RouterModule, ListDetailShellComponent],
  templateUrl: './chat-rooms.component.html',
  styleUrl: './chat-rooms.component.scss',
})
export class ChatRoomsComponent {}
