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
import { ObjectId } from 'mongodb';
import { MessageService } from 'primeng/api';
import { map, Observable } from 'rxjs';
import { MenuService } from '../../services/menu.service';
import { PageSizeService } from '../../services/page-size.service';

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
