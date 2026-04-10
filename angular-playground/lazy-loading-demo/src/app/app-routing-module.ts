import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * LAZY LOADING DEMO — App Routes
 *
 * Each feature module is loaded on demand via loadChildren().
 * Angular's build process splits each lazy route into a separate JS chunk.
 * You can verify this in the browser Network tab — navigating to /about,
 * /contact, or /careers will trigger a new XHR request for that chunk.
 */
const routes: Routes = [
  {
    path: '',
    // Home module — loaded lazily even for the default route
    loadChildren: () =>
      import('./features/home/home-module').then((m) => m.HomeModule),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./features/about/about-module').then((m) => m.AboutModule),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./features/contact/contact-module').then((m) => m.ContactModule),
  },
  {
    path: 'careers',
    loadChildren: () =>
      import('./features/careers/careers-module').then((m) => m.CareersModule),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products-module').then((m) => m.ProductsModule),
  },
  {
    path: 'apply',
    loadChildren: () =>
      import('./features/dynamic-forms/dynamic-forms-module').then((m) => m.DynamicFormsModule),
  },
  // Redirect any unknown path back to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
