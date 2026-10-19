import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Product, CATEGORIES } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, FormsModule, CurrencyPipe],
  template: `
    <div class="hero rounded-4 p-4 mb-4">
      <h2 class="mb-1"><i class="bi bi-box-seam me-2"></i>Gestion des produits</h2>
      <p class="mb-0 opacity-75">Ajouter, consulter, modifier et supprimer les produits du magasin.</p>
    </div>

    <div class="card card-box p-3 mb-3">
      <div class="row g-2 align-items-center">
        <div class="col-md-6">
          <input class="form-control" placeholder="Rechercher (nom, marque)..."
                 [(ngModel)]="search" (ngModelChange)="load()">
        </div>
        <div class="col-md-3">
          <select class="form-select" [(ngModel)]="category" (ngModelChange)="load()">
            <option value="">Toutes les catégories</option>
            @for (c of categories; track c) { <option [value]="c">{{ c }}</option> }
          </select>
        </div>
        <div class="col-md-3 text-md-end">
          <a class="btn btn-primary" routerLink="/products/new">
            <i class="bi bi-plus-lg me-1"></i>Nouveau produit
          </a>
        </div>
      </div>
    </div>

    @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }
    @if (message()) { <div class="alert alert-success">{{ message() }}</div> }

    <div class="card card-box">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>#</th><th></th><th>Nom</th><th>Marque</th><th>Catégorie</th>
              <th class="text-end">Prix</th><th class="text-center">Stock</th><th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (p of products(); track p.id) {
              <tr>
                <td>{{ p.id }}</td>
                <td>@if (p.image_url) { <img class="thumb" [src]="p.image_url" alt=""> }</td>
                <td class="fw-semibold">{{ p.name }}</td>
                <td>{{ p.brand }}</td>
                <td><span class="badge text-bg-secondary">{{ p.category }}</span></td>
                <td class="text-end">{{ p.price | currency:'TND ':'code':'1.2-2' }}</td>
                <td class="text-center">
                  @if (p.stock === 0) { <span class="badge text-bg-danger">Rupture</span> }
                  @else if (p.stock < 5) { <span class="badge text-bg-warning">{{ p.stock }}</span> }
                  @else { <span class="badge text-bg-success">{{ p.stock }}</span> }
                </td>
                <td class="text-end text-nowrap">
                  <a class="btn btn-sm btn-outline-info me-1" [routerLink]="['/products', p.id]" title="Consulter">
                    <i class="bi bi-eye"></i></a>
                  <a class="btn btn-sm btn-outline-primary me-1" [routerLink]="['/products', p.id, 'edit']" title="Modifier">
                    <i class="bi bi-pencil"></i></a>
                  <button class="btn btn-sm btn-outline-danger" (click)="remove(p)" title="Supprimer">
                    <i class="bi bi-trash"></i></button>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="8" class="text-center text-muted py-4">
                {{ loading() ? 'Chargement...' : 'Aucun produit trouvé' }}
              </td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal('');
  message = signal('');
  search = '';
  category = '';
  categories = CATEGORIES;

  constructor(private service: ProductService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.service.getAll(this.search, this.category).subscribe({
      next: (data) => { this.products.set(data); this.loading.set(false); },
      error: () => {
        this.error.set('Impossible de contacter le backend (http://localhost:5000).');
        this.loading.set(false);
      }
    });
  }

  remove(p: Product) {
    if (!confirm(`Supprimer « ${p.name} » ?`)) return;
    this.service.delete(p.id!).subscribe({
      next: () => { this.message.set(`Produit « ${p.name} » supprimé.`); this.load(); },
      error: () => this.error.set('Erreur lors de la suppression.')
    });
  }
}
