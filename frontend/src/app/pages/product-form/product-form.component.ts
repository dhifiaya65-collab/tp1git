import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CATEGORIES, Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <a routerLink="/products" class="btn btn-link px-0 mb-2"><i class="bi bi-arrow-left"></i> Retour à la liste</a>

    <div class="card card-box p-4">
      <h3 class="mb-3">{{ editId ? 'Modifier le produit' : 'Ajouter un produit' }}</h3>

      @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }

      <form #f="ngForm" (ngSubmit)="save(f.valid === true)" novalidate>
        <div class="row g-3">
          <div class="col-md-8">
            <label class="form-label">Nom *</label>
            <input class="form-control" name="name" [(ngModel)]="product.name" required maxlength="150"
                   #name="ngModel" [class.is-invalid]="name.invalid && (name.touched || submitted)">
            <div class="invalid-feedback">Le nom est obligatoire.</div>
          </div>
          <div class="col-md-4">
            <label class="form-label">Marque</label>
            <input class="form-control" name="brand" [(ngModel)]="product.brand" maxlength="80">
          </div>
          <div class="col-md-4">
            <label class="form-label">Catégorie</label>
            <select class="form-select" name="category" [(ngModel)]="product.category">
              @for (c of categories; track c) { <option [value]="c">{{ c }}</option> }
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Prix (TND) *</label>
            <input type="number" step="0.01" min="0" class="form-control" name="price"
                   [(ngModel)]="product.price" required #price="ngModel"
                   [class.is-invalid]="price.invalid && (price.touched || submitted)">
            <div class="invalid-feedback">Prix invalide (>= 0).</div>
          </div>
          <div class="col-md-4">
            <label class="form-label">Stock *</label>
            <input type="number" step="1" min="0" class="form-control" name="stock"
                   [(ngModel)]="product.stock" required #stock="ngModel"
                   [class.is-invalid]="stock.invalid && (stock.touched || submitted)">
            <div class="invalid-feedback">Stock invalide (entier >= 0).</div>
          </div>
          <div class="col-12">
            <label class="form-label">URL de l'image</label>
            <input class="form-control" name="image_url" [(ngModel)]="product.image_url" placeholder="https://...">
          </div>
          <div class="col-12">
            <label class="form-label">Description</label>
            <textarea class="form-control" rows="4" name="description" [(ngModel)]="product.description"></textarea>
          </div>
        </div>
        <div class="mt-4">
          <button class="btn btn-primary me-2" type="submit" [disabled]="saving()">
            <i class="bi bi-check-lg me-1"></i>{{ editId ? 'Enregistrer' : 'Ajouter' }}
          </button>
          <a class="btn btn-outline-secondary" routerLink="/products">Annuler</a>
        </div>
      </form>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  categories = CATEGORIES;
  editId: number | null = null;
  submitted = false;
  saving = signal(false);
  error = signal('');
  product: Product = {
    name: '', brand: '', category: CATEGORIES[0], description: '', price: 0, stock: 0, image_url: ''
  };

  constructor(private route: ActivatedRoute, private router: Router, private service: ProductService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id);
      this.service.getOne(this.editId).subscribe({
        next: (p) => (this.product = { ...p }),
        error: () => this.error.set('Produit introuvable.')
      });
    }
  }

  save(valid: boolean) {
    this.submitted = true;
    if (!valid) return;
    this.saving.set(true);
    this.error.set('');
    const req = this.editId
      ? this.service.update(this.editId, this.product)
      : this.service.create(this.product);
    req.subscribe({
      next: (p) => this.router.navigate(['/products', p.id]),
      error: (e) => {
        this.saving.set(false);
        this.error.set(e.error?.errors?.join(' · ') || e.error?.message || 'Erreur lors de l\'enregistrement.');
      }
    });
  }
}
