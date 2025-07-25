import { Component } from '@angular/core';
import { ComponentBase } from '../../../component-base/component-base.component';
import { ChatDocumentsService } from '../../../../services/chat-core/chat-documents/chat-documents.service';
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
import { UserService } from '../../../../services/user.service';
import { TextareaModule } from 'primeng/textarea';
import { IChatDocumentData } from '../../../../../model/shared-models/chat-core/documents/chat-document.model';
import { NewDocumentComponent } from "../document-creation/new-document/new-document.component";

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
    NewDocumentComponent,
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
      this.chatDocumentsService.currentProjectId = params['projectId'];
    });

    this.chatDocuments$ = this.chatDocumentsService.documentList$.pipe(
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

  chatDocuments$!: Observable<IChatDocumentData[]>;

  newDocumentName: string = '';
  newDocumentDescription: string = '';
  newDocumentPath: string = '';
  isNewDocumentDialogVisible: boolean = false;

  showNewDocumentDialog() {
    this.isNewDocumentDialogVisible = true;
    this.newDocumentName = '';
    this.newDocumentDescription = '';
  }

  selectDocument(doc: IChatDocumentData) {
    this.router.navigate([doc._id], { relativeTo: this.route });
  }

  deleteDocument(doc: IChatDocumentData) {
    if (doc._id) {
      this.chatDocumentsService.deleteDocument(doc._id).subscribe();
    }
  }
}
