import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movement {
  id?: string;
  product_id: string;
  type: 'entry' | 'exit';
  quantity: number;
  note?: string;
  date?: string;
}

@Injectable({ providedIn: 'root' })
export class MovementService {
  private api = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Movement[]> {
    return this.http.get<Movement[]>(`${this.api}/movements`);
  }

  create(data: Movement): Observable<Movement> {
    return this.http.post<Movement>(`${this.api}/movements`, data);
  }
}
