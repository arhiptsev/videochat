import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor() { }

  public isMobile(): boolean { return window.matchMedia("(max-width: 800px)").matches; }
}
