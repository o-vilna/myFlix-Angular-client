import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

/**
 * Component for displaying movie synopsis in a dialog
 * @component SynopsisDialogComponent
 */
@Component({
  selector: 'app-synopsis-dialog',
  templateUrl: './synopsis-dialog.component.html',
  styleUrls: ['./synopsis-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class SynopsisDialogComponent {
  /**
   * Creates an instance of SynopsisDialogComponent
   * @param dialogRef Reference to the dialog containing this component
   * @param data Data containing movie title and description
   */
  constructor(
    public dialogRef: MatDialogRef<SynopsisDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; description: string }
  ) {}

  /**
   * Closes the dialog
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
} 