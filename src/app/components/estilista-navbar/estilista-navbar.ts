import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type EstilistaNavSection =
  | 'inicio'
  | 'agenda'
  | 'detalle'
  | 'horario'
  | 'resenas'
  | 'notificaciones'
  | 'perfil';

@Component({
  selector: 'app-estilista-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estilista-navbar.html',
  styleUrl: './estilista-navbar.css'
})
export class EstilistaNavbarComponent {
  @Input() active: EstilistaNavSection = 'inicio';

  @Output() navigate = new EventEmitter<string>();
  @Output() logout   = new EventEmitter<void>();

  private rutas: Record<EstilistaNavSection, string> = {
    inicio:         'estilista',
    agenda:         'citas-estilista',
    detalle:        'detalle-citas',
    horario:        'horario-estilista',
    resenas:        'resenas-estilista',
    notificaciones: 'notificacion-estilista',
    perfil:         'perfil-estilista'
  };

  goTo(section: EstilistaNavSection): void {
    this.navigate.emit(this.rutas[section]);
  }

  cerrarSesion(): void {
    this.logout.emit();
  }
}
