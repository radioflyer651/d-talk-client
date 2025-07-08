import { Component, Input } from '@angular/core';
import { PluginInfo, pluginInformation } from '../../../../../model/shared-models/chat-core/plugins/plugin-type-constants.data';
import { IPluginConfigurationAttachmentType } from '../../../../../model/shared-models/chat-core/plugin-configuration-attachement-types.model';
import { PluginSpecification } from '../../../../../model/shared-models/chat-core/plugin-specification.model';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { generateObjectId } from '../../../../../utils/generate-object-id.utils';

export type PluginSelectionData = {
  pluginInfo: PluginInfo,
  specification?: PluginSpecification,
};

@Component({
  selector: 'app-plugin-selector',
  imports: [
    CheckboxModule,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './plugin-selector.component.html',
  styleUrl: './plugin-selector.component.scss'
})
export class PluginSelectorComponent {

  pluginOptions = pluginInformation;

  private _attachmentTarget: IPluginConfigurationAttachmentType | undefined;
  /** Gets or sets the entity that plugins will be applied/removed from. */
  @Input({ required: true })
  get attachmentTarget(): IPluginConfigurationAttachmentType | undefined {
    return this._attachmentTarget;
  }
  set attachmentTarget(value: IPluginConfigurationAttachmentType | undefined) {
    this._attachmentTarget = value;
  }

  getDisplayName(plugin: PluginSpecification) {
    const info = this.pluginOptions.find(p => p.pluginType === plugin.pluginType);
    if (!info) {
      console.error(`No info found for plugin type ${plugin.pluginType}`);
      return plugin.pluginType;
    }

    return info.displayName;
  }

  addOption(option: PluginInfo) {
    this.attachmentTarget?.plugins.push({ id: generateObjectId(), pluginType: option.pluginType, configuration: option.defaultParameterCreator() });
  }

  removePlugin(plugin: PluginSpecification) {
    const itemIndex = this.attachmentTarget?.plugins.findIndex(x => x.id === plugin.id) ?? -1;

    if (itemIndex < 0) {
      console.log(`Could not find item to remove: ${plugin.id}, ${plugin.pluginType}`);
      return;
    }

    this.attachmentTarget?.plugins.splice(itemIndex, 1);
  }
}


