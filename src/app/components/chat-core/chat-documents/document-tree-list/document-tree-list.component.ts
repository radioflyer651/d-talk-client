import { Component } from '@angular/core';
import { ComponentBase } from '../../../component-base/component-base.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatDocumentsService } from '../../../../services/chat-core/chat-documents/chat-documents.service';
import { ProjectsService } from '../../../../services/chat-core/projects.service';
import { CurrentRouteParamsService } from '../../../../services/current-route-params.service';
import { UserService } from '../../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { map, takeUntil } from 'rxjs';
import { createDocumentTree } from '../../../../../utils/create-document-tree.utils';
import { ButtonModule } from 'primeng/button';
import { IChatDocumentData } from '../../../../../model/shared-models/chat-core/documents/chat-document.model';
import { NewDocumentComponent } from "../document-creation/new-document/new-document.component";

@Component({
  selector: 'app-document-tree-list',
  imports: [
    FormsModule,
    CommonModule,
    TreeModule,
    ButtonModule,
    NewDocumentComponent
],
  templateUrl: './document-tree-list.component.html',
  styleUrl: './document-tree-list.component.scss'
})
export class DocumentTreeListComponent extends ComponentBase {
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

    this.chatDocumentsService.documentList$.pipe(
      takeUntil(this.ngDestroy$),
    ).subscribe(docs => {
      if (!docs) {
        docs = [];
      }

      const treeResult = createDocumentTree(docs, false);
      this.rootNodes = treeResult.root.children!;
      this.rootNodes.forEach(n => n.expanded = true);
      this.allNodes = treeResult.allNodes;
    });
  }

  rootNodes: TreeNode[] = [];
  allNodes: TreeNode[] = [];

  private _selectedNode: TreeNode | undefined = undefined;
  get selectedNode(): TreeNode | undefined {
    return this._selectedNode;
  }
  set selectedNode(value: TreeNode | undefined) {
    this._selectedNode = value;
    if (value) {
      this.router.navigate([value.key], { relativeTo: this.route });
    }
  }


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
