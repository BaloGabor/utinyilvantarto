import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
})
export class ReportComponent implements OnInit {
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;
  selectedLicensePlate: string = '';
  report: any = null;

  cars: any[] = []; // autók listája

  constructor(private reportService: ReportService, private http: HttpClient) {}

  ngOnInit() {
    this.loadCars();
  }

  loadCars() {
    this.http.get<any[]>('http://localhost:3000/cars').subscribe({
      next: (data) => this.cars = data,
      error: (err) => console.error('Nem sikerült lekérni az autókat:', err)
    });
  }

  getReport() {
    if (!this.selectedLicensePlate) return;

    this.reportService.getMonthlyReport(this.selectedYear, this.selectedMonth, this.selectedLicensePlate)
      .subscribe({
        next: (data) => this.report = data,
        error: (err) => {
          console.error('Hiba a jelentés lekérésekor:', err);
          this.report = null;
        }
      });
  }
}
