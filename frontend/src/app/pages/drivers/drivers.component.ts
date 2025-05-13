import { Component } from '@angular/core';
import { DriverService, Driver } from '../../services/driver.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class DriversComponent {
  drivers: Driver[] = [];
  showAddDriverForm = false;
  newDriver: Partial<Driver> = {};

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  isLicenseExpired(expirationDate: string | undefined): boolean {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  }

  loadDrivers(): void {
    this.driverService.getDrivers().subscribe({
      next: (data) => this.drivers = data,
      error: (err) => console.error('Hiba történt a sofőrök betöltésekor', err)
    });
  }

  addDriver(): void {
    if (this.newDriver.name && this.newDriver.licenseNumber && this.newDriver.licenseExpiry) {
      this.driverService.addDriver(this.newDriver as Driver).subscribe({
        next: () => {
          this.loadDrivers();
          this.newDriver = {};
          this.showAddDriverForm = false;
        },
        error: (err) => console.error('Hiba történt a sofőr létrehozásakor', err)
      });
    }
  }

  deleteDriver(id: number | undefined): void {
    if (id === undefined) {
      console.error('Nincs megadva az ID!');
      return; // Ha az ID undefined, akkor nem hajtjuk végre a törlést
    }
  
    if (confirm('Biztosan törölni szeretnéd ezt a sofőrt?')) {
      this.driverService.deleteDriver(id).subscribe({
        next: () => this.loadDrivers(),
        error: (err) => console.error('Hiba történt a sofőr törlésekor', err)
      });
    }
  }
}

