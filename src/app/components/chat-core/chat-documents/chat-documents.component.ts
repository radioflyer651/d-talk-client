import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatDocumentDetailComponent } from "./chat-document-detail/chat-document-detail.component";
import { ComponentBase } from '../../component-base/component-base.component';
import { CurrentRouteParamsService } from '../../../services/current-route-params.service';
import { of, switchMap, takeUntil } from 'rxjs';
import { PageSizeService } from '../../../services/page-size.service';
import { ChatDocumentsService } from '../../../services/chat-core/chat-documents/chat-documents.service';
import { CommonModule } from '@angular/common';
import { IChatDocumentData } from '../../../../model/shared-models/chat-core/documents/chat-document.model';
import { DocumentTreeListComponent } from "./document-tree-list/document-tree-list.component";
import { DrawerModule } from "primeng/drawer";
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'app-chat-documents',
  imports: [
    CommonModule,
    RouterModule,
    ChatDocumentDetailComponent,
    DocumentTreeListComponent,
    DrawerModule,
    ButtonModule,
  ],
  templateUrl: './chat-documents.component.html',
  styleUrl: './chat-documents.component.scss'
})
export class ChatDocumentsComponent extends ComponentBase {
  constructor(
    readonly paramsService: CurrentRouteParamsService,
    readonly documentService: ChatDocumentsService,
    readonly pageSizeService: PageSizeService,
  ) {
    super();
  }

  ngOnInit() {
    this.paramsService.params$.pipe(
      takeUntil(this.ngDestroy$),
      switchMap(params => {
        const docId = params['documentId'];
        if (!docId) {
          return of(undefined);
        }

        return this.documentService.getDocumentById(docId);
      })
    ).subscribe(document => {
      this.document = document;
    });
  }

  speedDialItems = [
    [
      {
        icon: 'fa-solid fa-list-tree',
        command: () => {
          this.showDrawer = true;
        }
      }
    ]
  ];

  document?: IChatDocumentData;

  private _showDrawer: boolean = false;
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
    console.log(`Hit`);
    this.showDrawer = false;
  }
}
