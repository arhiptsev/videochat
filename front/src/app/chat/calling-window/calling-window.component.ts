import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-calling-window',
  templateUrl: './calling-window.component.html',
  styleUrls: ['./calling-window.component.scss']
})
export class CallingWindowComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public username: string,
    private dialog: MatDialogRef<boolean>
  ) { }

  ngOnInit(): void {
  }

  public cancel():void {
    this.dialog.close(true);
  }
}
