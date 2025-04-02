import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

/**
 * Component for displaying genre information in a dialog
 * @component GenreDialogComponent
 */
@Component({
  selector: 'app-genre-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.genre.Name }}</h2>
    <mat-dialog-content>
      <p style="word-wrap: break-word;">{{ data.genre.Description }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="center">
      <button mat-button (click)="closeDialog()">Close</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule]
})
export class GenreDialogComponent {
  /**
   * Creates an instance of GenreDialogComponent
   * @param data Data passed to dialog containing genre information
   */
  constructor(
    public dialogRef: MatDialogRef<GenreDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      genre: { Name: string; Description: string }
    }
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
} 