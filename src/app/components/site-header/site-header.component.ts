import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { PageSizeService } from '../../services/page-size.service';
import { MenuService } from '../../services/menu.service';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { TokenService } from '../../services/token.service';
import { LoginService } from '../../services/login.service';
import { ProjectsService } from '../../services/chat-core/projects.service';
import { ObjectId } from 'mongodb';
import { ChatRoomsService } from '../../services/chat-core/chat-rooms.service';
import { ComponentBase } from '../component-base/component-base.component';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-site-header',
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    DialogModule,
  ],
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss']
})
export class SiteHeaderComponent extends ComponentBase {
  constructor(
    readonly userService: UserService,
    readonly pageSizeService: PageSizeService,
    readonly menuService: MenuService,
    readonly tokenService: TokenService,
    readonly loginService: LoginService,
    readonly projectsService: ProjectsService,
    readonly chatRoomsService: ChatRoomsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.projectsService.currentProjectId$
      .pipe(takeUntil(this.ngDestroy$))
      .subscribe(id => {
        this.currentProjectId = id;
      });

    this.chatRoomsService.selectedChatRoom$
      .pipe(takeUntil(this.ngDestroy$))
      .subscribe(room => {
        this.currentChatRoomId = room?._id;
      });
  }

  logout(): void {
    this.userService.logout();
  }

  /** Shows the login dialog. */
  login(): void {
    this.loginService.login();
  }

  currentProjectId?: ObjectId;

  currentChatRoomId?: ObjectId;

  /** Returns a boolean value indicating whether or not hte current user is an admin user. */
  get isAdminUser(): boolean {
    return !!this.userService.user?.isAdmin;
  }

  /** Returns a boolean value indicating whether or not the navigation
   *   on the main menu should be visible. */
  get isNavigationVisible(): boolean {
    return this.userService.isUserLoggedIn;
  }

  /** Returns a boolean value indicating whether or not the login option
   *   on the menu should be shown. */
  get isMenuLoginVisible(): boolean {
    return !this.userService.isUserLoggedIn && this.pageSizeService.isSkinnyPage;
  }

  /** Returns a boolean value indicating whether or not
   *   the menu should be shown. */
  get isMenuVisible(): boolean {
    return this.isMenuLoginVisible || this.isNavigationVisible;
  }
}
