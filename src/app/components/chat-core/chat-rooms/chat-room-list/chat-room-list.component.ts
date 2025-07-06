import { Component } from '@angular/core';
import { ComponentBase } from '../../../component-base/component-base.component';
import { ChatRoomsService } from '../../../../services/chat-core/chat-rooms.service';
import { BehaviorSubject, map, switchMap, takeUntil } from 'rxjs';
import { ReadonlySubject } from '../../../../../utils/readonly-subject';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { NewDbItem } from '../../../../../model/shared-models/db-operation-types.model';
import { ChatAgentIdentityConfiguration } from '../../../../../model/shared-models/chat-core/agent-configuration.model';
import { ChatRoomData } from '../../../../../model/shared-models/chat-core/chat-room-data.model';
import { ProjectsService } from '../../../../services/chat-core/projects.service';

@Component({
  selector: 'app-chat-room-list',
  imports: [
    FormsModule,
    CommonModule,
    CardModule,
    PanelModule,
    InputTextModule,
    FloatLabel,
    ButtonModule,
    DataViewModule,
    DialogModule
  ],
  templateUrl: './chat-room-list.component.html',
  styleUrl: './chat-room-list.component.scss'
})
export class ChatRoomListComponent extends ComponentBase {
  constructor(
    readonly chatRoomService: ChatRoomsService,
    readonly confirmationService: ConfirmationService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly projectService: ProjectsService,
  ) {
    super();
  }

  ngOnInit() {
    this._chatRoomList = new ReadonlySubject(this.ngDestroy$,
      this.searchText$.pipe(
        switchMap((searchText) => {
          return this.chatRoomService.chatRooms$.pipe(
            map(roomList => {
              return roomList.filter(l => l.name?.toLowerCase().includes(searchText.toLocaleLowerCase()));
            })
          );
        })
      )
    );
  }

  // #region searchText
  private readonly _searchText = new BehaviorSubject<string>('');
  readonly searchText$ = this._searchText.asObservable();

  get searchText(): string {
    return this._searchText.getValue();
  }

  set searchText(newVal: string) {
    this._searchText.next(newVal);
  }
  // #endregion

  // #region chatRoomList
  private _chatRoomList!: ReadonlySubject<any[]>;

  get chatRoomList$() {
    return this._chatRoomList.observable$;
  }

  get chatRoomList(): any[] {
    return this._chatRoomList.value;
  }
  // #endregion

  async deleteChatRoom(room: any): Promise<void> {
    // Confirm before deleting a chat room
    this.confirmationService.confirm({
      message: `Are you sure you wish to delete the ${room.name} chat room?`,
      accept: async () => {
        return await lastValueFrom(this.chatRoomService.deleteChatRoom(room._id));
      }
    });
  }

  selectChatRoom(room: any) {
    // Set the selected chat room and navigate to its route
    this.router.navigate([room._id], { relativeTo: this.route });
    this.chatRoomService.selectedChatRoomId = room._id;
  }

  isNewChatRoomDialogVisible: boolean = false;
  newChatRoomName: string = '';

  createNewChatRoom() {
    // Open the dialog for creating a new chat room
    this.isNewChatRoomDialogVisible = true;
    this.newChatRoomName = '';
  }

  async confirmCreateNewChatRoom() {
    // Validate input and create a new chat room
    if (!this.newChatRoomName.trim()) {
      return;
    }

    const currentProjectId = this.projectService.currentProjectId!;

    const result = await lastValueFrom(this.chatRoomService.createChatRoom(this.newChatRoomName, currentProjectId));

    // Close dialog and clear input
    this.isNewChatRoomDialogVisible = false;
    this.newChatRoomName = '';

    // Make the new room active if creation was successful
    if (result && result._id) {
      this.selectChatRoom(result);
    }
  }

  getChatRoomDescription(room: any) {
    // Format the room description for display
    return room.description?.replaceAll('\n', '<br/>') ?? '';
  }
}
