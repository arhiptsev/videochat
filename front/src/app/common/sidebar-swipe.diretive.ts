import { Directive } from '@angular/core';
import { combineLatest, fromEvent } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { repeat, take } from 'rxjs/operators';

@UntilDestroy()
@Directive({
  selector: '[appSidebarSwipe]'
})
export class SidebarSwipeDirective {
  constructor(
    private sidebar: MatSidenav
  ) { }

  ngAfterViewInit() {
    combineLatest([this.startOnTouch(), this.endOnTouch()])
      .pipe(
        take(1),
        repeat(),
        untilDestroyed(this)
      )
      .subscribe(([start, end]) => {
        const difference = end.changedTouches[0].clientX - start.touches[0].clientX;
        if (Math.abs(difference) < 70) { return; }
        (difference > 0) && this.sidebar.open();
        (difference < 0) && this.sidebar.close();
      })
  }

  startOnTouch() {
    return fromEvent<TouchEvent>(document, "touchstart").pipe(untilDestroyed(this));
  }

  endOnTouch() {
    return fromEvent<TouchEvent>(document, "touchend").pipe(untilDestroyed(this));
  }
}