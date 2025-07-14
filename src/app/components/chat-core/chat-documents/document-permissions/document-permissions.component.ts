import { Component, Input } from '@angular/core';
import { ComponentBase } from '../../../component-base/component-base.component';
import { ChatDocumentsService } from '../../../../services/chat-core/chat-documents.service';
import { IChatDocumentData } from '../../../../../model/shared-models/chat-core/documents/chat-document.model';
import { takeUntil } from 'rxjs';
import { ChatDocumentPermissions, createChatDocumentPermissions } from '../../../../../model/shared-models/chat-core/documents/chat-document-permissions.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ChatDocumentReference } from '../../../../../model/shared-models/chat-core/documents/chat-document-reference.model';
import { ObjectId } from 'mongodb';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DocumentSelectorComponent } from "../document-selector/document-selector.component";
import { CurrentRouteParamsService } from '../../../../services/current-route-params.service';

interface OptionType {
  documentName: string;
  permissions: ChatDocumentPermissions;
  documentId: ObjectId;
}

@Component({
  selector: 'app-document-permissions',
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    ButtonModule,
    DialogModule,
    DocumentSelectorComponent
  ],
  templateUrl: './document-permissions.component.html',
  styleUrl: './document-permissions.component.scss'
})
export class DocumentPermissionsComponent extends ComponentBase {
  constructor(
    readonly documentService: ChatDocumentsService,
    readonly paramsService: CurrentRouteParamsService,
  ) {
    super();
  }

  ngOnInit() {
    this.paramsService.params$.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(params => {
      this.documentService.currentProjectId = params['projectId'];
    });

    this.documentService.documentList$.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(docs => {
      this.documents = docs ?? [];
      this.setOptions();
    });
  }

  documents!: IChatDocumentData[];

  getDocumentName(docId: ObjectId): string {
    return this.documents?.find(d => d._id === docId)?.name ?? '';
  }


  private _permissions: ChatDocumentReference[] | undefined = undefined;
  @Input({ required: true })
  get permissions(): ChatDocumentReference[] | undefined {
    return this._permissions;
  }
  set permissions(value: ChatDocumentReference[] | undefined) {
    this._permissions = value;
    this.setOptions();
  }

  private setOptions() {
    if (this.permissions) {
      this.permissionOptions = this.permissions.map(p => ({
        documentName: this.getDocumentName(p.documentId),
        documentId: p.documentId,
        permissions: p.permission
      }));

    } else {
      this.permissionOptions = [];
    }
  }

  permissionOptions: OptionType[] = [];

  deletePermission(option: OptionType) {
    if (!this.permissions) {
      throw new Error(`No permissions set.`);
    }

    const removeId = this.permissions.findIndex(o => o.documentId === option.documentId);

    if (removeId < 0) {
      throw new Error(`Option ID is invalid for deletion.`);
    }

    this.permissions.splice(removeId, 1);
    this.setOptions();
  }


  selectedDocumentId: ObjectId | undefined = undefined;

  isNewPermissionVisible: boolean = false;
  createNewPermission() {
    this.selectedDocumentId = undefined;
    this.isNewPermissionVisible = true;
  }

  newPermissionClosed(cancelled: boolean) {
    if (cancelled || !this.selectedDocumentId) {
      this.isNewPermissionVisible = false;
      return;
    }

    const selectedDocument = this.documents.find(d => d._id === this.selectedDocumentId);
    if (!selectedDocument) {
      this.isNewPermissionVisible = false;
      return;
    }

    this.permissions!.push({ documentId: selectedDocument._id, folderPath: selectedDocument.folderLocation, permission: createChatDocumentPermissions() });
    this.setOptions();
    this.isNewPermissionVisible = false;
  }
}
