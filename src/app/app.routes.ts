import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LearningComponent } from './pages/learning/learning.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'learning', component: LearningComponent },
    { path: 'settings', component: SettingsComponent },
    { path: '**', pathMatch: 'full', redirectTo: '' }
];
