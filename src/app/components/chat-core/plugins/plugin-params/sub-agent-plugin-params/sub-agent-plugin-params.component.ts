import { Component, Input } from '@angular/core';
import { ComponentBase } from '../../../../component-base/component-base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AgentConfigurationService } from '../../../../../services/chat-core/agent-configuration.service';
import { ChatAgentIdentityConfiguration } from '../../../../../../model/shared-models/chat-core/agent-configuration.model';
import { SubAgentPluginConfiguration } from '../../../../../../model/shared-models/chat-core/plugins/sub-agent-plugin.params';

@Component({
    selector: 'app-sub-agent-plugin-params',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CheckboxModule,
        FloatLabelModule,
        InputNumberModule,
        InputTextModule,
        TextareaModule,
    ],
    templateUrl: './sub-agent-plugin-params.component.html',
    styleUrl: './sub-agent-plugin-params.component.scss',
})
export class SubAgentPluginParamsComponent extends ComponentBase {
    constructor(
        readonly agentService: AgentConfigurationService,
        readonly route: ActivatedRoute,
    ) {
        super();
    }

    ngOnInit() {
        this.agentService.agentConfigurations$.pipe(
            takeUntil(this.ngDestroy$)
        ).subscribe(agents => {
            this.agents = agents;
            this.buildOptions();
        });
    }

    agents: ChatAgentIdentityConfiguration[] = [];
    agentOptions: SubAgentAllowedOption[] = [];

    private _params!: SubAgentPluginConfiguration;

    @Input({ required: true })
    get params(): SubAgentPluginConfiguration {
        return this._params;
    }
    set params(value: SubAgentPluginConfiguration) {
        this._params = value;
        this.buildOptions();
    }

    private buildOptions() {
        if (!this._params) {
            this.agentOptions = [];
            return;
        }
        this.agentOptions = this.agents.map(a => new SubAgentAllowedOption(a, this._params));
    }
}

export class SubAgentAllowedOption {
    constructor(
        readonly agent: ChatAgentIdentityConfiguration,
        private readonly params: SubAgentPluginConfiguration,
    ) {}

    get agentName(): string {
        return this.agent.name ?? this.agent.chatName ?? '';
    }

    get isAllowed(): boolean {
        return this.params.allowedAgentIdentityIds.includes(this.agent._id.toString());
    }
    set isAllowed(value: boolean) {
        const id = this.agent._id.toString();
        const idx = this.params.allowedAgentIdentityIds.indexOf(id);
        if (value && idx < 0) {
            this.params.allowedAgentIdentityIds.push(id);
        } else if (!value && idx >= 0) {
            this.params.allowedAgentIdentityIds.splice(idx, 1);
        }
    }
}
