import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip, TripService } from '../../services/trip.service';
import { Driver, DriverService } from '../../services/driver.service';
import { FormsModule } from '@angular/forms';

interface NewTrip {
  carId: number | null;
  driverId: number | null;
  date: string;
  type: string;
  startLocation: string;
  endLocation: string;
  distance: number | undefined;
  newOdometer: number | undefined;
  returnTrip: boolean;
}

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TripsComponent implements OnInit {
  trips: Trip[] = [];
  drivers: Driver[] = [];
  showForm = false;
  editingTripId: number | null = null;

  newTrip: NewTrip = this.getEmptyTrip();

  constructor(
    private tripService: TripService,
    private driverService: DriverService
  ) {}

  ngOnInit(): void {
    this.loadTrips();
    this.loadDrivers();
  }

  loadTrips() {
    this.tripService.getAll().subscribe({
      next: (data) => this.trips = data,
      error: (err) => console.error('Hiba a trip adatok lekérésekor:', err),
    });
  }

  loadDrivers() {
    this.driverService.getDrivers().subscribe({
      next: (drivers) => {
        const today = new Date();
        this.drivers = drivers.filter(
          driver => new Date(driver.licenseExpiry) > today
        );
      },
      error: (err) => console.error('Hiba a vezetők lekérésekor:', err),
    });
  }

  getEmptyTrip(): NewTrip {
    return {
      carId: null,
      driverId: null,
      date: '',
      type: 'céges',
      startLocation: '',
      endLocation: '',
      distance: undefined,
      newOdometer: undefined,
      returnTrip: false
    };
  }

  addOrUpdateTrip() {
    if (this.editingTripId !== null) {
      // Ha szerkesztés van, akkor PUT kérés küldése
      this.tripService.updateTrip(this.editingTripId, this.newTrip).subscribe({
        next: () => {
          this.loadTrips();
          this.resetForm();
        },
        error: (err) => console.error('Hiba a frissítés során:', err),
      });
    } else {
      // Ha új trip, akkor POST kérés küldése
      this.tripService.createTrip(this.newTrip).subscribe({
        next: () => {
          this.loadTrips();
          this.resetForm();
        },
        error: (err) => console.error('Hiba a mentés során:', err),
      });
    }
  }

  deleteTrip(id: number) {
    if (confirm('Biztosan törölni szeretnéd ezt az utazást?')) {
      this.tripService.deleteTrip(id).subscribe({
        next: () => this.loadTrips(),
        error: err => console.error('Hiba a törlés során:', err)
      });
    }
  }

  startEdit(trip: Trip) {
    this.newTrip = {
      driverId: trip.driver?.id ?? null,
      carId: trip.car?.id ?? null,
      date: trip.date,
      type: trip.type,
      startLocation: trip.startLocation,
      endLocation: trip.endLocation,
      distance: trip.distance,
      newOdometer: trip.newOdometer,
      returnTrip: false
    };
    this.editingTripId = trip.id;
    this.showForm = true;
  }

  resetForm() {
    this.newTrip = this.getEmptyTrip();
    this.editingTripId = null;
    this.showForm = false;
  }
}
