import { Component } from '@angular/core';
import { ChatJobListComponent } from "./chat-job-list/chat-job-list.component";
import { ChatJobDetailComponent } from "./chat-job-detail/chat-job-detail.component";

@Component({
  selector: 'app-chat-jobs',
  imports: [ChatJobListComponent, ChatJobDetailComponent],
  templateUrl: './chat-jobs.component.html',
  styleUrl: './chat-jobs.component.scss'
})
export class ChatJobsComponent {

}
