import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Resena {
  id: number;
  cliente: string;
  servicio: string;
  comentario: string;
  calificacion: number; // 1 al 5
  fecha: string;
}

@Component({
  selector: 'app-resenas-estilista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resenas-estilista.html',
  styleUrls: ['./resenas-estilista.css']
})
export class ResenasEstilistaComponent {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();

  // Datos de ejemplo basados en tu captura
  promedio: number = 4.8;
  totalResenas: number = 5;

  // Distribución de estrellas (estático para el ejemplo)
  estrellasProgreso = [
    { nivel: 5, porcentaje: 80, cantidad: 4 },
    { nivel: 4, porcentaje: 20, cantidad: 1 },
    { nivel: 3, porcentaje: 0, cantidad: 0 },
    { nivel: 2, porcentaje: 0, cantidad: 0 },
    { nivel: 1, porcentaje: 0, cantidad: 0 }
  ];

  resenas: Resena[] = [
    {
      id: 1,
      cliente: 'María González',
      servicio: 'Corte de cabello',
      comentario: 'Excelente trabajo! Muy profesional y atenta a los detalles. El corte quedó perfecto.',
      calificacion: 5,
      fecha: '19 de marzo de 2026'
    },
    {
      id: 2,
      cliente: 'Ana Martínez',
      servicio: 'Coloración',
      comentario: 'Me encantó el color! Exactamente lo que quería. Definitivamente volveré.',
      calificacion: 5,
      fecha: '17 de marzo de 2026'
    },
    {
      id: 3,
      cliente: 'Laura Rodríguez',
      servicio: 'Manicure',
      comentario: 'Muy buen servicio, rápido y limpio. Solo me hubiera gustado más opciones de colores.',
      calificacion: 4,
      fecha: '14 de marzo de 2026'
    }
  ];

  // Genera un array para pintar las estrellas en el HTML
  getStars(rating: number) {
    return Array(5).fill(0).map((_, i) => i < rating);
  }

  onBack() { this.navigate.emit('estilista'); }
  onLogout() { this.logout.emit(); }
}