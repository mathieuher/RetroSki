import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LearningComponent } from './pages/learning/learning.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { RideLocalComponent } from './pages/ride-local/ride-local.component';
import { LocalEventComponent } from './pages/local-event/local-event.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'learning', component: LearningComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'ride-local', component: RideLocalComponent },
    { path: 'local-event', component: LocalEventComponent },
    { path: '**', pathMatch: 'full', redirectTo: '' }
];
