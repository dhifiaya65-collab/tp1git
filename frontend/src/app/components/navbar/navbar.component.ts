import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand navbar-dark bg-dark sticky-top">
      <div class="container">
        <a class="navbar-brand" routerLink="/products">
          <i class="bi bi-pc-display-horizontal me-2"></i>PC Shop
        </a>
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" routerLink="/products" routerLinkActive="active"
               [routerLinkActiveOptions]="{ exact: true }">Produits</a>
          </li>
          <li class="nav-item">
            <a class="btn btn-primary btn-sm ms-2" routerLink="/products/new">
              <i class="bi bi-plus-lg me-1"></i>Ajouter
            </a>
          </li>
        </ul>
      </div>
    </nav>
  `
})
export class NavbarComponent {}
