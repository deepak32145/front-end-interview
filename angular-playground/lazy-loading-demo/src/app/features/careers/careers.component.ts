import { Component, OnInit } from '@angular/core';
import { CareersService, CareersDashboard, DepartmentResult } from './careers.service';

@Component({
  selector: 'app-careers',
  standalone: false,
  template: `
    <section class="page">
      <h2>Careers Dashboard</h2>
      <p>Join our team — we have openings across all departments.</p>

      <!-- Loading state -->
      <div *ngIf="loading" class="loading">
        <span class="spinner"></span> Fetching open positions...
      </div>

      <!-- Error state -->
      <div *ngIf="error" class="error">
        Could not load positions. Make sure the API server is running on port 3000.
        <br><small>{{ error }}</small>
      </div>

      <!-- Dashboard -->
      <ng-container *ngIf="dashboard && !loading">
        <div class="summary-bar">
          <span class="total">{{ dashboard.totalOpenings }} open positions</span>
          <span class="sub">across 4 departments</span>
        </div>

        <div class="departments">
          <div class="dept-card" *ngFor="let dept of departments">
            <div class="dept-header" [ngClass]="dept.key">
              <span class="dept-icon">{{ dept.icon }}</span>
              <span class="dept-name">{{ dept.label }}</span>
              <span class="dept-count">{{ dept.data.count }} roles</span>
            </div>
            <div class="job-list">
              <div class="job-row" *ngFor="let job of dept.data.jobs">
                <div class="job-info">
                  <strong>{{ job.title }}</strong>
                  <span class="team-tag">{{ job.team }}</span>
                </div>
                <div class="job-meta">
                  <span class="location">📍 {{ job.location }}</span>
                  <span class="openings">{{ job.openings }} opening{{ job.openings > 1 ? 's' : '' }}</span>
                  <button class="apply-btn">Apply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </section>
  `,
  styles: [`
    .page { max-width: 860px; margin: 40px auto; padding: 0 16px; }
    h2 { font-size: 1.8rem; color: #3f51b5; margin-bottom: 6px; }
    p  { color: #666; margin-bottom: 24px; }

    /* Loading */
    .loading { display: flex; align-items: center; gap: 10px; color: #666; font-size: 1rem; }
    .spinner { width: 18px; height: 18px; border: 3px solid #e0e0e0;
               border-top-color: #3f51b5; border-radius: 50%;
               animation: spin 0.7s linear infinite; display: inline-block; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Error */
    .error { background: #ffebee; border: 1px solid #ef9a9a; border-radius: 6px;
             padding: 14px 18px; color: #c62828; line-height: 1.6; }
    .error small { color: #999; font-size: 0.8rem; }

    /* Summary bar */
    .summary-bar { background: #3f51b5; color: white; border-radius: 8px;
                   padding: 14px 20px; display: flex; align-items: baseline;
                   gap: 10px; margin-bottom: 24px; }
    .total { font-size: 1.4rem; font-weight: 700; }
    .sub   { font-size: 0.95rem; opacity: 0.8; }

    /* Department cards */
    .departments { display: flex; flex-direction: column; gap: 20px; }

    .dept-card { border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; }

    .dept-header { display: flex; align-items: center; gap: 10px;
                   padding: 12px 18px; font-weight: 600; }
    .dept-header.developer { background: #e8eaf6; color: #283593; }
    .dept-header.admin     { background: #fce4ec; color: #880e4f; }
    .dept-header.hr        { background: #e8f5e9; color: #1b5e20; }
    .dept-header.accounts  { background: #fff8e1; color: #e65100; }

    .dept-icon  { font-size: 1.2rem; }
    .dept-name  { flex: 1; font-size: 1rem; }
    .dept-count { font-size: 0.85rem; opacity: 0.8; }

    /* Job rows */
    .job-list { padding: 0 18px 8px; }
    .job-row  { display: flex; align-items: center; justify-content: space-between;
                flex-wrap: wrap; gap: 8px; padding: 12px 0;
                border-bottom: 1px solid #f5f5f5; }
    .job-row:last-child { border-bottom: none; }

    .job-info { display: flex; flex-direction: column; gap: 4px; }
    .job-info strong { font-size: 0.95rem; color: #222; }
    .team-tag { font-size: 0.8rem; color: #888; }

    .job-meta  { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .location  { font-size: 0.85rem; color: #666; }
    .openings  { background: #f0f4ff; color: #3f51b5; font-size: 0.8rem;
                 padding: 3px 8px; border-radius: 12px; font-weight: 500; }

    .apply-btn { padding: 6px 14px; background: #3f51b5; color: white;
                 border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem; }
    .apply-btn:hover { background: #303f9f; }
  `]
})
export class CareersComponent implements OnInit {
  dashboard: CareersDashboard | null = null;
  loading = true;
  error: string | null = null;

  departments: { key: string; label: string; icon: string; data: DepartmentResult }[] = [];

  constructor(private careersService: CareersService) {}

  ngOnInit(): void {
    this.careersService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.departments = [
          { key: 'developer', label: 'Developer',  icon: '💻', data: data.developer },
          { key: 'admin',     label: 'Admin',       icon: '🛠️', data: data.admin },
          { key: 'hr',        label: 'Human Resources', icon: '🤝', data: data.hr },
          { key: 'accounts',  label: 'Accounts',    icon: '📊', data: data.accounts },
        ];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }
}
