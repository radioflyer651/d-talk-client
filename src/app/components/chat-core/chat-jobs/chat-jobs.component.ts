import { Component } from '@angular/core';
import { ChatJobListComponent } from './chat-job-list/chat-job-list.component';
import { RouterModule } from '@angular/router';
import { ListDetailShellComponent } from '../../list-detail-shell/list-detail-shell.component';

@Component({
  selector: 'app-chat-jobs',
  imports: [ChatJobListComponent, RouterModule, ListDetailShellComponent],
  templateUrl: './chat-jobs.component.html',
  styleUrl: './chat-jobs.component.scss',
})
export class ChatJobsComponent {}
