import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { LoginComponent } from '../login/login.component';
import { ComponentBase } from '../component-base/component-base.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuService } from '../../services/menu.service';
import { PageSizeService } from '../../services/page-size.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SiteHeaderComponent } from "../site-header/site-header.component";

@Component({
  selector: 'app-app-home',
  imports: [
    CommonModule,
    RouterOutlet,
    DrawerModule,
    TextareaModule,
    FormsModule,
    ToastModule,
    LoginComponent,
    ButtonModule,
    ConfirmDialogModule,
    SiteHeaderComponent
],
  providers: [
    ConfirmationService,
  ],
  templateUrl: './app-home.component.html',
  styleUrl: './app-home.component.scss'
})
export class AppHomeComponent extends ComponentBase {
  constructor(
    readonly messageService: MessageService,
    readonly pageSizeService: PageSizeService,
    readonly menuService: MenuService,
  ) {
    super();

  }

  ngOnInit() {

  }

}
