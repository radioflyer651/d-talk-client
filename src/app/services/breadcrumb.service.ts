import { Injectable } from '@angular/core';
import { combineLatest, distinctUntilChanged, map, Observable, startWith } from 'rxjs';
import { CurrentRouteParamsService } from './current-route-params.service';
import { ProjectsService } from './chat-core/projects.service';
import { ChatRoomsService } from './chat-core/chat-rooms.service';

export interface Breadcrumb {
  label: string;
  /** Angular router commands array. Omit for the current (non-navigable) crumb. */
  route?: string[];
}

/**
 * Provides a reactive breadcrumb trail based on the current route params and
 * the selected project / chat room from their respective services.
 *
 * Consumers:
 *   breadcrumbs$ = inject(BreadcrumbService).breadcrumbs$;
 */
@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  readonly breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(
    private readonly routeParams: CurrentRouteParamsService,
    private readonly projectsService: ProjectsService,
    private readonly chatRoomsService: ChatRoomsService,
  ) {
    this.breadcrumbs$ = combineLatest([
      this.routeParams.params$,
      this.projectsService.currentProject$.pipe(startWith(undefined)),
      this.chatRoomsService.selectedChatRoom$.pipe(startWith(undefined)),
    ]).pipe(
      map(([, project, chatRoom]) => {
        const crumbs: Breadcrumb[] = [
          { label: 'Projects', route: ['/projects'] },
        ];

        if (project) {
          crumbs.push({
            label: project.name,
            route: ['/projects', String(project._id)],
          });
        }

        if (chatRoom) {
          crumbs.push({ label: chatRoom.name });
        }

        return crumbs;
      }),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    );
  }
}
