import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductsRoutingModule } from './products-routing-module';
import { ProductsComponent } from './products.component';

@NgModule({
  declarations: [ProductsComponent],
  imports: [CommonModule, ReactiveFormsModule, ProductsRoutingModule],
})
export class ProductsModule {}
