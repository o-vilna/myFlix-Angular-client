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

/**
 * Component for displaying movie cards
 * @component MovieCardComponent
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule]
})
export class MovieCardComponent implements OnInit {
  /**
   * Array of movies
   */
  movies: any[] = [];

  /**
   * Array of favorite movie IDs
   */
  favoriteMovies: string[] = [];

  /**
   * Creates an instance of MovieCardComponent
   * @param fetchApiData Service for API calls
   * @param dialog Service for showing dialogs
   * @param snackBar Service for showing notifications
   */
  constructor(
    private fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized
   */
  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }

  /**
   * Fetches all movies
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log('All movies:', this.movies);
      return this.movies;
    });
  }

  /**
   * Fetches favorite movies
   */
  getFavoriteMovies(): void {
    this.fetchApiData.getFavoriteMovies().subscribe((resp: any) => {
      this.favoriteMovies = resp.FavoriteMovies || [];
      console.log('Favorite movies:', this.favoriteMovies);
      return this.favoriteMovies;
    });
  }

  /**
   * Checks if a movie is favorite
   * @param movieId ID of the movie to check
   * @returns True if the movie is favorite, false otherwise
   */
  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }

  /**
   * Toggles favorite status of a movie
   * @param movieId ID of the movie to toggle
   */
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

  /**
   * Opens dialog with genre information
   * @param movie Movie object containing genre information
   */
  openGenreDialog(movie: any): void {
    this.dialog.open(GenreDialogComponent, {
      width: '400px',
      data: { genre: movie.Genre }
    });
  }

  /**
   * Opens dialog with director information
   * @param movie Movie object containing director information
   */
  openDirectorDialog(movie: any): void {
    this.dialog.open(DirectorDialogComponent, {
      width: '400px',
      data: { director: movie.Director }
    });
  }

  /**
   * Opens dialog with movie synopsis
   * @param movie Movie object containing synopsis information
   */
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
