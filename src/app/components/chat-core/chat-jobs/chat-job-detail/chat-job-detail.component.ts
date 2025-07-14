import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TextareaModule } from 'primeng/textarea';
import { TabsModule } from 'primeng/tabs';
import { ComponentBase } from '../../../component-base/component-base.component';
import { ChatJobsService } from '../../../../services/chat-core/chat-jobs.service';
import { ChatJobConfiguration } from '../../../../../model/shared-models/chat-core/chat-job-data.model';
import { lastValueFrom, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { PositionableMessageListComponent } from "../../positionable-messages/positionable-message-list/positionable-message-list.component";
import { ActivatedRoute } from '@angular/router';
import { PluginSelectorComponent } from "../../plugins/plugin-selector/plugin-selector.component";
import { DocumentPermissionsComponent } from "../../chat-documents/document-permissions/document-permissions.component";

@Component({
  selector: 'app-chat-job-detail',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    FloatLabelModule,
    PanelModule,
    CardModule,
    ButtonModule,
    TabsModule,
    PositionableMessageListComponent,
    PluginSelectorComponent,
    DocumentPermissionsComponent
],
  templateUrl: './chat-job-detail.component.html',
  styleUrl: './chat-job-detail.component.scss'
})
export class ChatJobDetailComponent extends ComponentBase {
  constructor(
    readonly jobService: ChatJobsService,
    readonly route: ActivatedRoute,
  ) {
    super();
  }

  tabIndex = 0;

  private _isVisible: boolean = false;
  @Input()
  get isVisible(): boolean {
    return this._isVisible;
  }
  set isVisible(value: boolean) {
    this._isVisible = value;
    this.isVisibleChange.next(value);
  }

  @Output()
  isVisibleChange = new EventEmitter<boolean>();

  private reloadJobConfiguration = new Subject<void>();

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.ngDestroy$)
    ).subscribe(params => {
      this.jobService.selectedJobId = params['jobId'];
    });

    this.reloadJobConfiguration.pipe(
      startWith(undefined),
      switchMap(() => this.jobService.selectedJob$.pipe(
        takeUntil(this.ngDestroy$)
      ))
    ).subscribe(job => {
      if (job) {
        job.chatDocumentReferences ??= [];
      }
      this.jobConfig = job;
    });
  }

  jobConfig: ChatJobConfiguration | undefined;

  async onOk() {
    const value = this.jobService.selectedJob;
    if (value) {
      await lastValueFrom(this.jobService.updateJob(value));
    }
  }

  onCancel() {
    this.reloadJobConfiguration.next();
  }
}
