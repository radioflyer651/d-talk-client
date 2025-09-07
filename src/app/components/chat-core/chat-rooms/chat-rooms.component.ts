import { Component } from '@angular/core';
import { ChatRoomListComponent } from "./chat-room-list/chat-room-list.component";
import { ChatRoomDetailComponent } from "./chat-room-detail/chat-room-detail.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatRoomsService } from '../../../services/chat-core/chat-rooms.service';
import { PageSizeService } from '../../../services/page-size.service';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-chat-rooms',
  imports: [
    CommonModule,
    ChatRoomListComponent,
    RouterModule,
    DrawerModule,
    ButtonModule,
  ],
  templateUrl: './chat-rooms.component.html',
  styleUrl: './chat-rooms.component.scss'
})
export class ChatRoomsComponent {
  private _showDrawer: boolean = false;

  constructor(
    readonly chatRoomService: ChatRoomsService,
    public pageSizeService: PageSizeService,
  ) { }

  public get showDrawer(): boolean {
    if (!this.pageSizeService.isSkinnyPage) {
      return false;
    }
    return this._showDrawer;
  }
  public set showDrawer(v: boolean) {
    this._showDrawer = v;
  }

  openDrawer() {
    this.showDrawer = true;
  }

  closeDrawer() {
    this.showDrawer = false;
  }
}
