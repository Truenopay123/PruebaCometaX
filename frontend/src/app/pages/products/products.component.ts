import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../core/services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  showForm = false;
  editingId: string | null = null;

  form: Product = {
    name: '',
    category: 'Electronics',
    price: 0,
    stock: 0,
    min_stock: 10
  };

  categories = ['Electronics', 'Clothing', 'Food', 'Tools', 'Other'];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe(data => this.products = data);
  }

  openForm(product?: Product) {
    if (product) {
      this.editingId = product.id!;
      this.form = { ...product };
    } else {
      this.editingId = null;
      this.form = { name: '', category: 'Electronics', price: 0, stock: 0, min_stock: 10 };
    }
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
  }

  saveProduct() {
    if (this.editingId) {
      this.productService.update(this.editingId, this.form).subscribe(() => {
        this.loadProducts();
        this.closeForm();
      });
    } else {
      this.productService.create(this.form).subscribe(() => {
        this.loadProducts();
        this.closeForm();
      });
    }
  }

  toggleStatus(product: Product) {
    const action = product.is_active
      ? this.productService.deactivate(product.id!)
      : this.productService.activate(product.id!);
    action.subscribe(() => this.loadProducts());
  }

  deleteProduct(id: string) {
    if (confirm('¿Eliminar permanentemente este producto?')) {
      this.productService.delete(id).subscribe(() => this.loadProducts());
    }
  }

  isLowStock(product: Product): boolean {
    return product.stock <= product.min_stock;
  }
}
