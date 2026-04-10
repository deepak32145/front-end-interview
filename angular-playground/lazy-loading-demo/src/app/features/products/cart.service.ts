import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, scan } from 'rxjs/operators';
import { Product } from './products.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

export type CartAction =
  | { type: 'ADD';    product: Product }
  | { type: 'REMOVE'; productId: number }
  | { type: 'REVERT'; productId: number }; // rollback optimistic add

@Injectable({ providedIn: 'root' })
export class CartService {
  /**
   * Stream of actions — components dispatch actions here.
   * scan() below accumulates them into cart state.
   */
  private action$ = new BehaviorSubject<CartAction | null>(null);

  /**
   * scan() is like Array.reduce but for streams.
   * Every action emission reduces into the accumulated cart items array.
   */
  items$ = this.action$.pipe(
    scan((cart: CartItem[], action) => {
      if (!action) return cart;

      switch (action.type) {
        case 'ADD': {
          const existing = cart.find(i => i.product.id === action.product.id);
          if (existing) {
            return cart.map(i =>
              i.product.id === action.product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            );
          }
          return [...cart, { product: action.product, quantity: 1 }];
        }

        case 'REMOVE':
          return cart.filter(i => i.product.id !== action.productId);

        case 'REVERT':
          // Called when stock-check confirms out-of-stock after optimistic add
          return cart.filter(i => i.product.id !== action.productId);

        default:
          return cart;
      }
    }, [] as CartItem[])
  );

  total$ = this.items$.pipe(
    map(items => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0))
  );

  count$ = this.items$.pipe(
    map(items => items.reduce((sum, i) => sum + i.quantity, 0))
  );

  add(product: Product) {
    this.action$.next({ type: 'ADD', product });
  }

  remove(productId: number) {
    this.action$.next({ type: 'REMOVE', productId });
  }

  revert(productId: number) {
    this.action$.next({ type: 'REVERT', productId });
  }
}
