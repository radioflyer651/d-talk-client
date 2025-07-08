import { Component, Input } from '@angular/core';
import { ActDrunkPluginParams } from '../../../../../../model/shared-models/chat-core/plugins/act-drunk-plugin.params';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-drunk-plugin-params',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    FloatLabelModule,
  ],
  templateUrl: './drunk-plugin-params.component.html',
  styleUrl: './drunk-plugin-params.component.scss'
})
export class DrunkPluginParamsComponent {

  @Input({ required: true })
  params!: ActDrunkPluginParams;
}
