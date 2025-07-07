import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoredMessage } from '@langchain/core/messages';
import { ButtonModule } from 'primeng/button';
import { ChatMessageComponent } from "./chat-message/chat-message.component";

@Component({
  selector: 'app-chatting',
  imports: [
    FormsModule,
    CommonModule,
    ButtonModule,
    ChatMessageComponent
],
  templateUrl: './chatting.component.html',
  styleUrl: './chatting.component.scss'
})
export class ChattingComponent {

  messages = dummyMessages;

}

const dummyMessages: StoredMessage[] = [
  {
    type: 'chat',
    data: { content: 'Hello! How can I help you today?', role: 'ai', name: 'AI', tool_call_id: undefined }
  },
  {
    type: 'chat',
    data: { content: 'Hi! Can you tell me a joke?', role: 'human', name: 'User', tool_call_id: undefined }
  },
  {
    type: 'chat',
    data: { content: 'Why did the scarecrow win an award? Because he was outstanding in his field!', role: 'ai', name: 'AI', tool_call_id: undefined }
  },
  {
    type: 'chat',
    data: { content: 'Haha, that was a good one! Can you give me another?', role: 'human', name: 'User', tool_call_id: undefined }
  },
  {
    type: 'chat',
    data: { content: 'Sure! Why don’t scientists trust atoms? Because they make up everything.', role: 'ai', name: 'AI', tool_call_id: undefined }
  },
  {
    type: 'chat',
    data: { content: 'I love science jokes! What about a math joke?', role: 'human', name: 'User', tool_call_id: undefined }
  },
  {
    type: 'chat',
    data: { content: 'Why was the math book sad? Because it had too many problems.', role: 'ai', name: 'AI', tool_call_id: undefined }
  },
  {
    type: 'chat',
    data: { content: 'These are great! Do you know any puns?', role: 'human', name: 'User', tool_call_id: undefined }
  },
  {
    type: 'chat',
    data: { content: 'I’m reading a book on anti-gravity. It’s impossible to put down!', role: 'ai', name: 'AI', tool_call_id: undefined }
  },
  {
    type: 'chat',
    data: { content: 'Thanks for the laughs, AI!', role: 'human', name: 'User', tool_call_id: undefined }
  }
];