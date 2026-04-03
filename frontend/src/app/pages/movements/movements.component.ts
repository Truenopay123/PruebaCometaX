import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovementService, Movement } from '../../core/services/movement.service';
import { ProductService, Product } from '../../core/services/product.service';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movements.component.html',
  styleUrl: './movements.component.scss'
})
export class MovementsComponent implements OnInit {
  movements: Movement[] = [];
  products: Product[] = [];
  showForm = false;

  form: Movement = {
    product_id: '',
    type: 'entry',
    quantity: 1,
    note: ''
  };

  constructor(
    private movementService: MovementService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadMovements();
    this.loadProducts();
  }

  loadMovements() {
    this.movementService.getAll().subscribe(data => this.movements = data);
  }

  loadProducts() {
    this.productService.getAll(true).subscribe(data => this.products = data);
  }

  getProductName(id: string): string {
    const product = this.products.find(p => p.id === id);
    return product ? product.name : 'Desconocido';
  }

  openForm() {
    this.form = { product_id: '', type: 'entry', quantity: 1, note: '' };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  saveMovement() {
    if (!this.form.product_id) return;
    this.movementService.create(this.form).subscribe(() => {
      this.loadMovements();
      this.loadProducts();
      this.closeForm();
    });
  }
}
