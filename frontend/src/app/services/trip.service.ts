import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Trip {
  id: number;
  car: any;
  driver: any;
  date: string;
  type: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  newOdometer: number;
}

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private apiUrl = 'http://localhost:3000/trips'; // vagy a megfelelő URL

  constructor(private http: HttpClient) {}

  getAll(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.apiUrl);
    
  }
  createTrip(trip: any): Observable<any> {
    return this.http.post(this.apiUrl, trip);
  }
  deleteTrip(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  updateTrip(id: number, trip: Partial<Trip>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, trip);
  }
}
