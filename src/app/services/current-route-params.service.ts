import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CurrentRouteParamsService {
  constructor(private readonly router: Router) {
  }

  /**
   * Emits the current route's params as an object, always up-to-date with navigation.
   */
  get params$(): Observable<{ [key: string]: string; }> {
    return this.router.events.pipe(
      startWith(undefined),
      map(() => {
        let route = this.router.routerState.snapshot.root;

        while (route.firstChild) {
          route = route.firstChild;
        }

        // paramMap is always available on a snapshot
        const params: { [key: string]: string; } = {};
        route.paramMap?.keys.forEach(key => {
          const val = route.paramMap?.get(key);
          if (val !== null) {
            params[key] = val;
          }
        });

        return params;
      }),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    );
  }
}
