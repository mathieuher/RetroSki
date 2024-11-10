import type { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LearningComponent } from './pages/learning/learning.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { RideLocalComponent } from './pages/ride-local/ride-local.component';
import { LocalEventComponent } from './pages/local-event/local-event.component';
import { RaceComponent } from './pages/race/race.component';
import { CreateTrackComponent } from './pages/create-track/create-track.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'learning', component: LearningComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'ride-local', component: RideLocalComponent },
    { path: 'local-event', component: LocalEventComponent },
    { path: 'create-track', component: CreateTrackComponent },
    { path: 'race', component: RaceComponent },
    { path: '**', pathMatch: 'full', redirectTo: '' }
];
