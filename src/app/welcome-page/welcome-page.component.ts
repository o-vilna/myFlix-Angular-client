import { Component, OnInit } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

/**
 * Component for welcome page
 * @component WelcomePageComponent
 * Displays the landing page with user registration and login options
 */
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule]
})
export class WelcomePageComponent implements OnInit {
  constructor(public dialog: MatDialog) { }
  
  ngOnInit(): void {
  }

  /**
   * Opens the user registration dialog
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '400px',
      maxHeight: '90vh'
    });
  }

  /**
   * Opens the user login dialog
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '400px',
      maxHeight: '90vh'
    });
  }
}
