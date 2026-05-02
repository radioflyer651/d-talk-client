import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

/**
 * Reusable empty-state placeholder for list components.
 *
 * Usage:
 *   <app-empty-state
 *     title="No Chat Rooms Yet"
 *     message="Create a chat room to start a conversation with your partners."
 *     actionLabel="Create Chat Room"
 *     (action)="createNewChatRoom()">
 *   </app-empty-state>
 *
 * Omit actionLabel to render without a CTA button.
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  @Input() title = '';
  @Input() message = '';
  @Input() actionLabel = '';
  @Input() icon = 'fa-solid fa-inbox';

  @Output() readonly action = new EventEmitter<void>();
}
