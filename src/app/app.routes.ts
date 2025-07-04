import { Routes } from '@angular/router';
import { AppHomeComponent } from './components/app-home/app-home.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { authenticatedGuard } from './routing/authenticated.guard';
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';
import { ProjectsComponent } from './components/chat-core/projects/projects.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'prefix',
        children: [
            {
                path: '',
                component: AppHomeComponent,
                canActivate: [authenticatedGuard],
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
            {
                path: 'register',
                component: RegistrationPageComponent
            },
        ]
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/projects'
    },
    {
        path: '**',
        redirectTo: ''
    },
];
