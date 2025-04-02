import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatIconModule
  ]
})
export class UserLoginFormComponent implements OnInit {
  loginData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  loginUser(): void {
    console.log('Login attempt with:', this.loginData);
    this.fetchApiData.userLogin(this.loginData).subscribe({
      next: (result) => {
        console.log('Login response:', result);
        if (result.user && result.token) {
          console.log('Setting localStorage items:');
          console.log('user:', result.user.Username);
          console.log('token:', result.token);
          console.log('userData:', result.user);
          
          localStorage.setItem('user', result.user.Username);
          localStorage.setItem('token', result.token);
          localStorage.setItem('userData', JSON.stringify(result.user));
          
          // Перевіряємо, чи дані збереглися
          console.log('Checking localStorage after setting:');
          console.log('user:', localStorage.getItem('user'));
          console.log('token:', localStorage.getItem('token'));
          console.log('userData:', localStorage.getItem('userData'));
          
          this.dialogRef.close();
          this.snackBar.open('Login successful', 'OK', {
            duration: 2000
          });
          this.router.navigate(['movies']);
        } else {
          console.error('Invalid response structure:', result);
          this.snackBar.open('Invalid response from server', 'OK', {
            duration: 2000
          });
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.snackBar.open('Login failed', 'OK', {
          duration: 2000
        });
      }
    });
  }
}
