import type { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
    {
        path: 'learning',
        loadComponent: () => import('./pages/learning/learning.component').then(m => m.LearningComponent)
    },
    {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
    },
    {
        path: 'ride-local',
        loadComponent: () => import('./pages/ride-local/ride-local.component').then(m => m.RideLocalComponent)
    },
    {
        path: 'local-event',
        loadComponent: () => import('./pages/local-event/local-event.component').then(m => m.LocalEventComponent)
    },
    {
        path: 'create-track',
        loadComponent: () => import('./pages/create-track/create-track.component').then(m => m.CreateTrackComponent)
    },
    { path: 'race', loadComponent: () => import('./pages/race/race.component').then(m => m.RaceComponent) },
    { path: '**', pathMatch: 'full', redirectTo: '' }
];
