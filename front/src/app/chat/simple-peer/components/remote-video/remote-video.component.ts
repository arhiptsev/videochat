import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-remote-video',
  templateUrl: './remote-video.component.html',
  styleUrls: ['./remote-video.component.scss']
})
export class RemoteVideoComponent implements OnInit {

  constructor() { }

  @Input() public remoteStream;
  public showVideo = true;

  public remoteVolume = 0.7;
  public get remoteVolumeFloat() { return this.remoteVolume / 100; }


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
