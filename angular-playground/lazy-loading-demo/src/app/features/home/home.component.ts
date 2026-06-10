import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

interface UsernameResult {
  query: string;
  available: boolean;
  message: string;
}

// Step-1 response: basic user info
interface UserSearchResult {
  id: number;
  name: string;
  role: string;
}

// Step-2 response: full profile (includes step-1 fields + extra)
interface UserProfile extends UserSearchResult {
  email: string;
  joined: string;
  skills: string[];
  bio: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('usernameInput', { static: true }) inputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('userSearchInput', { static: true }) userSearchRef!: ElementRef<HTMLInputElement>;

  // --- username checker state ---
  status: 'idle' | 'checking' | 'available' | 'taken' = 'idle';
  result: UsernameResult | null = null;

  // --- chained API demo state ---
  profileStatus: 'idle' | 'searching' | 'found' | 'not-found' | 'error' = 'idle';
  // Holds the step-1 result so the template can show it before step-2 arrives
  foundUser: UserSearchResult | null = null;
  profile: UserProfile | null = null;

  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // ── Username checker ────────────────────────────────────────────────────
    fromEvent<Event>(this.inputRef.nativeElement, 'input').pipe(
      map((event) => (event.target as HTMLInputElement).value.trim()),
      debounceTime(500),
      distinctUntilChanged(),
      filter((query) => query.length > 0),
      tap(() => {
        this.status = 'checking';
        this.result = null;
      }),
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

    // ── Chained API: search user → fetch profile ────────────────────────────
    //
    // Step 1: GET /api/user/search?name=<query>   → returns { id, name, role }
    // Step 2: GET /api/user/:id/profile           → returns full profile
    //
    // The inner switchMap passes step-1's id directly into step-2.
    // If the user types again before both calls finish, the outer switchMap
    // cancels the entire in-flight chain (both HTTP requests).
    fromEvent<Event>(this.userSearchRef.nativeElement, 'input').pipe(
      map((event) => (event.target as HTMLInputElement).value.trim()),
      debounceTime(400),
      distinctUntilChanged(),
      filter((name) => name.length > 1),
      tap(() => {
        this.profileStatus = 'searching';
        this.foundUser = null;
        this.profile = null;
      }),
      // Outer switchMap: fires step-1, cancels previous chain on new keystroke
      switchMap((name) =>
        this.http.get<UserSearchResult>(
          `http://localhost:3000/api/user/search?name=${encodeURIComponent(name)}`
        ).pipe(
          // Inner switchMap: uses step-1 result to fire step-2
          switchMap((user) => {
            this.foundUser = user; // show step-1 result immediately
            return this.http.get<UserProfile>(
              `http://localhost:3000/api/user/${user.id}/profile`
            );
          })
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.profileStatus = 'found';
      },
      error: (err) => {
        this.profileStatus = err.status === 404 ? 'not-found' : 'error';
        this.foundUser = null;
      },
    });
  }

  onClear(): void {
    this.inputRef.nativeElement.value = '';
    this.status = 'idle';
    this.result = null;
  }

  onClearUserSearch(): void {
    this.userSearchRef.nativeElement.value = '';
    this.profileStatus = 'idle';
    this.foundUser = null;
    this.profile = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
