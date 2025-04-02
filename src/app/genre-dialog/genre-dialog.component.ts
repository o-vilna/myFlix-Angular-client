import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

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
  constructor(
    public dialogRef: MatDialogRef<GenreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { genre: any }
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
} 