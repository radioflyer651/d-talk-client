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
import { ConfirmationService, TreeNode } from 'primeng/api';
import { lastValueFrom, map, takeUntil } from 'rxjs';
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
    readonly confirmationService: ConfirmationService,
  ) {
    super();
  }

  ngOnInit() {
    this.params.params$.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(params => {
      this.chatDocumentsService.currentProjectId = params['projectId'];
      this.selectedDocumentId = params['documentId'];
    });

    this.chatDocumentsService.documentList$.pipe(
      takeUntil(this.ngDestroy$),
    ).subscribe(docs => {
      if (!docs) {
        docs = [];
      }

      const treeResult = createDocumentTree(docs, false);
      this.rootNodes = treeResult.root.children!;
      this.allNodes = treeResult.allNodes;
      this.allNodes.forEach(n => n.expanded = true);
    });
  }

  rootNodes: TreeNode[] = [];
  allNodes: TreeNode[] = [];

  selectedDocumentId: string | undefined;

  get selectedNode(): TreeNode | undefined {
    if (!this.selectedDocumentId) {
      return undefined;
    }

    return this.allNodes.find(n => n.key === this.selectedDocumentId);
  }
  set selectedNode(value: TreeNode | undefined) {
    if (!value) {
      this.selectedDocumentId = undefined;
      // Remove the documentId route param from the URL
      this.router.navigate(['chat-documents'], { relativeTo: this.route.parent });
    }
    if (value) {
      this.selectedDocumentId = value.key;
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

  async deleteDocument(doc: IChatDocumentData) {
    if (doc._id) {
      this.confirmationService.confirm({
        header: 'Delete Confirmation',
        message: `Are you sure you want to delete this document?`,
        accept: async () => {
          await lastValueFrom(this.chatDocumentsService.deleteDocument(doc._id));
          // Deselect the current node, if we just deleted it.
          const selectedDocumentId = this.selectedNode?.data._id as string | undefined;
          if (selectedDocumentId === doc._id) {
            this.selectedNode = undefined;
          }
        }
      });
    }
  }
}
