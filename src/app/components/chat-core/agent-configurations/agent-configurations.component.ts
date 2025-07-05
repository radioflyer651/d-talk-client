import { Component } from '@angular/core';
import { ComponentBase } from '../../component-base/component-base.component';
import { AgentConfigListComponent } from "./agent-config-list/agent-config-list.component";
import { CreateAgentConfigComponent } from "./create-agent-config/create-agent-config.component";
import { InstructionEditorComponent } from "../../instruction-editor/instruction-editor.component";

@Component({
  selector: 'app-agent-configurations',
  imports: [AgentConfigListComponent, CreateAgentConfigComponent, InstructionEditorComponent],
  templateUrl: './agent-configurations.component.html',
  styleUrl: './agent-configurations.component.scss'
})
export class AgentConfigurationsComponent extends ComponentBase {
  constructor(

  ) {
    super();
  }


}
