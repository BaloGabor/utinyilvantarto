import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiUrl = 'http://localhost:3000/report';

  constructor(private http: HttpClient) {}

  getMonthlyReport(year: number, month: number, licensePlate: string) {
    return this.http.get<any>(this.apiUrl, {
      params: { year, month, licensePlate }
    });
  }
}
