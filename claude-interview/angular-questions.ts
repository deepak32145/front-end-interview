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
