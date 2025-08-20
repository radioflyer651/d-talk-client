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
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-document-tree-list',
  imports: [
    FormsModule,
    CommonModule,
    TreeModule,
    ButtonModule,
    ToolbarModule,
    NewDocumentComponent,
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

  collapseAll() {
    this.allNodes.forEach(n => n.expanded = false);
  }

  expandAll() {
    this.allNodes.forEach(n => n.expanded = true);
  }

  findOpenFile() {
    // If there's no selected node, then there's nothing for us to do.
    if (!this.selectedNode) {
      return;
    }

    const traverseFile = (targetFile: TreeNode<any>, currentResult?: TreeNode<any>[]): TreeNode<any>[] | undefined => {
      currentResult ??= [];
      const currentParent = currentResult[currentResult.length - 1];
      const nodeList = currentParent ? currentParent.children ?? [] : this.rootNodes;

      for (let n of nodeList) {
        // Add the current node to the current (potential) result list.
        let thisResult: TreeNode<any>[] | undefined = [...currentResult, n];

        // If this node is the target file, then we're done.  Return the list.
        if (n === targetFile) {
          return thisResult;
        }

        // Check the children of this node, recursively.
        if (n.children) {
          thisResult = traverseFile(targetFile, thisResult);

          // If we got a result, then we're finished.
          if (thisResult) {
            return thisResult;
          }
        }
      }

      // Getting to this point means we don't have a match (at least at this branch of the tree).
      return undefined;
    };

    // Try to find the ownership structure of the current file.
    const family = traverseFile(this.selectedNode);

    // We should have found one, but if not, let's not cry.
    if (!family) {
      return;
    }

    // Expand the whole family.
    family.forEach(f => {
      f.expanded = true;
    });
  }
}
