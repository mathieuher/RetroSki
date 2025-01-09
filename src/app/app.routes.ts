import { inject } from '@angular/core';
import { Router, type Routes } from '@angular/router';
import { AuthService } from './common/services/auth.service';

export const AuthGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const auth = authService.isAuth();
    if (!auth) {
        router.navigate(['/login']);
    }
    return auth;
};

export const VerifiedGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getUser();
    if (!user?.verified) {
        router.navigate(['/verification']);
    }
    return true;
};

export const AvailableGuard = () => {
    const authService = inject(AuthService);
    return authService.isAvailable$();
};

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
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [AuthGuard, AvailableGuard]
    },
    {
        path: 'ride-online',
        loadComponent: () => import('./pages/ride-online/ride-online.component').then(m => m.RideOnlineComponent),
        canActivate: [AuthGuard, VerifiedGuard, AvailableGuard]
    },
    {
        path: 'server/:id',
        loadComponent: () => import('./pages/server/server.component').then(m => m.ServerComponent),
        canActivate: [AuthGuard, VerifiedGuard, AvailableGuard]
    },
    {
        path: 'local-event',
        loadComponent: () => import('./pages/local-event/local-event.component').then(m => m.LocalEventComponent)
    },
    {
        path: 'online-event/:id',
        loadComponent: () => import('./pages/online-event/online-event.component').then(m => m.OnlineEventComponent),
        canActivate: [AuthGuard, VerifiedGuard, AvailableGuard]
    },
    {
        path: 'create-online-event/:serverId',
        loadComponent: () =>
            import('./pages/create-online-event/create-online-event.component').then(m => m.CreateOnlineEventComponent),
        canActivate: [AuthGuard, VerifiedGuard, AvailableGuard]
    },
    {
        path: 'manage-tracks',
        loadComponent: () => import('./pages/manage-tracks/manage-tracks.component').then(m => m.ManageTracksComponent),
        data: { type: 'local' }
    },
    {
        path: 'manage-online-tracks',
        loadComponent: () => import('./pages/manage-tracks/manage-tracks.component').then(m => m.ManageTracksComponent),
        data: { type: 'online' },
        canActivate: [AuthGuard, VerifiedGuard, AvailableGuard]
    },
    {
        path: 'race',
        loadComponent: () => import('./pages/race/race.component').then(m => m.RaceComponent),
        data: { type: 'local' }
    },
    {
        path: 'online-race/:eventId',
        loadComponent: () => import('./pages/race/race.component').then(m => m.RaceComponent),
        data: { type: 'online' },
        canActivate: [AuthGuard, VerifiedGuard, AvailableGuard]
    },
    {
        path: 'reset-password',
        loadComponent: () =>
            import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
        canActivate: [AvailableGuard]
    },
    {
        path: 'reset-password/:token',
        loadComponent: () =>
            import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
        canActivate: [AvailableGuard]
    },
    {
        path: 'verification',
        loadComponent: () => import('./pages/verification/verification.component').then(m => m.VerificationComponent),
        canActivate: [AvailableGuard]
    },
    {
        path: 'verification/:token',
        loadComponent: () => import('./pages/verification/verification.component').then(m => m.VerificationComponent),
        canActivate: [AvailableGuard]
    },
    {
        path: 'upgrade',
        loadComponent: () => import('./pages/upgrade/upgrade.component').then(m => m.UpgradeComponent),
        canActivate: [AuthGuard, AvailableGuard]
    },
    { path: '**', pathMatch: 'full', redirectTo: '' }
];
