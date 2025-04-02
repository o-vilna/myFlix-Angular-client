import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

/**
 * Component for displaying movie details in a dialog
 * @component MovieDetailsDialogComponent
 */
@Component({
  selector: 'app-movie-details-dialog',
  templateUrl: './movie-details-dialog.component.html',
  styleUrls: ['./movie-details-dialog.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatDialogModule]
})
export class MovieDetailsDialogComponent {
  /**
   * Creates an instance of MovieDetailsDialogComponent
   * @param dialogRef Reference to the dialog containing this component
   * @param data Data containing movie title and description
   */
  constructor(
    public dialogRef: MatDialogRef<MovieDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; description: string }
  ) {}

  /**
   * Closes the dialog
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
} 