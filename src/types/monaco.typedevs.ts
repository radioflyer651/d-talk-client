import loader from '@monaco-editor/loader';

export type MonacoEditorRootService = typeof import('monaco-editor');
export type MonacoEditorService = typeof import('monaco-editor').editor;
export type IStandaloneCodeEditor = import('monaco-editor').editor.IStandaloneCodeEditor;

/** Returns the MonacoEditorRootService, which can be used to create new Monaco Editor, and/or edit them. */
export const monacoLoader = async () => {
    loader.config({ paths: { vs: '/assets/monaco/vs' } });
    return await loader.init();
};