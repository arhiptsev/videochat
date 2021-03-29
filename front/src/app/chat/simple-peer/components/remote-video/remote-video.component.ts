import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MediaService } from 'src/app/common/media.service';

@Component({
  selector: 'app-remote-video',
  templateUrl: './remote-video.component.html',
  styleUrls: ['./remote-video.component.scss']
})
export class RemoteVideoComponent implements OnInit {

  constructor(
    private mediaService: MediaService
  ) { }

  @Input() public remoteStream;
  @Input() public localStream;
  public showVideo = true;

  public remoteVolume = 0.7;
  public get remoteVolumeFloat(): number { return this.remoteVolume / 100; }
  public get isMobile(): boolean { return this.mediaService.isMobile(); }


  @Output() public cancelCall = new EventEmitter<void>();

  ngOnInit(): void {
  }

  public toogleVideo(): void {
    this.showVideo = !this.showVideo;
  }

  public onCancelCall(): void {
    this.cancelCall.emit();
  }

}
