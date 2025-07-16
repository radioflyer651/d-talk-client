import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil, startWith, map, Observable } from 'rxjs';
import { IChatDocumentData } from '../../../../../model/shared-models/chat-core/documents/chat-document.model';
import { ChatDocumentsService } from '../../../../services/chat-core/chat-documents/chat-documents.service';
import { ProjectsService } from '../../../../services/chat-core/projects.service';
import { CurrentRouteParamsService } from '../../../../services/current-route-params.service';
import { UserService } from '../../../../services/user.service';
import { ComponentBase } from '../../../component-base/component-base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ObjectId } from 'mongodb';

@Component({
  selector: 'app-document-selector',
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    FloatLabelModule,
  ],
  templateUrl: './document-selector.component.html',
  styleUrl: './document-selector.component.scss'
})
export class DocumentSelectorComponent extends ComponentBase {
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

    this.chatDocumentsService.documentList$.pipe(
      startWith([]),
      takeUntil(this.ngDestroy$),
    ).subscribe(docs => {
      this.chatDocuments = docs ?? [];
    });
  }

  chatDocuments: IChatDocumentData[] = [];

  private _selectedDocumentId: ObjectId | undefined = undefined;
  @Input()
  get selectedDocumentId(): ObjectId | undefined {
    return this._selectedDocumentId;
  }
  set selectedDocumentId(value: ObjectId | undefined) {
    this._selectedDocumentId = value;

    this.selectedDocumentIdChange.emit(value);
  }

  get selectedItem(): IChatDocumentData | undefined {
    return this.chatDocuments.find(d => d._id === this.selectedDocumentId);
  }
  set selectedItem(value: IChatDocumentData | undefined) {
    this.selectedDocumentId = this.chatDocuments.find(d => d._id === value?._id)?._id;
  }

  @Output()
  selectedDocumentIdChange = new EventEmitter<ObjectId | undefined>();

}
