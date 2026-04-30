import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PromptToolCallingPluginConfiguration } from '../../../../../../model/shared-models/chat-core/plugins/prompt-tool-calling-plugin.params';

@Component({
    selector: 'app-prompt-tool-calling-plugin-params',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CheckboxModule,
        FloatLabelModule,
        InputNumberModule,
        InputTextModule,
    ],
    templateUrl: './prompt-tool-calling-plugin-params.component.html',
    styleUrl: './prompt-tool-calling-plugin-params.component.scss',
})
export class PromptToolCallingPluginParamsComponent {
    @Input({ required: true }) params!: PromptToolCallingPluginConfiguration;
}
