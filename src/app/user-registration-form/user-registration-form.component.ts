import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Component for user registration functionality
 * @component UserRegistrationFormComponent
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ]
})
export class UserRegistrationFormComponent implements OnInit {
  /**
   * Object containing user registration data
   */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  /**
   * Creates an instance of UserRegistrationFormComponent
   * @param fetchApiData Service for making API calls
   * @param dialogRef Reference to the dialog containing this component
   * @param snackBar Service for showing notifications
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized
   */
  ngOnInit(): void {
  }

  /**
   * Handles user registration process
   * Makes API call to register new user and shows success/error message
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe({
      next: (result) => {
        this.dialogRef.close();
        this.snackBar.open('User registration successful', 'OK', {
          duration: 2000
        });
      },
      error: (error) => {
        let errorMessage = 'Registration failed';
        if (typeof error === 'string') {
          errorMessage = error;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        this.snackBar.open(errorMessage, 'OK', {
          duration: 2000
        });
      }
    });
  }
}
