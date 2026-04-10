import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

interface UsernameResult {
  query: string;
  available: boolean;
  message: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('usernameInput', { static: true }) inputRef!: ElementRef<HTMLInputElement>;

  status: 'idle' | 'checking' | 'available' | 'taken' = 'idle';
  result: UsernameResult | null = null;

  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    fromEvent<Event>(this.inputRef.nativeElement, 'input').pipe(
      // extract the typed value
      map((event) => (event.target as HTMLInputElement).value.trim()),
      // wait until user stops typing for 500ms
      debounceTime(500),
      // skip if same value as last emission
      distinctUntilChanged(),
      // skip empty strings
      filter((query) => query.length > 0),
      // show checking state immediately when a new query is about to fire
      tap(() => {
        this.status = 'checking';
        this.result = null;
      }),
      // switchMap cancels the previous HTTP request when a new query arrives
      switchMap((query) =>
        this.http.get<UsernameResult>(`http://localhost:3000/api/username/check?query=${query}`)
      ),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.result = data;
        this.status = data.available ? 'available' : 'taken';
      },
      error: (err) => {
        console.error('Username check failed:', err);
        this.status = 'idle';
      },
    });
  }

  onClear(): void {
    this.inputRef.nativeElement.value = '';
    this.status = 'idle';
    this.result = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
