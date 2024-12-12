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
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'ride-online',
        loadComponent: () => import('./pages/ride-online/ride-online.component').then(m => m.RideOnlineComponent)
    },
    {
        path: 'server/:id',
        loadComponent: () => import('./pages/server/server.component').then(m => m.ServerComponent)
    },
    {
        path: 'local-event',
        loadComponent: () => import('./pages/local-event/local-event.component').then(m => m.LocalEventComponent)
    },
    {
        path: 'manage-tracks',
        loadComponent: () => import('./pages/manage-tracks/manage-tracks.component').then(m => m.ManageTracksComponent)
    },
    { path: 'race', loadComponent: () => import('./pages/race/race.component').then(m => m.RaceComponent) },
    { path: '**', pathMatch: 'full', redirectTo: '' }
];
