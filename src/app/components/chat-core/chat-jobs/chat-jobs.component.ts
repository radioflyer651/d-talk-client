import { Component } from '@angular/core';
import { ChatJobListComponent } from './chat-job-list/chat-job-list.component';
import { RouterModule } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { PageSizeService } from '../../../services/page-size.service';
import { ComponentBase } from '../../component-base/component-base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-jobs',
  imports: [
    FormsModule,
    CommonModule,
    ChatJobListComponent,
    RouterModule,
    DrawerModule,
    ButtonModule,
  ],
  templateUrl: './chat-jobs.component.html',
  styleUrl: './chat-jobs.component.scss'
})
export class ChatJobsComponent extends ComponentBase {
  constructor(
    public pageSizeService: PageSizeService,
  ) {
    super();
  }

  private _showDrawer: boolean = false;
  public get showDrawer(): boolean {
    if (!this.pageSizeService.isSkinnyPage) {
      return false;
    }
    return this._showDrawer;
  }
  public set showDrawer(v: boolean) {
    this._showDrawer = v;
  }

  openDrawer() {
    this.showDrawer = true;
  }

  closeDrawer() {
    this.showDrawer = false;
  }
}
