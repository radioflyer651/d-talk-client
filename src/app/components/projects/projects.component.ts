import { Component } from '@angular/core';
import { ProjectListComponent } from "./project-list/project-list.component";

@Component({
  selector: 'app-projects',
  imports: [ProjectListComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {

}
