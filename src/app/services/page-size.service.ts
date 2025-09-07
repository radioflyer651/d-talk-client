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

    this.pageResized$.subscribe(size => {
      this._pageSize = size;
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
  private _pageSize: { width: number; height: number; } = { width: window.innerWidth, height: window.innerHeight };

  /** Current page size (width and height). */
  get pageSize(): { width: number; height: number; } {
    return this._pageSize;
  }

  /** Returns a boolean value indicating whether or not drawers should be full screen, based on page size. */
  get isFullWidthDrawers() {
    return this.pageSize.width <= 500;
  }

  /** Returns a style for a drawer using standardized methodologies for sizing. */
  get standardDrawerStyle() {
    if (this.isFullWidthDrawers) {
      return {};
    }
    return { width: '80vw' };
  }

  /** Returns a boolean value indicating whether or not standard dialogs should be full screen, based on the screen size. */
  get isFullScreenDialogs() {
    return this.pageSize.width <= 500 || this.pageSize.height <= 800;
  }

  /** Returns a style for dialogs using standardized methodologies for sizing. */
  get standardDialogStyle() {
    if (this.isFullWidthDrawers) {
      return { width: '100vw', height: '100vh' };
    }
    return { width: '80vw', height: '75vh' };
  }

  /** Observable that emits when the page is resized. */
  pageResized$!: Observable<{ width: number; height: number; }>;
}
