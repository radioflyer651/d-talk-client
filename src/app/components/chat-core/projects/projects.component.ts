import { Component } from '@angular/core';
import { ProjectListComponent } from "./project-list/project-list.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectDetailComponent } from "./project-detail/project-detail.component";
import { ProjectsService } from '../../../services/projects.service';
import { ComponentBase } from '../../component-base/component-base.component';

@Component({
  selector: 'app-projects',
  imports: [
    CommonModule,
    FormsModule,
    ProjectListComponent,
    ProjectDetailComponent,
],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent extends ComponentBase {
  constructor(
    readonly projectsService: ProjectsService,
  ) {
    super();
  }


}
