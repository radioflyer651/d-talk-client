import { Component } from '@angular/core';
import { ComponentBase } from '../../../component-base/component-base.component';
import { ChatDocumentsService } from '../../../../services/chat-core/chat-documents.service';
import { ProjectsService } from '../../../../services/chat-core/projects.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentRouteParamsService } from '../../../../services/current-route-params.service';
import { map, Observable, startWith, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ChatDocumentDataListItem } from '../../../../../model/shared-models/chat-core/chat-document.model';
import { createDefaultChatDocumentData } from '../../../../../utils/create-chat-document.utils';
import { UserService } from '../../../../services/user.service';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-chat-document-list',
  imports: [
    FormsModule,
    CommonModule,
    CardModule,
    PanelModule,
    InputTextModule,
    TextareaModule,
    FloatLabel,
    ButtonModule,
    DataViewModule,
    ConfirmDialogModule,
    DialogModule,
  ],
  templateUrl: './chat-document-list.component.html',
  styleUrl: './chat-document-list.component.scss'
})
export class ChatDocumentListComponent extends ComponentBase {
  searchText: string = '';

  constructor(
    readonly chatDocumentsService: ChatDocumentsService,
    readonly projectService: ProjectsService,
    readonly params: CurrentRouteParamsService,
    readonly userService: UserService,
    readonly router: Router,
    readonly route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    this.params.params$.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(params => {
      this.projectService.currentProjectId = params['projectId'];
      this.chatDocumentsService.currentProjectId = params['projectId'];
    });

    this.chatDocuments$ = this.chatDocumentsService.documentList$.pipe(
      startWith([]),
      takeUntil(this.ngDestroy$),
      map(docs => {
        if (!docs) {
          return [];
        }
        // Filter by searchText
        return docs.filter(doc =>
          doc.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
          doc.folderLocation?.toLowerCase().includes(this.searchText.toLowerCase()) ||
          doc.description?.toLowerCase().includes(this.searchText.toLowerCase())
        );
      })
    );
  }

  chatDocuments$!: Observable<ChatDocumentDataListItem[]>;

  newDocumentName: string = '';
  newDocumentDescription: string = '';
  newDocumentPath: string = '';
  isNewDocumentDialogVisible: boolean = false;

  showNewDocumentDialog() {
    this.isNewDocumentDialogVisible = true;
    this.newDocumentName = '';
    this.newDocumentDescription = '';
  }

  createDocumentFromDialog() {
    if (!this.newDocumentName.trim()) {
      return;
    }

    const newDoc = createDefaultChatDocumentData(
      this.projectService.currentProjectId!,
      this.userService.user!.userId,
      this.newDocumentPath,
      this.newDocumentName
    );

    this.chatDocumentsService.createDocument(newDoc).subscribe(() => {
      this.isNewDocumentDialogVisible = false;
    });
  }

  selectDocument(doc: ChatDocumentDataListItem) {
    this.router.navigate([doc._id], { relativeTo: this.route });
  }

  deleteDocument(doc: ChatDocumentDataListItem) {
    if (doc._id) {
      this.chatDocumentsService.deleteDocument(doc._id).subscribe();
    }
  }
}
