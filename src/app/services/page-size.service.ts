import { Injectable } from '@angular/core';
import { Observable, fromEvent, map, shareReplay, startWith, takeUntil, Subscription } from 'rxjs';
import { ComponentBase } from '../components/component-base/component-base.component';

@Injectable({
  providedIn: 'root'
})
export class PageSizeService {
  constructor() {
    this.initialize();
  }

  private initialize(): void {
    // Hook up to page-size changes so we can be responsive.
    this.pageResized$ = fromEvent(window, 'resize').pipe(
      map(() => ({
        width: window.innerWidth,
        height: window.innerHeight
      })),
      startWith({
        width: window.innerWidth,
        height: window.innerHeight
      }),
      shareReplay(1)
    );


    // Create an observable for skinny page and track its value
    this._isSkinnyPage$ = this.pageResized$
      .pipe(
        map(newSize => newSize.width < 1024),
      );

    this._isSkinnyPage$
      .subscribe(val => {
        this._isSkinnyPageValue = val;
      });
  }

  // #region isSkinnyPage
  private _isSkinnyPage$!: Observable<boolean>;
  private _isSkinnyPageValue: boolean = false;

  /** Observable to emit whether or not we're too small to show the gutters
   *   of the page. */
  get isSkinnyPage$() {
    return this._isSkinnyPage$;
  }

  get isSkinnyPage(): boolean {
    return this._isSkinnyPageValue;
  }

  /** Observable that emits when the page is resized. */
  pageResized$!: Observable<{ width: number; height: number; }>;
}
