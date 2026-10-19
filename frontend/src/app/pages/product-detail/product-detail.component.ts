import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  template: `
    <a routerLink="/products" class="btn btn-link px-0 mb-2"><i class="bi bi-arrow-left"></i> Retour à la liste</a>

    @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }

    @if (product(); as p) {
      <div class="card card-box p-4">
        <div class="row g-4">
          <div class="col-md-5">
            @if (p.image_url) { <img class="detail-img" [src]="p.image_url" [alt]="p.name"> }
            @else { <div class="detail-img d-flex align-items-center justify-content-center text-muted" style="height:260px">
              <i class="bi bi-image fs-1"></i></div> }
          </div>
          <div class="col-md-7">
            <span class="badge text-bg-secondary mb-2">{{ p.category }}</span>
            <h2>{{ p.name }}</h2>
            <p class="text-muted">{{ p.brand }}</p>
            <h3 class="text-primary">{{ p.price | currency:'TND ':'code':'1.2-2' }}</h3>
            <p>
              @if (p.stock === 0) { <span class="badge text-bg-danger">Rupture de stock</span> }
              @else { <span class="badge text-bg-success">{{ p.stock }} en stock</span> }
            </p>
            <p>{{ p.description || 'Aucune description.' }}</p>
            <small class="text-muted d-block mb-3">
              Créé le {{ p.created_at | date:'dd/MM/yyyy HH:mm' }}
              · Modifié le {{ p.updated_at | date:'dd/MM/yyyy HH:mm' }}
            </small>
            <a class="btn btn-primary me-2" [routerLink]="['/products', p.id, 'edit']">
              <i class="bi bi-pencil me-1"></i>Modifier</a>
            <button class="btn btn-outline-danger" (click)="remove(p)">
              <i class="bi bi-trash me-1"></i>Supprimer</button>
          </div>
        </div>
      </div>
    }
  `
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  error = signal('');

  constructor(private route: ActivatedRoute, private router: Router, private service: ProductService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getOne(id).subscribe({
      next: (p) => this.product.set(p),
      error: (e) => this.error.set(e.status === 404 ? 'Produit introuvable.' : 'Erreur de chargement.')
    });
  }

  remove(p: Product) {
    if (!confirm(`Supprimer « ${p.name} » ?`)) return;
    this.service.delete(p.id!).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => this.error.set('Erreur lors de la suppression.')
    });
  }
}
