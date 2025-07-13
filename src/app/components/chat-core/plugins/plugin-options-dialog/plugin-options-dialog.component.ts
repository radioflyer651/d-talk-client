import { Component, Input } from '@angular/core';
import { ComponentBase } from '../../../component-base/component-base.component';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { pluginInformation } from '../../../../../model/shared-models/chat-core/plugins/plugin-type-constants.data';
import { DrunkPluginParamsComponent } from "../plugin-params/drunk-plugin-params/drunk-plugin-params.component";
import { ButtonModule } from 'primeng/button';
import { IgnoreSpecificAgentPluginParamsComponent } from "../plugin-params/ignore-specific-agent-plugin-params/ignore-specific-agent-plugin-params.component";
import { LabeledMemoryPluginParamsComponent } from "../plugin-params/label-memory-plugin-params/label-memory-plugin-params.component";

@Component({
  selector: 'app-plugin-options-dialog',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    DrunkPluginParamsComponent,
    ButtonModule,
    IgnoreSpecificAgentPluginParamsComponent,
    LabeledMemoryPluginParamsComponent
],
  templateUrl: './plugin-options-dialog.component.html',
  styleUrl: './plugin-options-dialog.component.scss'
})
export class PluginOptionsDialogComponent extends ComponentBase {
  constructor() {
    super();
  }

  /** Controls the dialog visibility. */
  visible: boolean = false;

  private pluginInfo = pluginInformation;

  getSelectedPluginInfo() {
    return this.pluginInfo.find(p => p.pluginType === this.pluginType);
  }

  get pluginName(): string {
    const pluginInfo = this.getSelectedPluginInfo();
    if (pluginInfo) {
      return pluginInfo.displayName;
    }

    return 'Unknown';
  }

  /** Gets or sets the type of plugin the options are being shown for. */
  @Input({ required: true })
  pluginType: string | undefined;

  /** Gets or sets the parameters being worked with. */
  @Input({ required: true })
  pluginParams: any;

  /** Returns a boolean value indicating whether or not the form can be shown, given
   *   the parameters. */
  get canShowParams(): boolean {
    const info = this.getSelectedPluginInfo();
    return !!info && this.pluginParams !== undefined && this.pluginParams !== null;
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }
}
