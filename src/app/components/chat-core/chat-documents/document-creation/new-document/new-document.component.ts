import { Component, EventEmitter, Input, Output } from '@angular/core';
import { documentInformation } from '../../../../../../model/shared-models/chat-core/documents/document-type.constants';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { ChatDocumentsService } from '../../../../../services/chat-core/chat-documents/chat-documents.service';
import { ObjectId } from 'mongodb';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { CurrentRouteParamsService } from '../../../../../services/current-route-params.service';
import { takeUntil } from 'rxjs';
import { UserService } from '../../../../../services/user.service';
import { ButtonModule } from 'primeng/button';
import { PageSizeService } from '../../../../../services/page-size.service';

@Component({
  selector: 'app-new-document',
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
    DialogModule,
    ButtonModule,
  ],
  templateUrl: './new-document.component.html',
  styleUrl: './new-document.component.scss'
})
export class NewDocumentComponent extends ComponentBase {
  constructor(
    readonly chatDocumentsService: ChatDocumentsService,
    readonly paramService: CurrentRouteParamsService,
    readonly userService: UserService,
    readonly pageSizeService: PageSizeService,
  ) {
    super();
  }

  ngOnInit() {
    this.paramService.params$.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(params => {
      this.projectId = params['projectId'];
    });
  }

  resetProps() {
    this.newDocumentPath = 'documents/temp';
    this.newDocumentName = 'New Document';
    this.newDocumentDescription = '';
    this.documentType = 'text';
  }

  projectId!: ObjectId;

  /** Gets or sets the type of document we want to create. */
  documentType: string = 'text';

  /** The types of documents that can be created. */
  documentTypes = documentInformation;

  newDocumentDescription: string = '';
  newDocumentPath: string = 'documents/temp';
  newDocumentName: string = 'New Document';

  private _visible: boolean = false;
  @Input()
  get visible(): boolean {
    return this._visible;
  }
  set visible(value: boolean) {
    this._visible = value;

    this.resetProps();
    this.visibleChange.next(value);
  }

  @Output()
  readonly visibleChange = new EventEmitter<boolean>();

  closeDialog(cancel: boolean) {
    if (cancel) {
      this.visible = false;
      return;
    }

    if (!this.newDocumentName.trim()) {
      return;
    }

    const docInfo = this.documentTypes.find(t => t.documentType === this.documentType)!;

    const projectId = this.projectId;
    const userId = this.userService.user!.userId;

    const creationProps = docInfo.createDefaultParameters(projectId, userId);
    creationProps.name = this.newDocumentName;
    creationProps.folderLocation = this.newDocumentPath;
    creationProps.description = this.newDocumentDescription;

    this.chatDocumentsService.createDocument(creationProps).subscribe(() => {
      this.visible = false;
    });
  }

}
