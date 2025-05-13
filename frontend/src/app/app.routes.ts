import { Routes } from '@angular/router';
import { CarsComponent } from './pages/cars/cars.component';
import { DriversComponent } from './pages/drivers/drivers.component';
import { TripsComponent } from './pages/trips/trips.component';
import { ReportComponent } from './pages/reports/reports.component';

export const routes: Routes = [
  { path: '', redirectTo: 'cars', pathMatch: 'full' }, 
  { path: 'cars', component: CarsComponent },
  { path: 'drivers', component: DriversComponent },
  { path: 'trips', component: TripsComponent },
  { path: 'reports', component: ReportComponent },
];
