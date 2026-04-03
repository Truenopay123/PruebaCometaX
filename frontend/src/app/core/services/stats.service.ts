import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Stats {
  by_category: { category: string; total: number }[];
  inventory_value: { category: string; value: number }[];
  by_month: { month: number; entries: number; exits: number }[];
  low_stock_alerts: any[];
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  private api = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<Stats> {
    return this.http.get<Stats>(`${this.api}/stats/summary`);
  }
}
