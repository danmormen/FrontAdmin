import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstilistaNavbarComponent } from '../estilista-navbar/estilista-navbar';

interface CitaAgendada {
  id: number;
  cliente: string;
  telefono: string;
  servicio: string;
  hora: string;
  duracion: string;
  estado: 'Confirmada' | 'Pendiente' | 'Completada';
}

@Component({
  selector: 'app-citas-estilista',
  standalone: true,
  imports: [CommonModule, EstilistaNavbarComponent],
  templateUrl: './citas-estilista.html',
  styleUrls: ['./citas-estilista.css']
})
export class CitasEstilistaComponent {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout   = new EventEmitter<void>();

  // ── Navegador de día ─────────────────────────────────────────────
  diaOffset = 0; // 0 = hoy, -1 = ayer, +1 = mañana…

  get fechaDia(): Date {
    const d = new Date();
    d.setDate(d.getDate() + this.diaOffset);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  get tituloDia(): string {
    return this.fechaDia.toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).replace(/^\w/, c => c.toUpperCase());
  }

  get esHoy(): boolean { return this.diaOffset === 0; }

  diaAnterior(): void  { this.diaOffset--; }
  diaSiguiente(): void { this.diaOffset++; }
  volverHoy(): void    { this.diaOffset = 0; }

  // ── Citas de muestra ─────────────────────────────────────────────
  citas: CitaAgendada[] = [
    { id: 1, cliente: 'María González',  telefono: '+502 1234-5678', servicio: 'Corte de cabello',   hora: '09:00', duracion: '45 min',  estado: 'Confirmada' },
    { id: 2, cliente: 'Ana Martínez',    telefono: '+502 2345-6789', servicio: 'Coloración',          hora: '10:00', duracion: '120 min', estado: 'Confirmada' },
    { id: 3, cliente: 'Laura Rodríguez', telefono: '+502 3456-7890', servicio: 'Manicure',            hora: '13:00', duracion: '45 min',  estado: 'Pendiente'  },
    { id: 4, cliente: 'Sofía López',     telefono: '+502 4567-8901', servicio: 'Tratamiento facial',  hora: '15:00', duracion: '90 min',  estado: 'Confirmada' },
  ];

  onNavigate(dest: string) { this.navigate.emit(dest); }
  onLogout()               { this.logout.emit(); }
}
