import { Routes } from '@angular/router';
import { AppHomeComponent } from './components/app-home/app-home.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { authenticatedGuard } from './routing/authenticated.guard';
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';
import { ProjectsComponent } from './components/chat-core/projects/projects.component';
import { ProjectDetailComponent } from './components/chat-core/projects/project-detail/project-detail.component';
import { AgentConfigDetailComponent } from './components/chat-core/agent-configurations/agent-config-detail/agent-config-detail.component';
import { AgentConfigurationsComponent } from './components/chat-core/agent-configurations/agent-configurations.component';
import { DummyScreenComponent } from './components/dummy-screen/dummy-screen.component';
import { ChatJobsComponent } from './components/chat-core/chat-jobs/chat-jobs.component';
import { ChatJobDetailComponent } from './components/chat-core/chat-jobs/chat-job-detail/chat-job-detail.component';
import { ChatRoomsComponent } from './components/chat-core/chat-rooms/chat-rooms.component';
import { ChatRoomDetailComponent } from './components/chat-core/chat-rooms/chat-room-detail/chat-room-detail.component';

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
                        children: [
                            {
                                path: ':projectId',
                                component: ProjectDetailComponent,
                                children: [
                                    {
                                        path: 'agents',
                                        component: AgentConfigurationsComponent,
                                        children: [
                                            {
                                                path: ':agentConfigId',
                                                component: AgentConfigDetailComponent,
                                            },
                                        ]
                                    },
                                    {
                                        path: 'jobs',
                                        component: ChatJobsComponent,
                                        children: [
                                            {
                                                path: ':jobId',
                                                component: ChatJobDetailComponent,
                                            }
                                        ]
                                    },
                                    {
                                        path: 'chat-rooms',
                                        component: ChatRoomsComponent,
                                        children: [
                                            {
                                                path: ':chatRoomId',
                                                component: ChatRoomDetailComponent,
                                            }
                                        ]
                                    },
                                    {
                                        path: 'overview',
                                        component: ProjectsComponent,
                                    },
                                    // { path: ':tabId', pathMatch: 'full', component: ProjectDetailComponent },
                                    { path: '', pathMatch: 'full', redirectTo: 'overview' },
                                ]
                            }
                        ]
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
