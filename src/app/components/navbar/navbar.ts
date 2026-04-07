import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar', // <--- Este es el "nombre" de tu etiqueta HTML
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  logo = 'Ponte Guapa';
}