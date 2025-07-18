import { Routes } from '@angular/router';
import { AppHomeComponent } from './components/app-home/app-home.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { authenticatedGuard } from './routing/authenticated.guard';
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';
import { ProjectsComponent } from './components/chat-core/projects/projects.component';
import { ProjectDetailComponent } from './components/chat-core/projects/project-detail/project-detail.component';
import { AgentConfigDetailComponent } from './components/chat-core/agent-configurations/agent-config-detail/agent-config-detail.component';
import { AgentConfigurationsComponent } from './components/chat-core/agent-configurations/agent-configurations.component';
import { ChatJobsComponent } from './components/chat-core/chat-jobs/chat-jobs.component';
import { ChatJobDetailComponent } from './components/chat-core/chat-jobs/chat-job-detail/chat-job-detail.component';
import { ChatRoomsComponent } from './components/chat-core/chat-rooms/chat-rooms.component';
import { ChatRoomDetailComponent } from './components/chat-core/chat-rooms/chat-room-detail/chat-room-detail.component';
import { ChattingComponent } from './components/chat-core/chatting/chatting/chatting.component';
import { ProjectListComponent } from './components/chat-core/projects/project-list/project-list.component';
import { ProjectKnowledgeComponent } from './components/chat-core/projects/project-knowledge/project-knowledge.component';
import { ChatDocumentsComponent } from './components/chat-core/chat-documents/chat-documents.component';
import { DocumentPopoutComponent } from './components/chat-core/chat-documents/document-popout/document-popout.component';
import { OllamaConfigEditorComponent } from './components/chat-core/agent-configurations/agent-config-editors/ollama-config-editor/ollama-config-editor.component';
import { OllamaConfigurationsComponent } from './components/chat-core/admin/ollama-configurations/ollama-configurations.component';

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
                                path: '',
                                pathMatch: 'full',
                                component: ProjectListComponent,
                            },
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
                                        path: 'project-knowledge',
                                        component: ProjectKnowledgeComponent
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
                                        path: 'chat-documents',
                                        component: ChatDocumentsComponent,
                                        children: [
                                            {
                                                path: ':documentId',
                                                component: ChatDocumentsComponent,
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
                    },
                    {
                        path: 'document/:documentId',
                        component: DocumentPopoutComponent
                    },
                    {
                        path: 'admin',
                        children: [
                            {
                                path: 'ollama-configurations',
                                component: OllamaConfigurationsComponent
                            }
                        ]
                    },
                    {
                        path: 'chatting',
                        children: [
                            {
                                path: 'project/:projectId/chat-room/:chatRoomId',
                                component: ChattingComponent
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
