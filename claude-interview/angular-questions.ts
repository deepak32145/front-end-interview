/**
 * ANGULAR INTERVIEW QUESTIONS
 * Front-end Interview Series
 */

// ============================================
// QUESTION 1: Components and Lifecycle Hooks
// ============================================
/*
QUESTION:
Explain Angular component lifecycle hooks.
Create a component that demonstrates OnInit, OnChanges, and OnDestroy.

REQUIREMENTS:
- Input property that changes
- Detect changes with OnChanges
- Initialize data in OnInit
- Clean up resources in OnDestroy
*/

// SOLUTION:
/*
import { 
  Component, 
  Input, 
  OnInit, 
  OnChanges, 
  OnDestroy, 
  SimpleChanges 
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-card',
  template: `
    <div class="card">
      <h2>{{ user.name }}</h2>
      <p>Email: {{ user.email }}</p>
      <p>Change count: {{ changeCount }}</p>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #ccc;
      padding: 20px;
      margin: 10px 0;
    }
  `]
})
export class UserCardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() user: { name: string; email: string };
  
  changeCount = 0;
  private destroy$ = new Subject<void>();
  private dataSubscription: any;

  // 1. Constructor - dependency injection, not initialization
  constructor(private dataService: DataService) {
    console.log('Constructor called');
  }

  // 2. OnInit - initialize component once
  ngOnInit(): void {
    console.log('OnInit called');
    
    // Subscribe to data
    this.dataService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        console.log('Data loaded:', data);
      });
  }

  // 3. OnChanges - respond to input changes
  ngOnChanges(changes: SimpleChanges): void {
    console.log('OnChanges called:', changes);
    
    if (changes['user']) {
      const currentValue = changes['user'].currentValue;
      const previousValue = changes['user'].previousValue;
      console.log('User changed from', previousValue, 'to', currentValue);
      this.changeCount++;
    }
  }

  // 4. OnDestroy - clean up
  ngOnDestroy(): void {
    console.log('OnDestroy called');
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}

// LIFECYCLE CALL ORDER:
// 1. constructor()
// 2. ngOnChanges() - if inputs exist
// 3. ngOnInit()
// 4. ngDoCheck()
// 5. ngAfterContentInit()
// 6. ngAfterContentChecked()
// 7. ngAfterViewInit()
// 8. ngAfterViewChecked()
// ... (repeats for changes)
// ngOnDestroy()
*/

/*
OTHER LIFECYCLE HOOKS:
- DoCheck: Custom change detection
- AfterContentInit: After content projection
- AfterViewInit: After view initialization
- AfterViewChecked: After view checking

EVALUATION CRITERIA:
✓ Correct hook implementation
✓ Proper OnChanges usage with SimpleChanges
✓ Resource cleanup in OnDestroy
✓ Uses takeUntil for subscription management
✓ Understands lifecycle order
✓ Proper component decoration
*/


// ============================================
// QUESTION 2: Two-Way Data Binding and Forms
// ============================================
/*
QUESTION:
Create a reactive form with validation.
Include form controls, form groups, and custom validators.
Show two-way binding with banana-in-a-box syntax.
*/

// SOLUTION:
/*
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';

// Custom validator
function emailDomainValidator(control: AbstractControl): ValidationErrors | null {
  const email = control.value;
  if (!email) return null;
  
  const allowedDomains = ['gmail.com', 'company.com'];
  const domain = email.split('@')[1];
  
  return allowedDomains.includes(domain) ? null : { invalidDomain: true };
}

@Component({
  selector: 'app-user-form',
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <!-- Two-way binding example -->
      <div>
        <label>Search: </label>
        <input [(ngModel)]="searchTerm" />
        <p>You searched for: {{ searchTerm }}</p>
      </div>

      <!-- Form Group -->
      <fieldset formGroupName="address">
        <legend>Address</legend>
        
        <div class="form-group">
          <label for="street">Street</label>
          <input
            id="street"
            type="text"
            formControlName="street"
            class="form-control"
          />
          <div *ngIf="address.get('street')?.hasError('required')">
            Street is required
          </div>
        </div>

        <div class="form-group">
          <label for="city">City</label>
          <input
            id="city"
            type="text"
            formControlName="city"
          />
        </div>
      </fieldset>

      <!-- Form Controls -->
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          formControlName="email"
          class="form-control"
        />
        <div *ngIf="email.hasError('required')">
          Email is required
        </div>
        <div *ngIf="email.hasError('email')">
          Invalid email format
        </div>
        <div *ngIf="email.hasError('invalidDomain')">
          Email must be from allowed domains
        </div>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          formControlName="password"
        />
      </div>

      <!-- Form Status -->
      <div>
        <button [disabled]="!userForm.valid">Submit</button>
        <p>Form Status: {{ userForm.status }}</p>
        <p>Form Valid: {{ userForm.valid }}</p>
      </div>

      <!-- Display Form Value -->
      <div *ngIf="userForm.valid">
        <h3>Form Values:</h3>
        <pre>{{ userForm.value | json }}</pre>
      </div>
    </form>
  `
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  searchTerm = '';

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email,
        emailDomainValidator
      ]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required]
      })
    });
  }

  ngOnInit(): void {
    // Subscribe to form changes
    this.userForm.valueChanges.subscribe(values => {
      console.log('Form values changed:', values);
    });
  }

  get email() {
    return this.userForm.get('email')!;
  }

  get address() {
    return this.userForm.get('address')!;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('Form submitted:', this.userForm.value);
    }
  }
}

// TWO-WAY BINDING: [(ngModel)]="property"
// - Combines property binding ([]) and event binding (())
// - Updates component property when input changes
// - Updates input when component property changes
*/

/*
EVALUATION CRITERIA:
✓ Correct FormBuilder usage
✓ FormGroup and FormControl setup
✓ Built-in validators (required, email, minLength)
✓ Custom validators implemented
✓ Proper form submission handling
✓ Error message display
✓ Two-way binding understanding
✓ Form status and validity tracking
*/


// ============================================
// QUESTION 3: RxJS and Observables
// ============================================
/*
QUESTION:
Create a service that manages user data using RxJS.
Implement operators: map, filter, switchMap, debounceTime.
*/

// SOLUTION:
/*
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, filter, switchMap, debounceTime, distinctUntilChanged, shareReplay } from 'rxjs/operators';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';
  
  // BehaviorSubject: has initial value, emits current value to new subscribers
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Subject: no initial value
  private searchSubject = new Subject<string>();
  public searchResults$: Observable<User[]>;
  
  // ReplaySubject: multicasts to multiple subscribers
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {
    // Setup search with debounce and switchMap
    this.searchResults$ = this.searchSubject.pipe(
      debounceTime(300),              // Wait 300ms after typing stops
      distinctUntilChanged(),          // Don't search if same term
      filter(term => term.length > 2), // Minimum 3 characters
      switchMap(term => this.searchUsers(term)), // Cancel previous request
      shareReplay(1)                   // Cache last result
    );
  }

  // Get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => users.sort((a, b) => a.name.localeCompare(b.name))),
      shareReplay(1)
    );
  }

  // Get single user
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Search users with debounce
  search(term: string): void {
    this.searchSubject.next(term);
  }

  private searchUsers(term: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search?q=${term}`);
  }

  // Set current user
  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  // Get current user value synchronously
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Create user
  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // Update user
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Delete user
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

// COMMON OPERATORS:
// - map: Transform emitted values
// - filter: Filter values by condition
// - switchMap: Cancel previous observable, switch to new one
// - mergeMap: All observables run in parallel
// - concatMap: Sequential execution
// - debounceTime: Wait before emitting
// - distinctUntilChanged: Don't emit duplicate values
// - shareReplay: Share single subscription among multiple subscribers
// - takeUntil: Complete observable on signal
*/

/*
EVALUATION CRITERIA:
✓ Correct Observable patterns
✓ BehaviorSubject vs Subject understanding
✓ Proper operator usage (switchMap, debounceTime, etc)
✓ Subscription management
✓ shareReplay for performance
✓ Error handling with catchError
✓ Type-safe responses
*/


// ============================================
// QUESTION 4: Angular Services and Dependency Injection
// ============================================
/*
QUESTION:
Explain Dependency Injection in Angular.
Create a service hierarchy: Logger, AuthService, UserService.
Show different injection scopes.
*/

// SOLUTION:
/*
// 1. Logger Service (Singleton by default)
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Provided at root level - singleton
})
export class LoggerService {
  constructor(private http: HttpClient) {}
  
  log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    console.log(logMessage);
    
    // Send to server
    // this.http.post('/api/logs', { message, level, timestamp }).subscribe();
  }
}

// 2. AuthService - depends on LoggerService
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  
  constructor(private logger: LoggerService) {
    this.logger.log('AuthService initialized');
  }
  
  login(email: string, password: string): Observable<any> {
    this.logger.log(`Login attempt for ${email}`);
    // Authentication logic
    return of({ success: true });
  }
  
  logout(): void {
    this.logger.log('User logged out');
    this.isAuthenticated = false;
  }
  
  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}

// 3. UserService - depends on both
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private logger: LoggerService,
    private auth: AuthService
  ) {
    this.logger.log('UserService initialized');
  }
  
  loadUser(): Observable<any> {
    if (!this.auth.isLoggedIn()) {
      this.logger.log('User not authenticated', 'warn');
      return of(null);
    }
    
    this.logger.log('Loading user data');
    return of({ id: 1, name: 'John' });
  }
}

// DEPENDENCY INJECTION SCOPES:

// 1. Root level (Singleton)
@Injectable({
  providedIn: 'root'
})
export class SingletonService {}

// 2. Module level
@Injectable({
  providedIn: FeatureModule
})
export class ModuleService {}

// 3. Component level (New instance per component)
@Component({
  selector: 'app-my-component',
  providers: [ComponentService] // New instance per component
})
export class MyComponent {
  constructor(private service: ComponentService) {}
}

// 4. Traditional provider syntax
@NgModule({
  providers: [
    UserService,
    { provide: LoggerService, useClass: ConsoleLoggerService },
    { provide: 'API_URL', useValue: 'https://api.example.com' },
    { provide: DataService, useFactory: dataServiceFactory, deps: [HttpClient] }
  ]
})
export class AppModule {}

// Factory function
function dataServiceFactory(http: HttpClient): DataService {
  return new DataService(http);
}
*/

/*
EVALUATION CRITERIA:
✓ Understands DI container concept
✓ Proper service creation with @Injectable
✓ Different provider scopes (root, module, component)
✓ Dependency chain and injection
✓ Factory functions for complex instantiation
✓ UseClass, UseValue, UseFactory providers
✓ Singleton pattern understanding
*/


// ============================================
// QUESTION 5: Directives - Structural and Attribute
// ============================================
/*
QUESTION:
Explain Angular directives. Implement structural directives (*ngIf, *ngFor)
and create a custom attribute directive.
*/

// SOLUTION:
/*
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

// 1. STRUCTURAL DIRECTIVES - Change DOM structure

// *ngIf - Conditionally render
<div *ngIf="isVisible">Visible</div>

// *ngFor - Loop through items
<li *ngFor="let item of items; let i = index; let even = even">
  {{ i }}: {{ item }} {{ even ? '(even)' : '' }}
</li>

// *ngSwitch - Switch statement
<div [ngSwitch]="value">
  <div *ngSwitchCase="'case1'">Case 1</div>
  <div *ngSwitchCase="'case2'">Case 2</div>
  <div *ngSwitchDefault>Default</div>
</div>

// 2. ATTRIBUTE DIRECTIVES - Change behavior of elements

// [ngClass] - Dynamic classes
<div [ngClass]="{ 'active': isActive, 'disabled': isDisabled }">
  Content
</div>

// [ngStyle] - Dynamic styles
<div [ngStyle]="{ 'background-color': bgColor, 'font-size.px': fontSize }">
  Content
</div>

// 3. CUSTOM DIRECTIVE - Highlight on hover

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() appHighlight = 'yellow';
  @Input() highlightColor = 'rgba(255, 255, 0, 0.5)';

  constructor(private el: ElementRef) {
    // Can also use Renderer2 for better performance
  }

  @HostListener('mouseenter') onMouseEnter(): void {
    this.el.nativeElement.style.backgroundColor = this.highlightColor;
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.el.nativeElement.style.backgroundColor = '';
  }
}

// Usage:
<p appHighlight highlightColor="eeee">
  Hover to highlight
</p>

// 4. CUSTOM STRUCTURAL DIRECTIVE

@Directive({
  selector: '[appIf]'
})
export class IfDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appIf(condition: boolean) {
    if (condition) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}

// Usage:
<div *appIf="isVisible">
  Custom if directive
</div>
*/

/*
BUILT-IN ATTRIBUTES:
- ngClass: Conditionally add classes
- ngStyle: Set styles dynamically
- ngModel: Two-way binding
- ngShow/ngHide: Show/hide without removing from DOM

EVALUATION CRITERIA:
✓ Explains structural vs attribute directives
✓ Knows *ngIf, *ngFor, *ngSwitch, *ngSwitchCase
✓ Uses ngClass and ngStyle correctly
✓ Creates custom directive with @Directive decorator
✓ Uses @HostListener for events
✓ Understands TemplateRef and ViewContainerRef
✓ Proper directive selector syntax
*/


// ============================================
// QUESTION 6: Routing and Navigation
// ============================================
/*
QUESTION:
Set up Angular routing with lazy loading.
Implement route guards (CanActivate, CanDeactivate).
*/

// SOLUTION:
/*
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate, CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';

// Route Guard - Authentication
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.auth.isLoggedIn()) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}

// Route Guard - Unsaved changes
@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}

// Component interface
export interface ComponentCanDeactivate {
  canDeactivate: () => boolean;
}

// Routes with lazy loading
const routes: Routes = [
  // Lazy loaded feature module
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },
  
  // Component route
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard]
  },
  
  // Child routes
  {
    path: 'users/:id',
    component: UserDetailComponent,
    canDeactivate: [UnsavedChangesGuard]
  },
  
  // Wildcard - must be last
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// Feature module with child routes
const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'users', component: AdminUsersComponent },
      { path: 'settings', component: AdminSettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ADMIN_ROUTES)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

// Navigation in component
@Component({})
export class NavigationExample {
  constructor(private router: Router, private route: ActivatedRoute) {}
  
  navigate(): void {
    // Navigate by URL
    this.router.navigate(['/users', 123]);
    
    // Query parameters
    this.router.navigate(['/users'], { queryParams: { page: 2, sort: 'name' } });
  }
  
  getRouteParams(): void {
    // Get route parameters
    this.route.params.subscribe(params => {
      const id = params['id'];
    });
    
    // Get query parameters
    this.route.queryParams.subscribe(params => {
      const page = params['page'];
    });
  }
}
*/

/*
EVALUATION CRITERIA:
✓ Correct routing configuration
✓ Lazy loading with loadChildren
✓ CanActivate guard implementation
✓ CanDeactivate guard implementation
✓ Route parameters and query parameters
✓ Child routes setup
✓ Wildcard route handling
✓ Navigation with queryParams
*/


// ============================================
// QUESTION 7: HTTP Interceptors
// ============================================
/*
QUESTION:
Create HTTP interceptors for:
1. Adding auth token to headers
2. Error handling
3. Request/response logging
*/

// SOLUTION:
/*
import { Injectable } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpEvent,
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

// 1. Auth Token Interceptor
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}
  
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(req);
  }
}

// 2. Error Handling Interceptor
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized - redirect to login
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          // Forbidden
          console.error('Access denied');
        } else if (error.status === 500) {
          // Server error
          console.error('Server error:', error.message);
        }
        
        return throwError(() => error);
      })
    );
  }
}

// 3. Logging Interceptor
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(private logger: LoggerService) {}
  
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const startTime = performance.now();
    this.logger.log(`HTTP Request: ${req.method} ${req.url}`);
    
    return next.handle(req).pipe(
      finalize(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        this.logger.log(`HTTP Response: ${req.method} ${req.url} (${duration.toFixed(2)}ms)`);
      })
    );
  }
}

// Register interceptors in module
@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class AppModule {}
*/

/*
EVALUATION CRITERIA:
✓ Implements HttpInterceptor correctly
✓ Adds auth token to requests
✓ Handles different error status codes
✓ Uses req.clone() for modification
✓ Proper error handling with catchError
✓ Logging with finalize operator
✓ Multiple interceptors registration
*/


// ============================================
// QUESTION 8: Angular Performance Optimization
// ============================================
/*
QUESTION:
Explain change detection strategies and how to optimize performance.
Implement OnPush strategy and TrackBy in *ngFor.
*/

// SOLUTION:
/*
// 1. OnPush Change Detection Strategy
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-user-list',
  template: `
    <div *ngFor="let user of users; trackBy: trackByUserId">
      {{ user.name }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush // Only check on input changes
})
export class UserListComponent {
  @Input() users: User[] = [];
  
  // TrackBy function for *ngFor
  trackByUserId(index: number, user: User): string {
    return user.id;
  }
}

// DEFAULT CHANGE DETECTION:
// Angular checks entire component tree on:
// - User events (click, input, etc.)
// - HTTP responses
// - setTimeout/setInterval
// - Promise resolution

// OnPush CHANGE DETECTION:
// Only checks component when:
// - @Input properties change (by reference)
// - Events are triggered in the component
// - Observable marked async updates

// 2. Using Observables with async pipe
@Component({
  template: `
    <div>{{ user$ | async | json }}</div>
    <p *ngIf="(isLoading$ | async)">Loading...</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailComponent {
  user$ = this.userService.getUser(123);
  isLoading$ = this.userService.isLoading$;
  
  constructor(private userService: UserService) {}
}

// 3. Manual Change Detection
import { ChangeDetectorRef } from '@angular/core';

@Component({})
export class OptimizedComponent {
  constructor(private cdr: ChangeDetectorRef) {}
  
  method(): void {
    // Do work
    this.cdr.markForCheck(); // Mark for check in next cycle
    this.cdr.detectChanges(); // Check immediately
  }
}

// 4. TrackBy Best Practices
trackByFn(index: number, item: any): any {
  return item.id; // Return unique identifier
}

// Bad - creates new object each time
<div *ngFor="let item of items">{{ item }}</div>

// Good - uses trackBy
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item }}
</div>

// 5. Performance Monitoring
import { NgZone } from '@angular/core';

@Component({})
export class PerformanceComponent {
  constructor(private ngZone: NgZone) {}
  
  heavyOperation(): void {
    // Run outside Angular zone to prevent change detection
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        // Heavy computation
      }, 1000);
    });
    
    // Run back inside Angular zone
    this.ngZone.run(() => {
      // Update UI
    });
  }
}
*/

/*
EVALUATION CRITERIA:
✓ Understands change detection strategy
✓ Implements OnPush correctly
✓ Uses trackBy in *ngFor
✓ Async pipe usage
✓ Manual change detection when needed
✓ NgZone for performance
✓ Real-world optimization knowledge
*/


// ============================================
// QUESTION 9: Angular Testing
// ============================================
/*
QUESTION:
Write unit tests for a component and service using Angular Testing Utilities.
*/

// SOLUTION:
/*
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService],
      imports: [HttpClientTestingModule]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });
  
  it('should fetch users', () => {
    const mockUsers = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Jane' }
    ];
    
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(mockUsers);
    });
    
    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
  
  it('should handle error', () => {
    service.getUsers().subscribe(
      () => fail('should have failed'),
      (error) => {
        expect(error.status).toBe(404);
      }
    );
    
    const req = httpMock.expectOne('/api/users');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userService: jasmine.SpyObj<UserService>;
  
  beforeEach(async () => {
    const spyService = jasmine.createSpyObj('UserService', ['getUsers']);
    
    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      providers: [{ provide: UserService, useValue: spyService }]
    }).compileComponents();
    
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
  });
  
  it('should load users on init', () => {
    const mockUsers = [{ id: '1', name: 'John' }];
    userService.getUsers.and.returnValue(of(mockUsers));
    
    fixture.detectChanges(); // Trigger ngOnInit
    
    expect(component.users).toEqual(mockUsers);
    expect(userService.getUsers).toHaveBeenCalled();
  });
  
  it('should display users in template', () => {
    const mockUsers = [{ id: '1', name: 'John' }];
    userService.getUsers.and.returnValue(of(mockUsers));
    
    component.users = mockUsers;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('div').textContent).toContain('John');
  });
});
*/

/*
EVALUATION CRITERIA:
✓ TestBed configuration
✓ Service testing with HttpTestingController
✓ Mocking and spying
✓ Component testing with fixtures
✓ Detecting changes (fixture.detectChanges())
✓ Template testing (nativeElement, debugElement)
✓ Error handling in tests
*/


// ============================================
// QUESTION 10: Angular Modules and Organization
// ============================================
/*
QUESTION:
Organize an Angular application into feature modules.
Explain lazy loading and shared modules.
*/

// SOLUTION:
/*
// 1. Shared Module - Used across features
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CommonPipeComponent, CommonDirectiveComponent],
  imports: [CommonModule],
  exports: [CommonModule, FormsModule, CommonPipeComponent, CommonDirectiveComponent]
})
export class SharedModule { }

// 2. Feature Module - Admin
const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'users', component: AdminUsersComponent },
      { path: 'settings', component: AdminSettingsComponent }
    ]
  }
];

@NgModule({
  declarations: [AdminComponent, AdminUsersComponent, AdminSettingsComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(ADMIN_ROUTES)]
})
export class AdminModule { }

// 3. Feature Module - User
const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserStoreComponent,
    children: [
      { path: 'profile', component: UserProfileComponent },
      { path: 'settings', component: UserSettingsComponent }
    ]
  }
];

@NgModule({
  declarations: [UserStoreComponent, UserProfileComponent, UserSettingsComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(USER_ROUTES)]
})
export class UserModule { }

// 4. App Module - Root module with lazy loading
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  }
];

@NgModule({
  declarations: [AppComponent, DashboardComponent],
  imports: [
    BrowserModule,
    SharedModule,
    RouterModule.forRoot(routes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// MODULE ORGANIZATION BEST PRACTICES:
// 1. Feature modules for different features
// 2. Shared module for reusable components/pipes/directives
// 3. Lazy load feature modules to reduce initial bundle
// 4. Core module for singleton services
// 5. Separate routing modules for each feature
*/

/*
EVALUATION CRITERIA:
✓ Feature module organization
✓ Shared module for reusable declarations
✓ Lazy loading with loadChildren
✓ Clear module imports/exports
✓ Routing module separation
✓ Understands module structure
✓ Dependency management
*/


// ============================================
// QUESTION 11: Advanced Change Detection
// ============================================
/*
QUESTION:
Explain change detection strategies in depth.
When and how to use ChangeDetectorRef and NgZone.
*/

/*
// Manual change detection control
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedCDComponent {
  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}
  
  // Method 1: markForCheck - mark for next cycle
  markForCheck(): void {
    // Only works with OnPush strategy
    this.cdr.markForCheck();
  }
  
  // Method 2: detectChanges - check immediately
  detectChanges(): void {
    this.cdr.detectChanges();
  }
  
  // Method 3: NgZone to run outside Angular
  heavyComputation(): void {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        // Heavy work that shouldn't trigger CD
      }, 1000);
    });
  }
  
  // Method 4: Run back inside Angular
  updateUI(): void {
    this.ngZone.run(() => {
      // This will trigger change detection
      this.data = newData;
    });
  }
}

// CHANGE DETECTION STRATEGIES:
// 1. Default: Checks on every event/async operation
// 2. OnPush: Only checks on input changes
// 3. Manual: With markForCheck/detectChanges

// BEST PRACTICES:
// - Use OnPush for performance optimization
// - Use NgZone.runOutsideAngular for heavy tasks
// - Use markForCheck sparingly
*/

/*
EVALUATION CRITERIA:
✓ Default vs OnPush strategies
✓ markForCheck usage
✓ detectChanges immediate check
✓ NgZone.runOutsideAngular
✓ Performance optimization knowledge
✓ Real-world scenarios
*/


// ============================================
// QUESTION 12: RxJS with Angular - Advanced Patterns
// ============================================
/*
QUESTION:
Create complex RxJS patterns in Angular:
- Subject for state management
- Higher-order operators (switchMap, mergeMap, concatMap)
- Error handling with retry and catchError
*/

/*
// State management with BehaviorSubject
@Injectable({
  providedIn: 'root'
})
export class StateService {
  private state$ = new BehaviorSubject<AppState>({});
  
  // Selector pattern
  userData$ = this.state$.pipe(
    map(state => state.user),
    distinctUntilChanged()
  );
  
  // Update state
  updateUser(user: User): void {
    this.state$.next({
      ...this.state$.value,
      user
    });
  }
}

// Higher-order operators
@Component({})
export class SearchComponent {
  searchTerm$ = new Subject<string>();
  results$: Observable<SearchResult[]>;
  
  constructor(private api: ApiService) {
    this.results$ = this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.api.search(term)), // Cancel previous
      catchError(err => {
        console.error('Search error:', err);
        return of([]);
      })
    );
  }
}

// Retry logic
loadData(): Observable<Data> {
  return this.http.get<Data>('/api/data').pipe(
    retry({
      count: 3,
      delay: (err, retryCount) => {
        return timer(1000 * retryCount); // Exponential backoff
      }
    }),
    catchError(err => {
      // After retries fail
      return throwError(() => err);
    })
  );
}
*/

/*
EVALUATION CRITERIA:
✓ BehaviorSubject for state
✓ Selector pattern
✓ switchMap vs mergeMap vs concatMap
✓ Retry with exponential backoff
✓ Error handling
✓ Memory leak prevention
*/


// ============================================
// QUESTION 13: Reactive Forms - Advanced Patterns
// ============================================
/*
QUESTION:
Create complex reactive forms with:
- Dynamic form controls
- Cross-field validation
- Custom validators with async validation
*/

/*
@Component({})
export class DynamicFormComponent implements OnInit {
  form: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }
  
  // Cross-field validation
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }
  
  // Async validator
  emailUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.api.checkEmail(control.value).pipe(
        map(exists => exists ? { emailTaken: true } : null),
        catchError(() => of(null))
      );
    };
  }
  
  // Add control dynamically
  addAddress(): void {
    const control = this.fb.group({
      street: [''],
      city: ['']
    });
    (this.form.get('addresses') as FormArray).push(control);
  }
}
*/

/*
EVALUATION CRITERIA:
✓ FormGroup and FormControl setup
✓ Cross-field validators
✓ Async validators
✓ Dynamic form controls
✓ FormArray usage
✓ Error message display
*/


// ============================================
// QUESTION 14: HTTP Interceptors - Advanced
// ============================================
/*
QUESTION:
Create sophisticated HTTP interceptors:
- Request queuing on 401 (token refresh)
- Request/response transformation
- Caching
*/

/*
@Injectable()
export class TokenRefreshInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: Subject<string> = new Subject();
  
  constructor(private auth: AuthService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          
          return this.auth.refreshToken().pipe(
            switchMap(token => {
              this.isRefreshing = false;
              this.refreshTokenSubject.next(token);
              
              const newReq = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
              });
              return next.handle(newReq);
            }),
            catchError(() => {
              this.isRefreshing = false;
              this.auth.logout();
              return throwError(() => error);
            })
          );
        }
        
        if (this.isRefreshing) {
          return this.refreshTokenSubject.pipe(
            switchMap(token => {
              const newReq = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
              });
              return next.handle(newReq);
            })
          );
        }
        
        return throwError(() => error);
      })
    );
  }
}

// Caching interceptor
@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  private cache = new Map<string, { data: any; time: number }>();
  private cacheDuration = 5 * 60 * 1000; // 5 minutes
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      return next.handle(req);
    }
    
    const cached = this.cache.get(req.url);
    if (cached && Date.now() - cached.time < this.cacheDuration) {
      return of(new HttpResponse({ body: cached.data }));
    }
    
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(req.url, { data: event.body, time: Date.now() });
        }
      })
    );
  }
}
*/

/*
EVALUATION CRITERIA:
✓ Token refresh on 401
✓ Request queuing during refresh
✓ Response transformation
✓ Caching strategy
✓ Error handling
✓ Multi-interceptor chaining
*/


// ============================================
// QUESTION 15: Route Guards and Resolvers
// ============================================
/*
QUESTION:
Implement advanced route guards:
- CanActivate, CanDeactivate, CanLoad
- Resolve data before navigation
- Role-based access control
*/

/*
// Data resolver
@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User> {
  constructor(private userService: UserService, private router: Router) {}
  
  resolve(route: ActivatedRouteSnapshot): Observable<User> | Promise<User> | User {
    return this.userService.getUser(route.params['id']).pipe(
      catchError(() => {
        this.router.navigate(['/404']);
        return of(null as unknown as User);
      })
    );
  }
}

// Role-based guard
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    const userRoles = this.auth.getUserRoles();
    
    if (userRoles.some(role => requiredRoles.includes(role))) {
      return true;
    }
    
    this.router.navigate(['/unauthorized']);
    return false;
  }
}

// Lazy load guard
@Injectable({
  providedIn: 'root'
})
export class CanLoadAdminModule implements CanLoad {
  constructor(private auth: AuthService) {}
  
  canLoad(): boolean {
    return this.auth.isAdmin();
  }
}

// Routes with guards and resolvers
const routes: Routes = [
  {
    path: 'users/:id',
    component: UserDetailComponent,
    resolve: { user: UserResolver },
    canDeactivate: [UnsavedChangesGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canLoad: [CanLoadAdminModule],
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'super-admin'] }
  }
];
*/

/*
EVALUATION CRITERIA:
✓ Resolve implementation
✓ CanActivate with roles
✓ CanDeactivate for unsaved changes
✓ CanLoad for lazy loading
✓ Error handling and redirects
✓ Route data usage
*/


// ============================================
// QUESTION 16: Custom Directives & Attribute Binding
// ============================================
/*
QUESTION:
Create reusable custom directives:
- Attribute directives with input properties
- Structural directives with context
- Using @HostBinding and @HostListener
*/

/*
// Attribute directive with inputs
@Directive({
  selector: '[appLoadingState]'
})
export class LoadingStateDirective {
  @Input() set appLoadingState(isLoading: boolean) {
    if (isLoading) {
      this.el.nativeElement.classList.add('loading');
      this.el.nativeElement.disabled = true;
    } else {
      this.el.nativeElement.classList.remove('loading');
      this.el.nativeElement.disabled = false;
    }
  }
  
  constructor(private el: ElementRef) {}
}

// Structural directive with context
@Directive({
  selector: '[appRepeat]'
})
export class RepeatDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}
  
  @Input() set appRepeat(times: number) {
    this.viewContainer.clear();
    for (let i = 0; i < times; i++) {
      this.viewContainer.createEmbeddedView(this.templateRef, { $implicit: i });
    }
  }
}

// Usage: <div *appRepeat="3 as i">{{ i }}</div>

// Directive with host bindings
@Directive({
  selector: '[appClickDebounce]'
})
export class ClickDebounceDirective {
  @Output() debouncedClick = new EventEmitter<void>();
  private clickSubject = new Subject<void>();
  
  @HostListener('click')
  onClick(): void {
    this.clickSubject.next();
  }
  
  constructor() {
    this.clickSubject.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.debouncedClick.emit();
    });
  }
}

// Usage: <button (debouncedClick)="save()">Save</button>
*/

/*
EVALUATION CRITERIA:
✓ Attribute directive @Input
✓ Structural directive implementation
✓ @HostListener for events
✓ @HostBinding for properties
✓ Context and local variables
✓ Event debouncing
*/


// ============================================
// QUESTION 17: Custom Pipes & Transformations
// ============================================
/*
QUESTION:
Create custom pipes for:
- Transforming data (uppercase, currency)
- Pure vs impure pipes
- Async transformations
*/

/*
// Simple pure pipe
@Pipe({
  name: 'safePipe',
  pure: true
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  
  transform(value: string): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, value) || '';
  }
}

// Impure pipe (re-evaluates on every change)
@Pipe({
  name: 'sortArray',
  pure: false
})
export class SortArrayPipe implements PipeTransform {
  transform<T extends Record<string, any>>(array: T[], key: string): T[] {
    if (!array) return array;
    return [...array].sort((a, b) => 
      (a[key] || '').toString().localeCompare((b[key] || '').toString())
    );
  }
}

// Async pipe equivalent
@Pipe({
  name: 'asyncData'
})
export class AsyncDataPipe implements PipeTransform {
  transform(observable: Observable<any>): any {
    let result = null;
    observable.subscribe(data => result = data);
    return result;
  }
}

// Usage: {{ observable$ | asyncData }}
*/

/*
EVALUATION CRITERIA:
✓ PipeTransform implementation
✓ Pure vs impure pipes
✓ Proper typing with generics
✓ DomSanitizer usage
✓ Performance considerations
✓ Async operations in pipes
*/


// ============================================
// QUESTION 18: Advanced Dependency Injection
// ============================================
/*
QUESTION:
Master advanced DI patterns:
- Hierarchical injectors
- Forward references
- Injection tokens
- Factory functions
*/

/*
// Injection tokens for configuration
export const API_URL = new InjectionToken('api.url');
export const API_KEY = new InjectionToken('api.key');

// Forward reference
@Component({})
export class ParentComponent {
  @ViewChild(ChildComponent) child!: ChildComponent; // Resolved after view init
}

// Hierarchical DI - service per component
@Component({
  providers: [SpecialService] // New instance per component
})
export class ComponentA {}

@Component({
  providers: [SpecialService] // Different instance
})
export class ComponentB {}

// Factory function
function configFactory(): AppConfig {
  return {
    apiUrl: environment.apiUrl,
    production: environment.production
  };
}

@NgModule({
  providers: [
    { provide: API_URL, useValue: 'https://api.example.com' },
    { provide: AppConfig, useFactory: configFactory },
    { provide: LoggingService, useClass: ConsoleLoggerService }
  ]
})
export class AppModule {}

// Using injected tokens
@Injectable()
export class ApiService {
  constructor(
    @Inject(API_URL) private apiUrl: string,
    @Inject(API_KEY) private apiKey: string
  ) {}
}
*/

/*
EVALUATION CRITERIA:
✓ InjectionToken usage
✓ Hierarchical injector scopes
✓ Forward references
✓ Factory providers
✓ UseClass, UseValue, UseFactory
✓ @Inject decorator
*/


// ============================================
// QUESTION 19: Performance Optimization - Deep Dive
// ============================================
/*
QUESTION:
Optimize Angular application performance:
- Bundle size reduction
- Tree-shaking and code splitting
- Lazy loading modules
- Profiling with Chrome DevTools
*/

/*
// Tree-shaking: Only export what's needed
// Bad: export { Service1, Service2, Service3 }; only use 1
// Good: export Service1; export Service2; // and import only what you need

// Code splitting with lazy modules
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];

// Preloading strategy
const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
    data: { preload: true }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules // or CustomPreloadingStrategy
  })]
})
export class AppModule {}

// Custom preloading
@Injectable({
  providedIn: 'root'
})
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data && route.data['preload'] ? load() : of(null);
  }
}

// Production build
// ng build --prod
// - AOT compilation
// - Tree-shaking
// - Minification and compression
// - Source maps stripped

// Bundle analysis
// npm install --save-dev webpack-bundle-analyzer
*/

/*
EVALUATION CRITERIA:
✓ Code splitting and lazy loading
✓ Tree-shaking awareness
✓ AOT compilation
✓ Change detection optimization
✓ Bundle size reduction
✓ Performance profiling knowledge
*/


// ============================================
// QUESTION 20: Testing Angular Applications
// ============================================
/*
QUESTION:
Advanced testing patterns:
- Spy on methods
- Testing observables
- Testing async operations
- Marble testing
*/

/*
describe('UserService with marble testing', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  // Marble testing
  it('should handle search with debounce', (done) => {
    const mockResults = { a: [{ id: 1, name: 'John' }] };
    
    service.searchResults$.subscribe({
      next: (results) => {
        expect(results).toEqual(mockResults.a);
        done();
      }
    });
    
    service.search('john');
  });
  
  // Spy on methods
  it('should log errors', () => {
    const logSpy = spyOn(console, 'error');
    
    service.getUsers().subscribe();
    const req = httpMock.expectOne('/api/users');
    req.flush('Error', { status: 500, statusText: 'Error' });
    
    expect(logSpy).toHaveBeenCalled();
  });
  
  // Async callback
  it('should handle async operations', async () => {
    const result = await service.getUser(1).toPromise();
    expect(result).toBeDefined();
  });
  
  // fakeAsync and tick
  it('should handle setTimeout', fakeAsync(() => {
    let called = false;
    setTimeout(() => called = true, 1000);
    
    tick(1000);
    expect(called).toBe(true);
  }));
});
*/

/*
EVALUATION CRITERIA:
✓ TestBed setup
✓ HttpTestingController
✓ Spy and mock
✓ Async testing
✓ fakeAsync and tick
✓ Marble testing concepts
✓ Error handling tests
*/


// ============================================
// QUESTION 21: Error Handling Patterns
// ============================================
/*
QUESTION:
Implement global and local error handling:
- Global error handler
- RxJS error operators
- User feedback strategies
*/

/*
// Global error handler
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private injector: Injector,
    private logger: LoggerService
  ) {}
  
  handleError(error: Error | HttpErrorResponse): void {
    const chunkFailedMessage = /Loading chunk \d+ failed/g;
    
    if (chunkFailedMessage.test(error.message)) {
      // Lazy load failed - reload page
      window.location.reload();
    }
    
    this.logger.log(`Error: ${error.message}`);
  }
}

@NgModule({
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class AppModule {}

// HTTP error handler
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }
  
  private handleError(error: HttpErrorResponse): void {
    if (error.status === 404) {
      // Handle 404
    } else if (error.status === 500) {
      // Handle server error
    }
  }
}

// User-facing error notification
@Component({})
export class ErrorNotificationComponent {
  private toastr = inject(ToastrService);
  
  handleError(error: any): void {
    const message = error.error?.message || 'An error occurred';
    this.toastr.error(message, 'Error');
  }
}
*/

/*
EVALUATION CRITERIA:
✓ Global ErrorHandler implementation
✓ HTTP error interception
✓ User notification strategies
✓ Logging and reporting
✓ Recovery mechanisms
✓ Error propagation control
*/


// ============================================
// QUESTION 22: State Management Patterns
// ============================================
/*
QUESTION:
Implement state management:
- Service-based state
- NgRx/Redux patterns
- CQRS pattern
*/

/*
// Service-based state with BehaviorSubject
@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private state$ = new BehaviorSubject<AppState>({
    user: null,
    loading: false,
    error: null
  });
  
  // Selectors
  user$ = this.state$.pipe(
    map(state => state.user),
    distinctUntilChanged()
  );
  
  loading$ = this.state$.pipe(
    map(state => state.loading),
    distinctUntilChanged()
  );
  
  // Actions
  loadUser(id: string): void {
    this.updateState({ loading: true });
    
    this.userService.getUser(id).subscribe(
      user => this.updateState({ user, loading: false }),
      error => this.updateState({ error, loading: false })
    );
  }
  
  private updateState(partial: Partial<AppState>): void {
    this.state$.next({ ...this.state$.value, ...partial });
  }
  
  getState(): AppState {
    return this.state$.value;
  }
}

interface AppState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
*/

/*
EVALUATION CRITERIA:
✓ BehaviorSubject state management
✓ Selector pattern
✓ Action dispatching
✓ Immutable state updates
✓ Error state handling
*/


// ============================================
// QUESTION 23: Angular Elements & Web Components
// ============================================
/*
QUESTION:
Create an Angular component as a Web Component (Angular Element).
*/

/*
// Create custom element
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [MyComponent],
  imports: [CommonModule]
})
export class MyComponentModule {}

// Bootstrap as custom element
platformBrowserDynamic()
  .bootstrapModule(MyComponentModule)
  .then(moduleRef => {
    const injector = moduleRef.injector;
    const MyElement = createCustomElement(MyComponent, {
      injector
    });
    customElements.define('my-component', MyElement);
  });

// Usage in any HTML/framework
<my-component 
  name="John" 
  @namechange="handleChange($event)">
</my-component>
*/

/*
EVALUATION CRITERIA:
✓ Angular Elements setup
✓ createCustomElement API
✓ Custom element registration
✓ Props and events
✓ Framework-agnostic usage
*/


// ============================================
// QUESTION 24: Async Pipe and Memory Management
// ============================================
/*
QUESTION:
Master async pipe mechanics and prevent memory leaks.
*/

/*
@Component({
  template: `
    <div>{{ user$ | async | json }}</div>
    <div *ngIf="(isLoading$ | async)">Loading...</div>
  `
})
export class UserComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  isLoading$: Observable<boolean>;
  private destroy$ = new Subject<void>();
  
  constructor(private service: UserService) {
    this.user$ = this.service.user$;
    this.isLoading$ = this.service.isLoading$;
  }
  
  ngOnInit(): void {
    // Using takeUntil to prevent memory leaks
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => console.log(data));
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// Async pipe automatically unsubscribes on destroy
// But manual subscriptions need takeUntil pattern
*/

/*
EVALUATION CRITERIA:
✓ Async pipe mechanics
✓ takeUntil for cleanup
✓ Memory leak prevention
✓ Subject for destroy signal
✓ Unsubscribe in ngOnDestroy
*/


// ============================================
// QUESTION 25: Advanced Angular Patterns & Best Practices
// ============================================
/*
QUESTION:
Master advanced patterns:
- Smart/Dumb component pattern
- Reactive architecture
- Performance monitoring
*/

/*
// SMART COMPONENT - Handles logic and data
@Component({
  selector: 'app-user-container',
  template: `
    <div *ngIf="(isLoading$ | async)">Loading...</div>
    <app-user-list 
      [users]="(users$ | async)"
      (selectUser)="onSelectUser($event)">
    </app-user-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserContainerComponent implements OnInit {
  users$ = this.service.users$;
  isLoading$ = this.service.isLoading$;
  
  constructor(private service: UserService) {}
  
  ngOnInit(): void {
    this.service.loadUsers();
  }
  
  onSelectUser(user: User): void {
    this.service.selectUser(user);
  }
}

// DUMB COMPONENT - Presentational only
@Component({
  selector: 'app-user-list',
  template: `
    <div *ngFor="let user of users; trackBy: trackByFn">
      {{ user.name }}
      <button (click)="selectUser.emit(user)">Select</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  @Input() users: User[] = [];
  @Output() selectUser = new EventEmitter<User>();
  
  trackByFn(index: number, user: User): string {
    return user.id;
  }
}

// REACTIVE ARCHITECTURE PATTERN
// - Use Observables everywhere
// - Avoid manual subscriptions
// - Use async pipe
// - Leverage RxJS operators
// - Keep components lean

// BEST PRACTICES:
// 1. Use trackBy with *ngFor
// 2. Implement OnPush change detection
// 3. Use async pipe
// 4. Unsubscribe with takeUntil
// 5. Use hierarchical services
// 6. Keep components small and focused
// 7. Separate smart/dumb components
// 8. Use strong typing
*/

/*
EVALUATION CRITERIA:
✓ Smart/dumb component separation
✓ Container vs presentational
✓ OnPush change detection
✓ Reactive patterns
✓ Performance optimization
✓ Best practices adherence
✓ Real-world applicability
*/


// ============================================
// QUESTION 26: Signals — Angular's New Reactivity Model
// ============================================
/*
QUESTION:
Angular 16+ introduced Signals as a new fine-grained reactivity primitive.
Explain the difference between Signals, Computed signals, and Effects.
Rewrite a component that uses BehaviorSubject-based state to use Signals instead.
What are the Zone.js implications?

TRICKY PART: When does a computed re-evaluate? What happens if you read a
signal inside an effect and then write to another signal?
*/

/*
import { signal, computed, effect, Component } from '@angular/core';

// === BEFORE: BehaviorSubject-based ===
// count$ = new BehaviorSubject(0);
// doubled$ = this.count$.pipe(map(n => n * 2));

// === AFTER: Signals ===
@Component({
  selector: 'app-counter',
  template: `
    <p>Count: {{ count() }}</p>
    <p>Doubled: {{ doubled() }}</p>
    <button (click)="increment()">+</button>
  `,
  // Signals work WITHOUT Zone.js — future zoneless Angular
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent {
  // Writable signal — like a reactive variable
  count = signal(0);

  // Computed signal — derived, memoized, re-runs only when count() changes
  doubled = computed(() => this.count() * 2);

  constructor() {
    // Effect — side-effect that runs whenever tracked signals change
    // NEVER write to a signal inside an effect without untracked() — creates cycles
    effect(() => {
      console.log('Count changed to:', this.count()); // automatically tracks count
    });
  }

  increment() {
    // update() is preferred over set() when new value depends on old value
    this.count.update(n => n + 1);
    // this.count.set(this.count() + 1); // also valid but reads signal outside reactive ctx
  }
}

// KEY RULES:
// 1. Reading a signal in a template/computed/effect = tracked dependency
// 2. Writing inside an effect = use untracked() or causes error in strict mode
// 3. computed() is lazy and memoized — doesn't recompute if dependencies unchanged
// 4. Signals enable Zoneless Angular — no need for NgZone.run() tricks

EVALUATION CRITERIA:
✓ signal() = writable reactive primitive (like useState but synchronous)
✓ computed() = derived signal; memoized; auto-tracks read signals
✓ effect() = reactive side-effect; re-runs when dependencies change
✓ set() vs update() vs mutate() — mutate for objects without cloning
✓ Signals are synchronous — no async/await needed in reactivity graph
✓ Template reads signal by calling it: {{ count() }} not {{ count }}
✓ Enables future zoneless Angular with ChangeDetectionStrategy.OnPush
✓ toSignal() / toObservable() — bridge between RxJS and Signals
*/


// ============================================
// QUESTION 27: Signal-based Inputs, Outputs, Queries
// ============================================
/*
QUESTION:
Angular 17.1+ introduced signal-based input(), output(), and viewChild().
Compare them to @Input()/@Output()/@ViewChild() decorators. What problems do
they solve? Show the new syntax and explain the typing differences.

TRICKY PART: input() is readonly — you cannot call .set() on it.
outputFromObservable() bridges RxJS to the new output API.
*/

/*
import {
  input, output, viewChild, viewChildren, model,
  Component, ElementRef
} from '@angular/core';

@Component({
  selector: 'app-signal-demo',
  template: `
    <p>{{ title() }}</p>
    <p>{{ count() }}</p>
    <button (click)="onIncrement()">+</button>
    <div #container></div>
  `
})
export class SignalDemoComponent {
  // input() — signal-based @Input. Type is Signal<T | undefined> by default
  title = input<string>();                    // Signal<string | undefined>
  count = input.required<number>();           // Signal<number> — required, no undefined
  step  = input(1);                           // Signal<number>, default 1 — inferred type

  // model() — two-way bindable signal (equivalent of @Input + @Output with EventEmitter)
  value = model(0);                           // ModelSignal<number> — writable + emits

  // output() — signal-based @Output. Returns OutputEmitterRef, not EventEmitter
  incremented = output<number>();             // replaces: @Output() incremented = new EventEmitter<number>()

  // viewChild() — signal-based @ViewChild. Available after ngAfterViewInit
  container = viewChild<ElementRef>('container');  // Signal<ElementRef | undefined>
  containerRequired = viewChild.required<ElementRef>('container'); // Signal<ElementRef>

  // viewChildren() — signal-based @ViewChildren
  // items = viewChildren(ItemComponent);     // Signal<readonly ItemComponent[]>

  onIncrement() {
    const newVal = this.count() + this.step();
    this.incremented.emit(newVal);
    this.value.set(newVal); // model() is writable — emits to parent via two-way binding
  }
}

// Parent template — two-way binding with model()
// <app-signal-demo [(value)]="parentValue" [count]="5" />

EVALUATION CRITERIA:
✓ input() returns a readonly Signal — cannot call .set() on it
✓ input.required() eliminates the T | undefined type without non-null assertion
✓ model() is a writable Signal that also emits on change (replaces @Input + @Output pair)
✓ output() replaces EventEmitter — no need for new EventEmitter<T>()
✓ viewChild() result is Signal<T | undefined> — available after view init
✓ All signal queries are available in constructor (unlike @ViewChild which needs AfterViewInit hook)
✓ No zone.js patching needed — change detection triggered by signal writes
*/


// ============================================
// QUESTION 28: Standalone Components — Deep Dive
// ============================================
/*
QUESTION:
What are Standalone Components? How do they change the bootstrapping model,
lazy loading, and testing? What is the difference between standalone: true
and a regular NgModule component? Show a lazy-loaded route using a standalone
component with a provider scoped to that route.

TRICKY PART: What happens to shared services when you provide them in
loadComponent vs loadChildren route configs?
*/

/*
import { Component, Injectable } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

// Standalone component — no NgModule required
@Component({
  selector: 'app-root',
  standalone: true,              // ← key flag
  imports: [RouterOutlet],       // import what you need directly
  template: '<router-outlet />'
})
export class AppComponent {}

// Lazy-loaded standalone component route
const routes: Routes = [
  {
    path: 'dashboard',
    // loadComponent: lazy-loads a single standalone component
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    providers: [
      // Scoped provider — DashboardService only exists while this route is active
      // Destroyed when user navigates away from /dashboard
      DashboardService
    ]
  },
  {
    path: 'admin',
    // loadChildren: still works — can load a standalone routes array
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()           // replaces HttpClientModule
    // provideAnimations()        // replaces BrowserAnimationsModule
  ]
});

// TRICKY: providers in loadComponent are route-scoped
// providedIn: 'root' services are still singletons — route providers are layered on top

EVALUATION CRITERIA:
✓ standalone: true removes the NgModule requirement
✓ imports[] on component replaces NgModule imports[] for that component
✓ bootstrapApplication() replaces platformBrowserDynamic().bootstrapModule()
✓ loadComponent vs loadChildren — single component vs routes array
✓ Route-level providers are scoped and destroyed with the route
✓ Existing NgModule apps interop via importProvidersFrom()
✓ Testing: TestBed.configureTestingModule with imports: [MyStandaloneComponent]
✓ Tree-shakeable by default — no shared module over-importing
*/


// ============================================
// QUESTION 29: Deferrable Views (@defer)
// ============================================
/*
QUESTION:
Angular 17 introduced @defer blocks for template-level lazy loading.
Explain the different trigger types, loading/placeholder/error sub-blocks,
and how @defer interacts with SSR and hydration.

TRICKY PART: What is the difference between on viewport and on interaction?
What does prefetch mean? Does @defer affect the component's change detection?
*/

/*
// TEMPLATE SYNTAX (not TypeScript — shown in comment)
//
// Basic defer with viewport trigger
// @defer (on viewport) {
//   <app-heavy-chart [data]="chartData" />
// } @loading (minimum 200ms; after 100ms) {
//   <app-skeleton />
// } @placeholder (minimum 500ms) {
//   <div class="chart-stub">Chart loading...</div>
// } @error {
//   <p>Failed to load chart.</p>
// }
//
// TRIGGER TYPES:
// on idle            — browser idle (requestIdleCallback)
// on viewport        — element scrolled into view (IntersectionObserver)
// on interaction     — user clicks/focuses the placeholder
// on hover           — user hovers over the placeholder
// on timer(2s)       — after a fixed delay
// on immediate       — defers only bundle, renders immediately
// when condition     — custom boolean expression
//
// PREFETCH:
// @defer (on viewport; prefetch on idle) { ... }
// Fetches the chunk on idle but renders only when in viewport
//
// MULTIPLE TRIGGERS:
// @defer (on idle; on viewport) — whichever fires first wins
//
// SSR IMPLICATIONS:
// @defer blocks are NOT server-rendered by default (they're lazy)
// Use hydrate trigger to control client-side hydration separately
// @defer (hydrate on viewport) { ... }

EVALUATION CRITERIA:
✓ @defer is template-level — no router or manual dynamic import needed
✓ @placeholder renders immediately (SSR-safe), replaced after trigger
✓ @loading shows during chunk download (with after/minimum timing control)
✓ Triggers: idle/viewport/interaction/hover/timer/immediate/when
✓ prefetch separates fetching from rendering
✓ @defer does NOT break change detection — the deferred component is fully normal
✓ Works with standalone components natively
✓ SSR: placeholder is server-rendered; deferred block hydrates on client
*/


// ============================================
// QUESTION 30: Angular Control Flow Syntax (@if, @for, @switch)
// ============================================
/*
QUESTION:
Angular 17 introduced built-in control flow (@if, @for, @switch) replacing
*ngIf, *ngFor, *ngSwitch. What are the performance and DX improvements?
What is the @empty block? How does @for's track differ from trackBy?

TRICKY PART: @for requires track — what happens without it?
What does @if's else-if chain look like? Can you use async pipe with @if?
*/

/*
// OLD structural directives
// <div *ngIf="user; else loading">{{ user.name }}</div>
// <ng-template #loading><p>Loading...</p></ng-template>
// <li *ngFor="let item of items; trackBy: trackByFn">{{ item.name }}</li>

// NEW built-in control flow

// @if with else-if and else
// @if (user.role === 'admin') {
//   <app-admin-panel />
// } @else if (user.role === 'manager') {
//   <app-manager-panel />
// } @else {
//   <app-user-panel />
// }

// @if with async pipe — still works
// @if (user$ | async; as user) {
//   <p>{{ user.name }}</p>
// }

// @for with required track
// @for (item of items; track item.id) {
//   <app-item [data]="item" />
// } @empty {
//   <p>No items found.</p>   // replaces ngIf + ngFor pattern
// }

// track is MANDATORY in @for (unlike optional trackBy in *ngFor)
// track item.id  — expression evaluated per item, must return unique key
// track $index   — use index when items have no stable ID (risky for mutations)
// track item     — reference equality; safest for primitive arrays

// @switch
// @switch (status) {
//   @case ('active') { <span class="green">Active</span> }
//   @case ('inactive') { <span class="red">Inactive</span> }
//   @default { <span>Unknown</span> }
// }

// PERFORMANCE IMPROVEMENTS:
// - No longer creates a structural directive instance per element
// - Compiled to optimized JS, not directive-overhead code
// - @empty eliminates the (items.length === 0) guard pattern
// - Better type narrowing — @if (x; as y) gives y the narrowed type

EVALUATION CRITERIA:
✓ @if supports else-if chains natively (no nested ng-template)
✓ @if (expr; as alias) captures and narrows the value
✓ @for requires track — compilation error without it
✓ @empty block handles empty array case alongside @for
✓ track expression replaces trackBy function — more concise
✓ @switch replaces [ngSwitch]/[ngSwitchCase]/[ngSwitchDefault]
✓ Built-in control flow has no directive overhead — faster compilation and runtime
✓ Works inside @defer blocks
*/


// ============================================
// QUESTION 31: inject() Function and Injection Context
// ============================================
/*
QUESTION:
Angular 14+ introduced the inject() function as an alternative to constructor DI.
When can you call inject()? What is an "injection context"? Build a reusable
composable that uses inject() to create a feature-flag guard as a standalone function.

TRICKY PART: Can inject() be called outside a constructor?
What happens if you call inject() in ngOnInit?
*/

/*
import { inject, Injectable, Component, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// inject() VALID locations:
// 1. Class constructor
// 2. Class field initializer
// 3. Factory function passed to runInInjectionContext()
// 4. Function called synchronously from the above

// inject() INVALID (throws NG0203):
// - ngOnInit, ngOnChanges, event handlers, async callbacks
// - setTimeout/Promise callbacks inside constructor

@Injectable({ providedIn: 'root' })
class FeatureFlagService {
  private flags = new Map<string, boolean>();
  isEnabled(flag: string) { return this.flags.get(flag) ?? false; }
}

// Reusable composable using inject() — functional style DI
function useFeatureFlag(flag: string) {
  const svc = inject(FeatureFlagService); // valid — called during class field init
  return computed(() => svc.isEnabled(flag));
}

@Component({ selector: 'app-feature', standalone: true, template: '' })
class FeatureComponent {
  // Field initializer runs inside injection context — inject() is valid here
  private darkMode = useFeatureFlag('dark-mode');
  private destroyRef = inject(DestroyRef);

  constructor() {
    // inject() is valid in constructor body too
    const router = inject(Router);

    // takeUntilDestroyed() uses inject(DestroyRef) internally — must be called here
    someObservable$
      .pipe(takeUntilDestroyed()) // automatically unsubscribes when component destroys
      .subscribe(console.log);
  }

  ngOnInit() {
    // inject(SomeService) here → NG0203 error!
  }
}

// runInInjectionContext — escape hatch for factories
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';
function createServiceOutsideContext(injector: EnvironmentInjector) {
  return runInInjectionContext(injector, () => inject(FeatureFlagService));
}

EVALUATION CRITERIA:
✓ inject() replaces constructor parameter injection — less boilerplate
✓ Valid in: constructor, field initializers, functions called synchronously from those
✓ Invalid in: lifecycle hooks, event callbacks, async code
✓ inject(DestroyRef) is the modern way to get lifecycle hooks in composables
✓ takeUntilDestroyed() must be called in injection context (constructor or field)
✓ Enables functional, composable patterns (React-hooks-like)
✓ runInInjectionContext() allows injection outside class context
*/


// ============================================
// QUESTION 32: Change Detection — Zone.js vs Zoneless
// ============================================
/*
QUESTION:
Explain exactly how Zone.js triggers Angular change detection. What are the
performance pitfalls of Zone.js? How does provideExperimentalZonelessChangeDetection()
work? What must you change in components to be zoneless-compatible?

TRICKY PART: In a zoneless app, calling this.myProp = 'new' in a component
does NOT trigger a view update. Why? How do you fix it?
*/

/*
// HOW ZONE.JS WORKS:
// Zone.js monkey-patches async APIs (setTimeout, Promise, addEventListener, XHR)
// When a patched operation completes, it notifies Angular's NgZone
// NgZone.onMicrotaskEmpty triggers ApplicationRef.tick() → full CD cycle

// PITFALLS:
// 1. Every setTimeout/Promise.then triggers a full CD cycle — even unrelated ones
// 2. Third-party libraries that call patched APIs cause unnecessary CD
// 3. CD inside zone = entire component tree checked (even with OnPush, ancestors check)

// ESCAPE HATCH — run code outside Angular's zone
constructor(private ngZone: NgZone) {
  ngZone.runOutsideAngular(() => {
    // heavy animation loop — won't trigger CD
    requestAnimationFrame(this.animate.bind(this));
  });
}

// Force CD when needed from outside zone
triggerUpdate() {
  this.ngZone.run(() => {
    this.data = newData; // now CD will pick it up
  });
}

// ZONELESS SETUP (Angular 18+)
bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection()
  ]
});
// Also remove zone.js from polyfills in angular.json

// ZONELESS COMPONENT — must use Signals or ChangeDetectorRef.markForCheck()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush, // required for zoneless
  template: `{{ name() }}`
})
class ZonelessComponent {
  name = signal('Alice');    // Signal write → schedules check automatically

  // WRONG in zoneless — plain property mutation not tracked:
  // plainName = 'Alice';
  // update() { this.plainName = 'Bob'; } // view never updates!

  // RIGHT: use signal, or manually mark:
  constructor(private cdr: ChangeDetectorRef) {}
  update() { this.cdr.markForCheck(); } // explicit check request
}

EVALUATION CRITERIA:
✓ Zone.js patches async APIs and triggers ApplicationRef.tick() on completion
✓ OnPush only checks subtree — but zone still triggers root tick
✓ runOutsideAngular prevents zone patching for perf-heavy code
✓ Zoneless: no zone.js = no automatic tick; Signals drive scheduling
✓ provideExperimentalZonelessChangeDetection removes zone dependency
✓ All components need OnPush + Signals or explicit markForCheck() in zoneless
✓ Signals + zoneless = finest-grain CD possible in Angular
*/


// ============================================
// QUESTION 33: HTTP Resource API (Angular 19+)
// ============================================
/*
QUESTION:
Angular 19 introduced the resource() and httpResource() APIs — signal-based
data fetching. How do they compare to calling HttpClient in ngOnInit?
What is the status signal? How do you handle loading, error, and refresh?

TRICKY PART: resource() re-fetches automatically when reactive dependencies change.
What happens if the user navigates away mid-fetch?
*/

/*
import { resource, httpResource, signal, Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    @if (userResource.isLoading()) {
      <app-spinner />
    } @else if (userResource.error()) {
      <p>Error: {{ userResource.error() }}</p>
    } @else {
      <p>{{ userResource.value()?.name }}</p>
    }
    <button (click)="userId.set(userId() + 1)">Next User</button>
    <button (click)="userResource.reload()">Refresh</button>
  `
})
export class UserProfileComponent {
  userId = signal(1);

  // httpResource — automatically re-fetches when userId() changes
  userResource = httpResource<User>(() => `/api/users/${this.userId()}`);

  // resource() — lower-level, bring your own fetcher
  customResource = resource({
    request: () => ({ id: this.userId() }),
    loader: async ({ request, abortSignal }) => {
      // abortSignal fires when component destroys or new request supersedes
      const res = await fetch(`/api/users/${request.id}`, { signal: abortSignal });
      if (!res.ok) throw new Error('Fetch failed');
      return res.json() as Promise<User>;
    }
  });

  // Status signals:
  // .isLoading()  — true while fetching
  // .value()      — current data (undefined while loading)
  // .error()      — last error (undefined if no error)
  // .status()     — 'idle' | 'loading' | 'refreshing' | 'resolved' | 'error' | 'local'
  // .reload()     — manually trigger re-fetch
  // .set(val)     — optimistic local update (status becomes 'local')
}

EVALUATION CRITERIA:
✓ httpResource() wraps HttpClient — integrates with interceptors and auth
✓ resource() accepts any async loader — fetch, GraphQL, WebSocket, etc.
✓ Re-fetches automatically when reactive dependencies (signals) change
✓ abortSignal cancels in-flight requests on component destroy or superseded request
✓ .set() enables optimistic updates — status changes to 'local'
✓ .reload() triggers manual re-fetch without changing the request
✓ replaces ngOnInit + HttpClient subscription pattern entirely
✓ Works with SSR and hydration — state transferred from server to client
*/


// ============================================
// QUESTION 34: Angular Animations — Advanced
// ============================================
/*
QUESTION:
Build an animation that uses :enter/:leave state aliases, query()+stagger()
for list animations, and animateChild() to coordinate parent-child animations.
What is the difference between trigger() on a component vs a directive?
When does Angular skip animations?

TRICKY PART: Why does :leave animation sometimes not play for *ngFor removals?
How do you fix it with AnimationBuilder for programmatic animations?
*/

/*
import {
  trigger, state, style, animate, transition,
  query, stagger, animateChild, group, sequence,
  AnimationBuilder, AnimationPlayer
} from '@angular/animations';

// List stagger animation — applied on the parent container
const listAnimation = trigger('listAnimation', [
  transition('* => *', [ // runs on any state change (items added/removed)
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(-10px)' }),
      stagger(50, [ // 50ms delay between each entering element
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true }), // optional: true prevents error when no elements match

    query(':leave', [
      stagger(30, [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateX(20px)' }))
      ])
    ], { optional: true })
  ])
]);

// Parent-child animation coordination
const parentAnimation = trigger('parent', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 })),
    query('@child', animateChild()) // wait for child trigger named 'child' to complete
  ])
]);

// TRICKY: :leave doesn't work on *ngFor unless parent has [@trigger]
// The host element needs an animation trigger to enable leave animations for children
// FIX: add [@.disabled]="false" on parent, or use AnimationBuilder for imperative control

// Programmatic animation with AnimationBuilder
@Component({ selector: 'app-animated', template: '<div #box></div>' })
class AnimatedComponent {
  @ViewChild('box') boxRef!: ElementRef;
  private player!: AnimationPlayer;

  constructor(private builder: AnimationBuilder) {}

  playSlideIn() {
    const factory = this.builder.build([
      style({ transform: 'translateX(-100%)' }),
      animate('400ms ease-out', style({ transform: 'translateX(0)' }))
    ]);
    this.player = factory.create(this.boxRef.nativeElement);
    this.player.play();
  }

  // Angular skips animations when:
  // - BrowserAnimationsModule not imported (or NoopAnimationsModule used in tests)
  // - [@.disabled]="true" on any ancestor
  // - User has prefers-reduced-motion (Angular does NOT handle this automatically — you must)
}

EVALUATION CRITERIA:
✓ :enter / :leave alias void => * and * => void transitions
✓ query() selects child elements within the trigger element
✓ stagger() delays each matched element sequentially
✓ optional: true prevents runtime error when query matches nothing
✓ animateChild() coordinates parent and child trigger timelines
✓ AnimationBuilder for programmatic, imperative animations outside templates
✓ :leave fails on ngFor unless parent element has an animation trigger
✓ Reduce-motion: check prefers-reduced-motion via BreakpointObserver and disable triggers
*/


// ============================================
// QUESTION 35: Content Projection — Advanced Patterns
// ============================================
/*
QUESTION:
Explain the difference between single-slot, multi-slot, and conditional content
projection. What is ContentChildren vs ContentChild? How does ngProjectAs work?
Show a Card component that projects header, body, and footer into named slots
and conditionally shows the footer only when content is provided.

TRICKY PART: When does ContentChild become available? What happens if you
project a component that has its own lifecycle hooks?
*/

/*
import { Component, ContentChild, ContentChildren, QueryList, AfterContentInit, ElementRef } from '@angular/core';

// Named slot directives — used as selectors for multi-slot projection
@Directive({ selector: '[appCardHeader]', standalone: true })
class CardHeaderDirective {}

@Directive({ selector: '[appCardFooter]', standalone: true })
class CardFooterDirective {}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgIf, CardHeaderDirective, CardFooterDirective],
  template: `
    <div class="card">
      <div class="card-header">
        <!-- Named slot: only projects elements with [appCardHeader] -->
        <ng-content select="[appCardHeader]" />
      </div>

      <div class="card-body">
        <!-- Default slot: projects everything not matched by other selects -->
        <ng-content />
      </div>

      <!-- Conditional footer — only renders wrapper if content exists -->
      @if (hasFooter) {
        <div class="card-footer">
          <ng-content select="[appCardFooter]" />
        </div>
      }
    </div>
  `
})
class CardComponent implements AfterContentInit {
  // ContentChild available after ngAfterContentInit — NOT in ngOnInit
  @ContentChild(CardFooterDirective) footerContent?: CardFooterDirective;
  @ContentChildren(CardHeaderDirective) headers!: QueryList<CardHeaderDirective>;

  hasFooter = false;

  ngAfterContentInit() {
    this.hasFooter = !!this.footerContent;
    // QueryList is live — subscribe to changes for dynamic content
    this.headers.changes.subscribe(() => console.log('Headers changed'));
  }
}

// Consumer
// <app-card>
//   <h2 appCardHeader>My Title</h2>
//   <p>Body content here</p>
//   <footer appCardFooter>Footer text</footer>
// </app-card>

// ngProjectAs — project as a different selector than the actual element
// <ng-container ngProjectAs="[appCardHeader]">
//   <h2>Projected as header</h2>
// </ng-container>

EVALUATION CRITERIA:
✓ ng-content select uses CSS attribute/class/element selectors
✓ Default ng-content catches everything not matched by named selects
✓ ContentChild / ContentChildren available from ngAfterContentInit (not ngOnInit!)
✓ QueryList.changes is a live observable — subscribe for dynamic content changes
✓ Conditional projection wrapper pattern — hasFooter flag avoids empty div
✓ ngProjectAs allows ng-container to masquerade as a different selector
✓ Projected components fully participate in Angular lifecycle
✓ Cannot project into a child component from grandparent — only direct parent
*/


// ============================================
// QUESTION 36: Router — Advanced Guards and Resolvers
// ============================================
/*
QUESTION:
Angular 14.2+ introduced functional guards and resolvers.
Compare class-based vs functional guards. Show a canMatch guard that
restricts a route based on a feature flag. Explain the difference between
canActivate vs canMatch vs canLoad. When would you use a resolver vs
component-level data fetching?

TRICKY PART: canMatch prevents the route from being considered at all —
it's checked before URL matching. canActivate runs after URL matches.
What does this mean for routing fallbacks?
*/

/*
import { inject } from '@angular/core';
import { Router, CanActivateFn, CanMatchFn, ResolveFn, Route, UrlSegment } from '@angular/router';

// Functional guard — replaces class implementing CanActivate
const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) return true;
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  // returning UrlTree redirects — cleaner than router.navigate() in guard
};

// canMatch — evaluated before route is matched (not after)
// If returns false, Angular continues to next route in the config
const featureFlagGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const flags = inject(FeatureFlagService);
  return flags.isEnabled(route.data?.['flag']);
  // If false → Angular tries the NEXT route with same path (fallback pattern!)
};

const routes: Routes = [
  {
    path: 'dashboard',
    canMatch: [featureFlagGuard],
    data: { flag: 'new-dashboard' },
    loadComponent: () => import('./new-dashboard.component').then(m => m.NewDashboardComponent)
  },
  {
    path: 'dashboard',  // same path — fallback when canMatch fails
    loadComponent: () => import('./old-dashboard.component').then(m => m.OldDashboardComponent)
  }
];

// Functional resolver — runs before component activation, data available in ActivatedRoute
const userResolver: ResolveFn<User> = (route) => {
  const userService = inject(UserService);
  return userService.getUser(route.paramMap.get('id')!); // can return Observable, Promise, or value
};

// WHEN RESOLVER vs COMPONENT FETCH:
// Resolver: data MUST be present before component renders (e.g., page title, auth context)
// Component: data loads async, show skeleton — better UX, simpler code, works with resource()

EVALUATION CRITERIA:
✓ Functional guards use inject() — no class boilerplate
✓ CanActivateFn can return boolean | UrlTree | Observable<...> | Promise<...>
✓ canMatch fires before URL matching — false means route is skipped entirely
✓ canActivate fires after URL matches — false blocks activation but URL is consumed
✓ canMatch enables A/B testing and feature flags with same URL path
✓ Resolver blocks navigation until resolved — causes loading delay but no flash of empty
✓ ResolveFn can return Observable — Angular waits for first emission then completes
✓ Prefer resource() / component-level fetching for better perceived performance
*/


// ============================================
// QUESTION 37: Angular Universal / SSR and Hydration
// ============================================
/*
QUESTION:
Explain how Angular SSR works with the App Engine (Angular 17+). What is
Non-Destructive Hydration? What are common hydration mismatch pitfalls?
How do you use isPlatformBrowser to guard browser-only code? What is
TransferState and when is it needed?

TRICKY PART: What happens to subscriptions created in the server context?
How does Angular handle DOM APIs like window/localStorage on the server?
*/

/*
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { PLATFORM_ID, inject, makeStateKey, TransferState } from '@angular/core';

@Component({ selector: 'app-ssr-safe', template: '{{ data }}' })
class SsrSafeComponent implements OnInit {
  data = '';
  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);

  private readonly DATA_KEY = makeStateKey<string>('my-data');

  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      // Server: fetch data, store in TransferState to pass to client
      const result = expensiveFetch();
      this.data = result;
      this.transferState.set(this.DATA_KEY, result);
    } else {
      // Client: read from TransferState — avoids duplicate HTTP request on hydration
      if (this.transferState.hasKey(this.DATA_KEY)) {
        this.data = this.transferState.get(this.DATA_KEY, '');
        this.transferState.remove(this.DATA_KEY);
      }
    }

    // NEVER DO on server (window is undefined):
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('auth'); // safe — browser only
      window.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  onScroll() {}
}

// Angular 17+ with provideClientHydration() — non-destructive hydration
// The server-rendered DOM is REUSED, not destroyed and recreated
// Hydration mismatches = server HTML differs from client first render:
//   - Date.now() called during render → different values
//   - Math.random() → different values
//   - Accessing window/document on server without guard
//   - Direct DOM manipulation bypassing Angular (e.g., jQuery, innerHTML)
// FIX: use ngSkipHydration on components that can't hydrate safely

// Subscriptions on server: HttpClient observables complete — safe
// Subscriptions to interval/Subject on server: NEVER unsubscribed → memory leak!
// Use takeUntilDestroyed() or isPlatformServer guard

bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(), // enables non-destructive hydration
    provideServerRendering()  // in server.ts
  ]
});

EVALUATION CRITERIA:
✓ isPlatformBrowser / isPlatformServer — guard browser-only APIs
✓ TransferState passes server-fetched data to client, preventing duplicate requests
✓ Non-destructive hydration (Angular 17+): reuses server DOM instead of rebuilding
✓ Hydration mismatch causes: non-deterministic rendering, direct DOM manipulation
✓ ngSkipHydration attribute opts a component out of hydration
✓ Server subscriptions to hot observables leak — guard or use DestroyRef
✓ window/document/localStorage access on server throws — must guard
✓ HttpClient on server: withFetch() required in Angular 18+ (Node fetch vs XMLHttpRequest)
*/


// ============================================
// QUESTION 38: NgRx Store — Advanced Patterns
// ============================================
/*
QUESTION:
Explain the difference between NgRx Store, ComponentStore, and SignalStore.
When would you choose each? Show an effect that handles optimistic updates
with rollback on failure. What is the entity adapter pattern?

TRICKY PART: What is the difference between createFeature() and createReducer()
standalone? What is memoized selector re-computation and when can it be a footgun?
*/

/*
import { createAction, createReducer, on, createSelector, createFeature, props } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

// Entity adapter — manages normalized collection state
interface Todo { id: string; text: string; done: boolean; }
const todoAdapter: EntityAdapter<Todo> = createEntityAdapter<Todo>({
  selectId: t => t.id,
  sortComparer: (a, b) => a.text.localeCompare(b.text)
});

// Actions
const loadTodos = createAction('[Todos] Load');
const loadTodosSuccess = createAction('[Todos] Load Success', props<{ todos: Todo[] }>());
const deleteTodo = createAction('[Todos] Delete', props<{ id: string }>());
const deleteTodoSuccess = createAction('[Todos] Delete Success', props<{ id: string }>());
const deleteTodoFail = createAction('[Todos] Delete Fail', props<{ todo: Todo }>());

// Reducer with entity adapter
const todoReducer = createReducer(
  todoAdapter.getInitialState({ loading: false }),
  on(loadTodos, state => ({ ...state, loading: true })),
  on(loadTodosSuccess, (state, { todos }) =>
    todoAdapter.setAll(todos, { ...state, loading: false })
  ),
  on(deleteTodo, (state, { id }) =>
    todoAdapter.removeOne(id, state)  // optimistic removal
  ),
  on(deleteTodoFail, (state, { todo }) =>
    todoAdapter.addOne(todo, state)   // rollback on failure
  )
);

// createFeature — bundles reducer + auto-generated selectors
const todosFeature = createFeature({
  name: 'todos',
  reducer: todoReducer,
  extraSelectors: ({ selectTodosState, selectEntities }) => ({
    selectDoneTodos: createSelector(selectEntities, entities =>
      Object.values(entities).filter(t => t?.done)
    )
  })
});

// Effect with optimistic update + rollback
@Injectable()
class TodoEffects {
  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTodo),
      mergeMap(({ id }) =>
        this.api.delete(id).pipe(
          map(() => deleteTodoSuccess({ id })),
          catchError(() => {
            const original = this.store.selectSnapshot(todosFeature.selectEntities)[id];
            return of(deleteTodoFail({ todo: original! })); // rollback
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private api: TodoApiService,
    private store: Store
  ) {}
}

// MEMOIZED SELECTOR FOOTGUN:
// createSelector memoizes by reference equality on inputs
// If an input selector returns a new object/array reference on each call → never memoizes
const selectFiltered = createSelector(
  selectAllTodos,
  (todos) => todos.filter(t => t.done) // new array every time! downstream selectors re-run
);
// FIX: combine filtering into a single selector level, or use distinctUntilChanged()

EVALUATION CRITERIA:
✓ NgRx Store — global, predictable, time-travel debug; overhead for small features
✓ ComponentStore — local state within a component tree; no global actions/effects
✓ SignalStore (@ngrx/signals) — signal-based, fine-grained, no subscription overhead
✓ EntityAdapter normalizes collections; removes boilerplate CRUD operations
✓ Optimistic update: dispatch action that mutates state immediately, rollback on error
✓ createFeature auto-generates feature selector and per-property selectors
✓ Memoized selectors: inputs checked by reference — object spread breaks memoization
✓ Effects tap into action stream; handle async, side-effects, and API calls
*/


// ============================================
// QUESTION 39: Angular CDK — Virtual Scrolling and Drag-Drop
// ============================================
/*
QUESTION:
Explain how CdkVirtualScrollViewport works and when you should use it vs
regular *ngFor. Build a virtual scroll list with dynamic item heights.
Then show a drag-drop list using CdkDragDrop with cross-list transfer.

TRICKY PART: How does itemSize relate to DOM rendering? What happens with
variable-height items? Why does moveItemInArray mutate the array and why
does this matter for OnPush components?
*/

/*
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

// === VIRTUAL SCROLLING ===
@Component({
  selector: 'app-virtual-list',
  standalone: true,
  imports: [ScrollingModule],
  template: `
    <!-- Fixed-size virtual scroll — itemSize is the height of each item in px -->
    <cdk-virtual-scroll-viewport itemSize="50" style="height: 400px">
      <div *cdkVirtualFor="let item of items; trackBy: trackById" style="height: 50px">
        {{ item.name }}
      </div>
    </cdk-virtual-scroll-viewport>

    <!-- Variable-size items require AutoSizeVirtualScrollStrategy (experimental) -->
  `
})
class VirtualListComponent {
  items = Array.from({ length: 100000 }, (_, i) => ({ id: i, name: `Item ${i}` }));
  trackById = (_: number, item: any) => item.id;
  // Only ~8-10 DOM nodes exist at a time regardless of items array size
}

// === DRAG & DROP ===
@Component({
  selector: 'app-drag-drop',
  standalone: true,
  imports: [DragDropModule],
  template: `
    <div cdkDropListGroup>
      <div cdkDropList [cdkDropListData]="todo" (cdkDropListDropped)="drop($event)" #todoList="cdkDropList">
        <div *ngFor="let item of todo" cdkDrag>{{ item }}</div>
      </div>
      <div cdkDropList [cdkDropListData]="done" (cdkDropListDropped)="drop($event)" #doneList="cdkDropList">
        <div *ngFor="let item of done" cdkDrag>{{ item }}</div>
      </div>
    </div>
  `
})
class DragDropComponent {
  todo = ['Task A', 'Task B', 'Task C'];
  done = ['Task D'];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      // Reorder within same list — MUTATES the array in place
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Move between lists — MUTATES both arrays
      transferArrayItem(event.previousContainer.data, event.container.data,
        event.previousIndex, event.currentIndex);
    }
    // TRICKY: moveItemInArray mutates — OnPush won't detect this!
    // FIX: spread to new array reference to trigger OnPush change detection
    this.todo = [...this.todo];
    this.done = [...this.done];
  }
}

EVALUATION CRITERIA:
✓ CdkVirtualScrollViewport renders only visible items — O(1) DOM size regardless of data
✓ itemSize must match CSS height — mismatch causes scroll position bugs
✓ *cdkVirtualFor replaces *ngFor inside viewport (not compatible with async pipe directly)
✓ Variable-height items: AutoSizeVirtualScrollStrategy or measure-first approaches
✓ moveItemInArray and transferArrayItem mutate in place — incompatible with OnPush without spreading
✓ cdkDropListGroup enables cross-list connections automatically
✓ cdkDragPreview / cdkDragPlaceholder templates for custom drag appearance
✓ CdkDrag with [cdkDragDisabled] and [cdkDragLockAxis] for constrained dragging
*/


// ============================================
// QUESTION 40: Angular Forms — Dynamic, Typed, and Custom Validators
// ============================================
/*
QUESTION:
Build a dynamic form where fields are added/removed at runtime using FormArray.
Use the strictly-typed forms API (Angular 14+) with FormBuilder.nonNullable.
Implement a cross-field async validator that checks username availability.

TRICKY PART: What is updateOn: 'blur' vs 'change' vs 'submit'? When does an
async validator run relative to sync validators? What is the difference between
FormGroup status 'INVALID', 'PENDING', 'DISABLED'?
*/

/*
import { FormBuilder, FormArray, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { of, timer } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

@Component({ selector: 'app-dynamic-form', standalone: true, imports: [ReactiveFormsModule] })
class DynamicFormComponent {
  private fb = inject(FormBuilder);

  // Strictly-typed form — FormBuilder.nonNullable prevents null values
  form = this.fb.nonNullable.group({
    username: ['', {
      validators: [Validators.required, Validators.minLength(3)],
      asyncValidators: [this.usernameValidator()],
      updateOn: 'blur'  // async validator fires only on blur — avoids per-keystroke API calls
    }],
    emails: this.fb.nonNullable.array([
      this.fb.nonNullable.control('', [Validators.required, Validators.email])
    ])
  });

  // Typed accessor — emails is FormArray<FormControl<string>>
  get emails(): FormArray {
    return this.form.controls.emails;
  }

  addEmail() {
    this.emails.push(this.fb.nonNullable.control('', [Validators.required, Validators.email]));
  }

  removeEmail(index: number) {
    this.emails.removeAt(index);
  }

  // Async validator — debounced API call
  usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);
      return timer(300).pipe( // debounce
        switchMap(() =>
          inject(UserService).checkUsername(control.value).pipe(
            map(taken => taken ? { usernameTaken: true } : null),
            catchError(() => of(null)) // don't block on API errors
          )
        )
      );
    };
  }

  // STATUS flow:
  // PENDING — async validator is running
  // INVALID — sync validator failed, or async returned error
  // VALID   — all validators passed
  // DISABLED — control is disabled (excluded from parent validity/value)

  // Sync validators run first; async validators run ONLY if sync passes
  // updateOn: 'blur' defers validation trigger from 'valueChanges' to 'blur' event
}

EVALUATION CRITERIA:
✓ FormBuilder.nonNullable creates controls typed as T (not T | null)
✓ Typed forms: form.value and form.getRawValue() are fully typed
✓ FormArray for dynamic fields — push/removeAt for add/remove
✓ updateOn: 'blur' prevents async validator per-keystroke — crucial for API-based validators
✓ Async validators run only after sync validators pass — short-circuit evaluation
✓ PENDING status: component should show spinner while async validates
✓ Cross-field validator on FormGroup: validates multiple controls together
✓ setErrors(null) on AbstractControl clears errors — needed in custom validators
*/


// ============================================
// QUESTION 41: Angular Testing — Advanced Scenarios
// ============================================
/*
QUESTION:
Show how to test a component that uses: the Router, HttpClient, Signals,
and a custom directive. Explain the difference between NO_ERRORS_SCHEMA,
CUSTOM_ELEMENTS_SCHEMA, and shallow rendering. When do you need compileComponents()?

TRICKY PART: How do you test a component with input() (signal-based)?
What is the difference between fixture.detectChanges() and tick()?
*/

/*
import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('UserComponent', () => {
  let fixture: ComponentFixture<UserComponent>;
  let component: UserComponent;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserComponent, // standalone component — just import it directly
        // NO_ERRORS_SCHEMA — ignores unknown elements/attributes (too permissive)
        // CUSTOM_ELEMENTS_SCHEMA — allows custom elements only (for web components)
      ],
      providers: [
        provideRouter([{ path: 'profile/:id', component: UserComponent }]),
        provideHttpClient(),
        provideHttpClientTesting() // overrides HttpClient with testing harness
      ]
    }).compileComponents(); // needed when component has templateUrl or styleUrls

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => httpMock.verify()); // assert no outstanding HTTP requests

  it('loads user on init', fakeAsync(() => {
    fixture.detectChanges(); // triggers ngOnInit

    const req = httpMock.expectOne('/api/users/1');
    req.flush({ id: 1, name: 'Alice' }); // mock response

    tick(); // advance microtask queue (flushes Observable emissions)
    fixture.detectChanges(); // update DOM after async state change

    const nameEl = fixture.debugElement.query(By.css('[data-testid="name"]'));
    expect(nameEl.nativeElement.textContent).toContain('Alice');
  }));

  // Testing signal-based inputs (Angular 17.1+)
  it('reacts to input signal changes', () => {
    // ComponentRef.setInput() sets signal-based inputs in tests
    fixture.componentRef.setInput('userId', 42);
    fixture.detectChanges();
    expect(component.userId()).toBe(42);
  });

  // Testing with Router navigation
  it('redirects on missing user', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne('/api/users/1').flush('', { status: 404, statusText: 'Not Found' });
    flush(); // flush all pending timers/microtasks
    fixture.detectChanges();
    expect(router.url).toBe('/not-found');
  }));
});

// KEY DISTINCTIONS:
// detectChanges() — runs CD synchronously
// tick(ms) — advances fake timer by ms
// flush() — advances timers until none remain (no specific time)
// fakeAsync wraps tests so time can be controlled

EVALUATION CRITERIA:
✓ Standalone component testing: just import the component itself in imports[]
✓ provideHttpClientTesting() replaces real HttpClient; HttpTestingController intercepts
✓ httpMock.verify() catches unexpected or unmatched HTTP requests
✓ fixture.componentRef.setInput() for signal-based input() testing
✓ fakeAsync/tick — synchronous test of asynchronous code
✓ flush() drains all async queues (better than tick(10000))
✓ By.css / By.directive for querying debug elements
✓ compileComponents() needed for external template/style files
*/


// ============================================
// QUESTION 42: Internationalization (i18n) — Deep Dive
// ============================================
/*
QUESTION:
Explain Angular's built-in i18n vs @ngx-translate. How does AOT compilation
affect i18n? What is the difference between i18n attribute and $localize tag?
Show pluralization and select ICU expressions. How do you handle RTL layouts?

TRICKY PART: Angular's built-in i18n requires a separate build per locale.
$localize() works at runtime. When would you prefer each approach?
*/

/*
// === BUILT-IN ANGULAR i18n ===
// Template markup — extracted by ng extract-i18n → messages.xlf
// <h1 i18n="@@welcomeTitle">Welcome</h1>
// <p i18n="description|Shown on home page@@homeDesc">Find what you need.</p>

// Pluralization with ICU expression
// <span i18n>
//   {itemCount, plural,
//     =0 {No items}
//     =1 {One item}
//     other {{{itemCount}} items}
//   }
// </span>

// Select (gender / type)
// <span i18n>
//   {user.gender, select,
//     male {He liked it}
//     female {She liked it}
//     other {They liked it}
//   }
// </span>

// === $localize tag — runtime or compile-time ===
import '@angular/localize/init';

const greeting = $localize`:@@greeting:Hello, ${userName}:INTERPOLATION:!`;
// Can be runtime-replaced without rebuild — useful for lazy loading translations

// === angular.json multi-locale build ===
// "configurations": {
//   "fr": { "localize": ["fr"], "baseHref": "/fr/" },
//   "ar": { "localize": ["ar"], "baseHref": "/ar/" }
// }
// ng build --configuration=fr,ar  → separate output per locale

// RTL SUPPORT
@Component({ template: '<div [dir]="rtl ? \'rtl\' : \'ltr\'">...</div>' })
class RtlComponent {
  rtl = inject(LOCALE_ID).startsWith('ar') || inject(LOCALE_ID).startsWith('he');
  // Use CSS logical properties: margin-inline-start instead of margin-left
  // padding-block, border-inline-end, inset-inline-start
}

// Pipes use locale automatically:
// {{ price | currency:'USD' }}  → locale-aware formatting
// {{ date | date:'long' }}      → locale-aware date

EVALUATION CRITERIA:
✓ Built-in i18n: compile-time replacement — fastest runtime, one build per locale
✓ $localize: runtime replacement — single build, lazy load translations
✓ ng extract-i18n scans templates and $localize calls → XLIFF/XMB/JSON
✓ ICU expressions: plural/select handle grammatical variations in template
✓ LOCALE_ID token provides current locale — use for runtime locale detection
✓ RTL: dir attribute + CSS logical properties (not directional margin/padding)
✓ Pipes (date, currency, number, percent) are locale-aware automatically
✓ @angular/localize/init must be imported early (polyfill/main.ts) for $localize
*/


// ============================================
// QUESTION 43: Micro-Frontend Integration with Angular
// ============================================
/*
QUESTION:
How do you implement a micro-frontend architecture using Angular Elements
and Module Federation? What are the trade-offs of each approach? Show how to
expose an Angular component as a custom element and load it from another app.

TRICKY PART: What happens to dependency versioning (Angular itself) when two
micro-frontends use different versions? How does zone.js conflict manifest?
*/

/*
// === ANGULAR ELEMENTS (Web Components) ===
import { createCustomElement } from '@angular/elements';
import { ApplicationRef, createApplication } from '@angular/core';

@Component({
  selector: 'mfe-button',
  standalone: true,
  template: `<button (click)="clicked.emit()">{{ label }}</button>`
})
class MfeButtonComponent {
  label = input.required<string>();
  clicked = output<void>();
}

async function bootstrap() {
  const appRef = await createApplication({
    providers: [/* app providers ]
  });

  const ButtonElement = createCustomElement(MfeButtonComponent, {
    injector: appRef.injector
  });
  customElements.define('mfe-button', ButtonElement);
}

bootstrap();

// Consumer (any framework or plain HTML):
// <mfe-button label="Click me" (clicked)="handleClick()"></mfe-button>
// In React: <mfe-button label="Click" ref={el => el?.addEventListener('clicked', cb)} />

// === MODULE FEDERATION (Webpack 5) ===
// webpack.config.js in remote app:
// plugins: [new ModuleFederationPlugin({
//   name: 'remoteApp',
//   filename: 'remoteEntry.js',
//   exposes: { './UserModule': './src/app/user/user.module.ts' },
//   shared: { '@angular/core': { singleton: true, strictVersion: true } }
// })]

// Host app dynamic import:
// loadRemoteModule({ remoteEntry: 'http://remote/remoteEntry.js', remoteName: 'remoteApp', exposedModule: './UserModule' })

// ZONE.JS CONFLICT:
// Two Angular MFEs each importing zone.js → patched twice → double CD cycles
// FIX: set singleton: true in Module Federation shared config for zone.js
// OR: migrate one/both MFEs to zoneless (provideExperimentalZonelessChangeDetection)

// VERSION CONFLICT:
// Angular itself must be singleton — incompatible versions crash at runtime
// Use strictVersion: true in federation shared config to fail fast on mismatch

EVALUATION CRITERIA:
✓ Angular Elements wraps component as native Custom Element (W3C standard)
✓ Custom Elements work in any framework or plain HTML — true interoperability
✓ @Input() maps to attributes; @Output() maps to CustomEvent on the element
✓ Module Federation: host dynamically loads remote chunks at runtime
✓ shared: { singleton: true } ensures one instance of Angular/zone.js across MFEs
✓ Zone.js double-patch causes infinite CD loops — must be singleton
✓ createApplication() (Angular 14+) replaces deprecated createCustomElement injector pattern
✓ Trade-off: Elements = heavy (full Angular runtime per element); Federation = shared runtime
*/


// ============================================
// QUESTION 44: Custom Structural Directives — Deep Dive
// ============================================
/*
QUESTION:
Build a *appPermission structural directive that conditionally renders
content based on user roles. Show the desugared form. Implement both
the else template and a context variable. Explain TemplateRef vs ViewContainerRef.

TRICKY PART: How does the directive know which ng-template the asterisk (*) creates?
What is the microsyntax and how does it parse? What is $implicit?
*/

/*
import { Directive, Input, TemplateRef, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';

interface PermissionContext<T = unknown> {
  $implicit: T;           // value bound to let-variable without explicit name
  appPermission: T;       // same as microsyntax: let item; — both work
  hasPermission: boolean;
}

@Directive({
  selector: '[appPermission]',
  standalone: true
})
class PermissionDirective<T> implements OnChanges {
  @Input() appPermission!: string | string[];      // required roles
  @Input() appPermissionElse?: TemplateRef<void>;  // microsyntax: *appPermission="'admin'; else noAccess"
  @Input() appPermissionThen?: TemplateRef<PermissionContext<T>>;

  private authService = inject(AuthService);
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<PermissionContext<T>>,  // the * template
    private vcr: ViewContainerRef                             // where to insert/remove
  ) {}

  static ngTemplateContextGuard<T>(
    dir: PermissionDirective<T>,
    ctx: unknown
  ): ctx is PermissionContext<T> { return true; }

  ngOnChanges(): void {
    const allowed = this.check();

    if (allowed && !this.hasView) {
      this.vcr.createEmbeddedView(
        this.appPermissionThen ?? this.templateRef,
        { $implicit: this.appPermission, appPermission: this.appPermission, hasPermission: true }
      );
      this.hasView = true;
    } else if (!allowed) {
      this.vcr.clear();
      this.hasView = false;
      if (this.appPermissionElse) {
        this.vcr.createEmbeddedView(this.appPermissionElse);
      }
    }
  }

  private check(): boolean {
    const roles = Array.isArray(this.appPermission) ? this.appPermission : [this.appPermission];
    return roles.every(r => this.authService.hasRole(r));
  }
}

// USAGE MICROSYNTAX:
// *appPermission="'admin'; else noAccess"
// → desugars to:
// <ng-template [appPermission]="'admin'" [appPermissionElse]="noAccess">...</ng-template>
// <ng-template #noAccess><p>Access denied</p></ng-template>

// Context variable:
// *appPermission="roles; let perm"
// → let perm binds to context.$implicit

// ngTemplateContextGuard provides type safety for the let- variables in the template

EVALUATION CRITERIA:
✓ * microsyntax creates an ng-template and passes the directive as attribute
✓ TemplateRef = the view blueprint (the * template DOM)
✓ ViewContainerRef = anchor where views are inserted/removed
✓ createEmbeddedView(templateRef, context) instantiates the template
✓ $implicit is the unnamed let- binding; named bindings use the keyName convention
✓ ngTemplateContextGuard gives template type-checking for context variables
✓ appPermissionElse input follows Angular's naming convention (directive selector + 'Else')
✓ Multiple inputs use extended microsyntax with semicolons
*/


// ============================================
// QUESTION 45: Angular DevTools and Profiling
// ============================================
/*
QUESTION:
What does Angular DevTools provide that Chrome DevTools alone cannot?
How do you use the component tree, injector tree, and profiler?
Identify a change detection cycle that is unnecessarily expensive
and show how to diagnose and fix it.

TRICKY PART: What is "check duration" in the profiler? Why do some
components show as checked even when their inputs didn't change?
What is the flame graph telling you?
*/

/*
// Angular DevTools (Chrome extension) provides:
// 1. Component Tree — hierarchical view of all live Angular components
//    - Shows each component's inputs, state, and change detection status
//    - Click a component → inspect its properties in real time

// 2. Injector Tree — visualizes the DI hierarchy
//    - Shows which providers are registered at each level
//    - Useful for debugging "No provider found" or wrong instance issues

// 3. Profiler — records CD cycles
//    - Flame graph: each bar = one component's check duration
//    - Width = time spent; colour intensity = relative cost
//    - "Source of change" tells what triggered the CD cycle

// DIAGNOSING EXPENSIVE CD:
// Problem: large list component re-checks 500 items every 200ms
// DevTools profiler shows check duration ~80ms per cycle

// STEP 1: Enable profiler in Angular DevTools
// STEP 2: Click "Record" then perform the action
// STEP 3: Look for wide bars in the flame graph

// COMMON CAUSES of unnecessary checks:
// 1. Component using Default change detection instead of OnPush
//    FIX: changeDetection: ChangeDetectionStrategy.OnPush

// 2. Template expression calls a function (new reference each check):
//    BAD:  {{ getItems() }}           — called on every CD cycle
//    GOOD: {{ items }}                — use a property or Signal
//    GOOD: {{ items | pureTransformPipe }}  — pure pipes are memoized

// 3. Observable returning new object reference (breaks OnPush):
//    BAD:  data$ = this.store.select(state => ({ ...state.data }))  — new ref every time
//    GOOD: data$ = this.store.select(selectData)  — memoized selector

// 4. Zone.js triggered by third-party library:
//    FIX: NgZone.runOutsideAngular(() => { thirdPartyLib.init(); })

// 5. @Input() receives new object reference (shallow equality fails):
//    FIX: Immutable data + memoized selectors + OnPush

// NgZone.isInAngularZone() — check if code runs inside Angular zone
// ApplicationRef.tick() — manually trigger a full CD cycle

/*
EVALUATION CRITERIA:
✓ DevTools profiler shows per-component check duration (not just total frame time)
✓ "Source of change" identifies what triggered the CD cycle
✓ Pure pipes are memoized — replace function calls in templates
✓ OnPush breaks CD on reference equality failure for @Input
✓ Store selectors must be memoized — avoid inline projectors that create new objects
✓ runOutsideAngular for third-party integrations that pollute Zone
✓ Function calls in templates run on every check — costly for large lists
✓ Signals eliminate the need for CD profiling in signal-driven components
*/
