import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { ComponentBase } from '../component-base/component-base.component';
import { PageSizeService } from '../../services/page-size.service';

/**
 * Shared layout shell for list+detail pages.
 *
 * Content slots:
 *   [list]       — rendered in the left panel on wide screens
 *   [drawerList] — rendered inside the slide-out drawer on narrow screens
 *   [detail]     — rendered in the right/main content area
 *
 * Usage:
 *   <app-list-detail-shell #shell drawerTitle="Chat Rooms">
 *     <app-my-list list></app-my-list>
 *     <app-my-list drawerList (itemClicked)="shell.closeDrawer()"></app-my-list>
 *     <router-outlet detail></router-outlet>
 *   </app-list-detail-shell>
 */
@Component({
  selector: 'app-list-detail-shell',
  standalone: true,
  imports: [CommonModule, DrawerModule, ButtonModule],
  templateUrl: './list-detail-shell.component.html',
  styleUrl: './list-detail-shell.component.scss',
})
export class ListDetailShellComponent extends ComponentBase {
  @Input() drawerTitle = '';

  /** Hide the floating drawer-open button when the parent provides its own trigger. */
  @Input() showFloatingTrigger = true;

  constructor(readonly pageSizeService: PageSizeService) {
    super();
  }

  private _showDrawer = false;

  get showDrawer(): boolean {
    if (!this.pageSizeService.isSkinnyPage) {
      return false;
    }
    return this._showDrawer;
  }

  set showDrawer(v: boolean) {
    this._showDrawer = v;
  }

  openDrawer() {
    this.showDrawer = true;
  }

  closeDrawer() {
    this.showDrawer = false;
  }
}
