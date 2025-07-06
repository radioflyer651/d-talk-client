import { Component } from '@angular/core';
import { ChatJobListComponent } from "./chat-job-list/chat-job-list.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-chat-jobs',
  imports: [
    ChatJobListComponent,
    RouterModule,
  ],
  templateUrl: './chat-jobs.component.html',
  styleUrl: './chat-jobs.component.scss'
})
export class ChatJobsComponent {

}
