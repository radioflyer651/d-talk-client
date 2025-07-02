import { Routes } from '@angular/router';
import { AppHomeComponent } from './components/app-home/app-home.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { LoginPageComponent } from './components/login-page/login-page.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'prefix',
        children: [
            {
                path: '',
                component: AppHomeComponent,
                children: [
                    {
                        path: 'projects',
                        component: ProjectsComponent,
                    }
                ]
            },
            {
                path: 'login',
                component: LoginPageComponent
            },
        ]
    },
    {
        path: '**',
        redirectTo: ''
    },
];
