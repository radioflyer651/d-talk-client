import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentBase } from '../component-base/component-base.component';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectModule } from 'primeng/select';
import { IStandaloneCodeEditor, MonacoEditorRootService, monacoLoader } from '../../../types/monaco.typedevs';
import { PageSizeService } from '../../services/page-size.service';
import { distinctUntilChanged, takeUntil } from 'rxjs';

/** Since the properties of the MonacoEditor may need to be stored outside of the
 *   the component, we need to define the properties it might require. */
export interface MonacoEditorOptions {
  /** Boolean value indicating whether or not wordwrap is turned on. */
  wordWrapOn: boolean;
  /** The language of the content, if any, inside the editor.  'plaintext' is the default value. */
  currentLanguage: string;
  /** Boolean value indicating whether or not the toolbar should be shown.  Default: true. */
  showToolbar?: boolean;
}

@Component({
  selector: 'app-monaco-editor',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    ToolbarModule,
    ToggleButtonModule,
    SelectModule,
  ],
  templateUrl: './monaco-editor.component.html',
  styleUrl: './monaco-editor.component.scss'
})
export class MonacoEditorComponent extends ComponentBase {
  constructor(
    readonly pageSizeService: PageSizeService,
  ) {
    super();

    this.uniqueId = Math.random().toString(36).slice(2, 9);
  }

  /** A unique ID to apply to the target element's ID attribute so the same ID isn't used
   *   when multiple editors are created. */
  readonly uniqueId: string;

  /** Controls whether or not the full or short language list should be shown in the language list dropdown. */
  useShortLanguageList: boolean = true;

  get htmlEditorElementId() {
    return `monoco-editor-${this.uniqueId}`;
  }

  get languageList() {
    if (this.useShortLanguageList) {
      return this.shortLanguageList;
    } else {
      return this.fullLanguageList;
    }
  }

  /** Gets or sets the editor being worked on in the component. */
  editor!: IStandaloneCodeEditor;

  fullLanguageList = [] as ({ label: string, value: string; })[];

  shortLanguageList = [
    {
      label: 'Plain Text',
      value: 'plaintext'
    },
    {
      label: 'TypeScript',
      value: 'typescript',
    },
    {
      label: 'C#',
      value: 'csharp'
    },
    {
      label: 'Python',
      value: 'python',
    },
    {
      label: 'CSS',
      value: 'css',
    },
    {
      label: 'SCSS',
      value: 'scss',
    },
    {
      label: 'JavaScript',
      value: 'javascript',
    },
    {
      label: 'Java',
      value: 'java',
    },
    {
      label: 'HTML',
      value: 'html'
    },
    {
      label: 'Markdown',
      value: 'markdown'
    },
    {
      label: 'XML',
      value: 'xml'
    },
    {
      label: 'YAML',
      value: 'yaml'
    },
  ].sort((v1, v2) => v1.label.localeCompare(v2.label));

  ngAfterViewInit() {
    setTimeout(() => {
      this.createEditor();

      // This doesn't work if it's not on a timeout.  This sucks, but it's just the way of things.
      //  It also doesn't work (100% of the time ??) without a timeout value.
      setTimeout(() => {
        this.pageSizeService.isSkinnyPage$.pipe(
          takeUntil(this.ngDestroy$),
          distinctUntilChanged(),
        ).subscribe(value => {
          this.editor.updateOptions({ minimap: { enabled: !value } });
        });
      });
    }, 50);
  }

  ngOnDestory() {
    super.ngOnDestroy();
    this.cleanupEditor();
  }

  private cleanupEditor() {
    if (!this.editor) {
      return;
    }

    this.editor.dispose();
  }

  private async createEditor() {
    // Clean up any previous editor, if there was one.  (This is highly unlikely, but still a precaution.)
    this.cleanupEditor();

    // Get the editor's container.
    const editorContainer = document.getElementById(this.htmlEditorElementId);

    if (!editorContainer) {
      throw new Error(`Container does not exist.`);
    }


    // Get the monaco service from the loader.
    const monaco = await monacoLoader();

    // Store it locally, so we can use it again later.
    this.monacoService = monaco;

    // Create the editor.
    this.editor = monaco.editor.create(editorContainer!, {
      value: this.content,
      language: this.editorOptions.currentLanguage,
      automaticLayout: true,
      wordWrap: this.getEditorWordWrapValue(),
      fontSize: this.fontSize,
    });

    // Wire up the event handlers.
    this.editor.onDidChangeModelContent(e => {
      this.content = this.editor.getValue();
    });

    this.editor.onDidChangeModelLanguage(e => {
      this.editorOptions.currentLanguage = e.newLanguage;
    });

    // Set the full language list.
    this.fullLanguageList = monaco.languages.getLanguages().map(l => {
      let name = l.id;
      if (l.aliases && l.aliases[0]) {
        name = l.aliases[0];
      }

      return {
        label: name,
        value: l.id
      };
    });
  }

  /** Provides system-level services for working with the Monaco Editor. */
  monacoService!: MonacoEditorRootService;

  private _content: string = '';
  @Input({ required: true })
  get content(): string {
    return this._content;
  }
  set content(value: string) {
    // Prevent infinite loops.
    if (this._content === value) {
      return;
    }

    this._content = value;

    if (this.editor) {
      if (this.editor.getValue() !== value) {
        this.editor.setValue(value);
      }
    }

    this.contentChange.emit(value);
  }

  @Output()
  contentChange = new EventEmitter<string>();

  @Input()
  editorOptions: MonacoEditorOptions = {
    wordWrapOn: false,
    currentLanguage: 'plaintext'
  };

  private _fontSize: number | undefined = 12;
  @Input()
  get fontSize(): number | undefined {
    return this._fontSize;
  }
  set fontSize(value: number | undefined) {
    this._fontSize = value;

    if (this.editor) {
      this.editor.updateOptions({
        fontSize: value
      });
    }
  }

  languageChangeModalVisible: boolean = false;
  newLanguage = 'plaintext';

  showLanguageChangeDialog(): void {
    this.newLanguage = this.editorOptions.currentLanguage;
    this.languageChangeModalVisible = true;
  }

  closeLanguageChangeDialog(cancelled: boolean) {
    this.languageChangeModalVisible = false;
    if (cancelled) {
      return;
    }

    this.editorOptions.currentLanguage = this.newLanguage;
    const model = this.editor!.getModel();
    if (model) {
      this.monacoService.editor.setModelLanguage(model, this.editorOptions.currentLanguage);
    }
  }

  getEditorWordWrapValue() {
    return this.editorOptions.wordWrapOn ? 'on' : 'off';
  }
  toggleWordwrap() {
    this.editor!.updateOptions({ wordWrap: this.getEditorWordWrapValue() });
  }
}
