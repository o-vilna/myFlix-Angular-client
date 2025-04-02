import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

/**
 * Component for displaying director information in a dialog
 * @component DirectorDialogComponent
 */
@Component({
  selector: 'app-director-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.director.Name }}</h2>
    <mat-dialog-content>
      <p style="word-wrap: break-word;"><strong>Bio:</strong> {{ data.director.Bio }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="center">
      <button mat-button (click)="closeDialog()">Close</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule]
})
export class DirectorDialogComponent {
  /**
   * Creates an instance of DirectorDialogComponent
   * @param dialogRef Reference to the dialog containing this component
   * @param data Data containing director information
   */
  constructor(
    public dialogRef: MatDialogRef<DirectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { director: any }
  ) {}

  /**
   * Closes the dialog
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
} 