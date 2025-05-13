import { Component, OnInit } from '@angular/core';
import { Car, CarService } from '../../services/car.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class CarsComponent implements OnInit {
  cars: Car[] = [];
  newCar: Car = {
    licensePlate: '',
    type: '',
    fuel: '',
    consumption: 0,
    initialOdometer: 0
  }; // Új autó adatok tárolása

  showAddCarForm = false;

  constructor(private carService: CarService) { }
  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.carService.getCars().subscribe({
      next: (data) => this.cars = data,
      error: (err) => console.error('Hiba történt az autók betöltésekor', err)
    });
  }

  addCar(): void {
    if (!this.newCar.licensePlate || !this.newCar.type || !this.newCar.fuel || this.newCar.consumption <= 0 || this.newCar.initialOdometer < 0) {
      console.error('Kérem, töltse ki az összes mezőt helyesen!');
      return;
    }
  
    this.carService.addCar(this.newCar).subscribe({
      next: () => {
        this.loadCars();
        this.newCar = {
          licensePlate: '',
          type: '',
          fuel: '',
          consumption: 0,
          initialOdometer: 0
        };
        this.showAddCarForm = false;
      },
      error: (err: any) => console.error('Hiba történt az autó létrehozásakor', err)
    });
  }

  deleteCar(id: number): void {
    if (confirm('Biztosan törlöd ezt az autót?')) {
      this.carService.deleteCar(id).subscribe({
        next: () => this.loadCars(),
        error: (err) => console.error('Hiba történt az autó törlésekor', err)
      });
    }
  }
}
