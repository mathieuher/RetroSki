import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LearningComponent } from './pages/learning/learning.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'learning', component: LearningComponent },
    { path: '**', pathMatch: 'full', redirectTo: '' }
];
