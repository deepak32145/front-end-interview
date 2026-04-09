import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map } from 'rxjs';

export interface Job {
  id: number;
  title: string;
  team: string;
  location: string;
  openings: number;
}

export interface DepartmentResult {
  category: string;
  count: number;
  jobs: Job[];
}

export interface CareersDashboard {
  developer: DepartmentResult;
  admin: DepartmentResult;
  hr: DepartmentResult;
  accounts: DepartmentResult;
  totalOpenings: number;
}

@Injectable({ providedIn: 'root' })
export class CareersService {
  private readonly base = 'http://localhost:3000/api/careers';

  constructor(private http: HttpClient) {}

  /**
   * Fires all 4 department API calls in parallel using forkJoin.
   * forkJoin waits for every observable to complete, then emits a single
   * combined result — perfect for a dashboard that needs all data at once.
   */
  getDashboard() {
    return forkJoin({
      developer: this.http.get<DepartmentResult>(`${this.base}/developer`),
      admin:     this.http.get<DepartmentResult>(`${this.base}/admin`),
      hr:        this.http.get<DepartmentResult>(`${this.base}/hr`),
      accounts:  this.http.get<DepartmentResult>(`${this.base}/accounts`),
    }).pipe(
      map((result) => ({
        ...result,
        totalOpenings:
          result.developer.count +
          result.admin.count +
          result.hr.count +
          result.accounts.count,
      }))
    );
  }
}
