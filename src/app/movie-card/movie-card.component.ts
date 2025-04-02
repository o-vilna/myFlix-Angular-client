import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';
import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';
import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SynopsisDialogComponent } from '../synopsis-dialog/synopsis-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule]
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovies: string[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log('All movies:', this.movies);
      return this.movies;
    });
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
      this.favoriteMovies = resp.FavoriteMovies || [];
      console.log('Favorite movies:', this.favoriteMovies);
      return this.favoriteMovies;
    });
  }

  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }

  toggleFavorite(movieId: string): void {
    console.log('Toggling favorite for movie:', movieId);
    console.log('Current favorites:', this.favoriteMovies);
    
    if (this.isFavorite(movieId)) {
      console.log('Removing from favorites');
      this.fetchApiData.deleteFavoriteMovie(movieId).subscribe({
        next: (response) => {
          console.log('Remove response:', response);
          this.snackBar.open('Movie removed from favorites', 'OK', {
            duration: 2000
          });
          this.getFavoriteMovies();
        },
        error: (error) => {
          console.error('Error removing from favorites:', error);
          this.snackBar.open('Error removing from favorites', 'OK', {
            duration: 2000
          });
        }
      });
    } else {
      console.log('Adding to favorites');
      this.fetchApiData.addFavoriteMovie(movieId).subscribe({
        next: (response) => {
          console.log('Add response:', response);
          this.snackBar.open('Movie added to favorites', 'OK', {
            duration: 2000
          });
          this.getFavoriteMovies();
        },
        error: (error) => {
          console.error('Error adding to favorites:', error);
          this.snackBar.open('Error adding to favorites', 'OK', {
            duration: 2000
          });
        }
      });
    }
  }

  openGenreDialog(movie: any): void {
    this.dialog.open(GenreDialogComponent, {
      width: '400px',
      data: { genre: movie.Genre }
    });
  }

  openDirectorDialog(movie: any): void {
    this.dialog.open(DirectorDialogComponent, {
      width: '400px',
      data: { director: movie.Director }
    });
  }

  openDescriptionDialog(movie: any): void {
    this.dialog.open(SynopsisDialogComponent, {
      width: '400px',
      data: {
        title: movie.Title,
        description: movie.Description
      }
    });
  }
}
