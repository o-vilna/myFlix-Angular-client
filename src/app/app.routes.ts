import { Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

/**
 * Application routing configuration
 * Defines the mapping between URLs and components
 */
export const routes: Routes = [
  /** Welcome page route */
  { path: 'welcome', component: WelcomePageComponent },
  /** Movies page route */
  { path: 'movies', component: MovieCardComponent },
  /** User profile page route */
  { path: 'profile', component: UserProfileComponent },
  /** Default route redirect */
  { path: '', redirectTo: 'welcome', pathMatch: 'prefix' },
];
