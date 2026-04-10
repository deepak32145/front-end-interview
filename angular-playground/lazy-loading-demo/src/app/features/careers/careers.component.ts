import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CareersService, CareersDashboard, DepartmentResult } from './careers.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-careers',
  standalone: false,
  templateUrl: './careers.component.html',
  styleUrl: './careers.component.scss',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class CareersComponent implements OnInit {
  dashboard: CareersDashboard | null = null;
  loading = true;
  error: string | null = null;
  departments: { key: string; label: string; icon: string; data: DepartmentResult }[] = [];

  constructor(private careersService: CareersService , private cdr : ChangeDetectorRef) {}

  ngOnInit(): void {
    this.careersService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.departments = [
          { key: 'developer', label: 'Developer',       icon: '💻', data: data.developer },
          { key: 'admin',     label: 'Admin',            icon: '🛠',  data: data.admin },
          { key: 'hr',        label: 'Human Resources',  icon: '🤝', data: data.hr },
          { key: 'accounts',  label: 'Accounts',         icon: '📊', data: data.accounts },
        ];
        this.loading = false;
        console.log('loading flag' , this.loading)
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }
}
