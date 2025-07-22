import { TreeNode } from "primeng/api";
import { IChatDocumentData } from "../model/shared-models/chat-core/documents/chat-document.model";


/** Given a set of documents, returns a root TreeNode for the folder structure of the documents. */
export function createDocumentTree(documents: IChatDocumentData[], includeIcon: boolean = true): { root: TreeNode, allNodes: TreeNode[]; } {
    const folders = new Map<string, TreeNode>();
    const allNodes: TreeNode[] = [];
    const rootNode = <TreeNode>{
        label: 'root',
        data: '.root',
        key: '.root',
        children: []
    };

    function getEndName(path: string) {
        const folders = path.split('/');
        return folders[folders.length - 1];
    }

    function getFolder(path: string): TreeNode {
        let result = folders.get(path);
        if (result) {
            return result;
        }

        result = <TreeNode>{
            label: getEndName(path),
            data: path,
            children: [],
            key: path,
            expandedIcon: 'fa-solid fa-folder-open',
            collapsedIcon: 'fa fa-folder',
            selectable: false,
        };

        allNodes.push(result);
        folders.set(path, result);
        return result;
    }

    function getOwningFolder(path: string): TreeNode {
        const elements = path.split('/');

        let buildPath = '';
        let finalResult: TreeNode | undefined = undefined;

        for (let i = 0; i < elements.length; i++) {
            buildPath = elements.slice(0, i + 1).join('/');
            const nextResult = getFolder(buildPath);

            if (finalResult) {
                if (!finalResult.children!.includes(nextResult)) {
                    finalResult.children!.push(nextResult);
                }
            } else {
                if (!rootNode.children!.includes(nextResult)) {
                    rootNode.children!.push(nextResult);
                }
            }

            finalResult = nextResult;
        }

        return finalResult!;
    }

    documents.forEach(d => {
        const folder = getOwningFolder(d.folderLocation);
        const result = {
            label: d.name,
            data: d,
            key: d._id,
            icon: includeIcon ? 'fa fa-file' : undefined,
            selectable: true,
        };
        folder.children!.push(result);
        allNodes.push(result);
    });

    // Sort all of the nodes.
    allNodes.filter(n => !!n.children).forEach(f => {
        f.children!.sort((v1, v2) => {
            if (!!v1.children !== !!v2.children) {
                if (v1.children) {
                    return -1;
                } else {
                    return 1;
                }
            }
            return v1.label!.localeCompare(v2.label!);
        });
    });

    rootNode.children!.sort((v1, v2) => {
        if (!!v1.children !== !!v2.children) {
            if (v1.children) {
                return -1;
            } else {
                return 1;
            }
        }

        return v1.label!.localeCompare(v2.label!);
    });

    return { root: rootNode, allNodes };
}