import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackbar: MatSnackBar) { }

  public success(text: string): void {
    this.snackbar.open(text, '', {
      duration: 6000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }


}
