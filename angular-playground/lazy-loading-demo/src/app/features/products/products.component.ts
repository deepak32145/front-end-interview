import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { Product, ProductsService } from './products.service';
import { CartItem, CartService } from './cart.service';

export interface ProductVM extends Product {
  adding?: boolean;
  error?: string;
}

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  form!: FormGroup;
  products$!: Observable<ProductVM[]>;
  searching = false;

  categories = ['all', 'electronics', 'books', 'furniture'];

  cartItems$!:  Observable<CartItem[]>;
  cartTotal$!:  Observable<number>;
  cartCount$!:  Observable<number>;

  cardState: Record<number, { adding: boolean; error: string | null }> = {};

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Wire cart streams here — service is safely initialized by this point
    this.cartItems$ = this.cartService.items$;
    this.cartTotal$ = this.cartService.total$;
    this.cartCount$ = this.cartService.count$;

    this.form = this.fb.group({
      search:   [''],
      category: ['all'],
    });

    const search$   = this.form.get('search')!.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged()
    );

    const category$ = this.form.get('category')!.valueChanges.pipe(
      startWith('all'),
      distinctUntilChanged()
    );

    /**
     * combineLatest emits whenever EITHER search OR category changes.
     * switchMap cancels in-flight search if new values arrive before response.
     */
    this.products$ = combineLatest([search$, category$]).pipe(
      tap(() => { this.searching = true; }),
      switchMap(([search, category]) =>
        this.productsService.search(search, category).pipe(
          map(res => res.results as ProductVM[]),
          catchError(() => of([] as ProductVM[]))
        )
      ),
      tap(() => { this.searching = false; })
    );
  }

  addToCart(product: ProductVM): void {
    if (this.cardState[product.id]?.adding) return;

    // 1. Optimistic add — item appears in cart immediately
    this.cartService.add(product);
    this.cardState[product.id] = { adding: true, error: null };

    // 2. PATCH /api/products/:id/cart — decrements stock on server
    //    409 means out of stock → revert the optimistic add
    this.productsService.addToCart(product.id).subscribe({
      next: (res) => {
        product.stock = res.stock;
        this.cardState[product.id] = { adding: false, error: null };
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.cartService.revert(product.id);
        const msg = err.status === 409
          ? `Out of stock! Only ${err.error.stock} left.`
          : 'Failed to add. Please try again.';
        this.cardState[product.id] = { adding: false, error: msg };
        this.cdr.markForCheck();
      },
    });
  }

  removeFromCart(productId: number): void {
    this.cartService.remove(productId);
  }
}
