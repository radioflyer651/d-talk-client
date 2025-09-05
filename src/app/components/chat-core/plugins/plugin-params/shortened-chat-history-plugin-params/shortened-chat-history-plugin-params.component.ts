import { Component, Input } from '@angular/core';
import { ShortenedChatHistoryPluginConfig } from '../../../../../../model/shared-models/chat-core/plugins/shortened-chat-history-plugin-config.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
    selector: 'app-shortened-chat-history-plugin-params',
    imports: [
        CommonModule,
        FormsModule,
        FloatLabelModule,
        InputNumberModule,
    ],
    templateUrl: './shortened-chat-history-plugin-params.component.html',
    styleUrls: ['./shortened-chat-history-plugin-params.component.scss']
})
export class ShortenedChatHistoryPluginParamsComponent {
    @Input() params!: ShortenedChatHistoryPluginConfig;
}
