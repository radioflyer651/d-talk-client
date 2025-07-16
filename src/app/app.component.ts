import { Component, ContentChild, TemplateRef } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from "./components/site-header/site-header.component";
import { DrawerModule } from 'primeng/drawer';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComponentBase } from './components/component-base/component-base.component';
import { LoginComponent } from "./components/login/login.component";
import { UserService } from './services/user.service';
import { CommonModule } from '@angular/common';
import { PageSizeService } from './services/page-size.service';
import { MenuService } from './services/menu.service';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DockModule } from 'primeng/dock';
import { DialogModule } from 'primeng/dialog';
import { LoginService } from './services/login.service';
import { LoadingComponent } from "./components/loading/loading.component";

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    DrawerModule,
    TextareaModule,
    FormsModule,
    ToastModule,
    LoginComponent,
    ButtonModule,
    RouterModule,
    ConfirmDialogModule,
    DockModule,
    DialogModule,
    LoadingComponent
],
  providers: [
    MessageService,
    ConfirmationService,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent extends ComponentBase {
  constructor(
    readonly messageService: MessageService,
    readonly userService: UserService,
    readonly pageSizeService: PageSizeService,
    readonly menuService: MenuService,
    readonly loginService: LoginService,
  ) {
    super();

  }

  @ContentChild('#rightGutterContent')
  rightGutterTemplate?: TemplateRef<any>;

  ngOnInit() {
    
  }

  closeMenu(): void {
    this.menuService.showMenu = false;
  }

  logout(): void {
    this.userService.logout();
  }

  /** Toggles whether or not the chat window is open. */
  toggleChatSlideout() {
    
  }

  login(): void {
    this.loginService.login();
  }
}
