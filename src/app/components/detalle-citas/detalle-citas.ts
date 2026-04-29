import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstilistaNavbarComponent } from '../estilista-navbar/estilista-navbar';

interface CitaHoy {
  id: number;
  cliente: string;
  telefono: string;
  servicio: string;
  hora: string;
  duracion: string;
  notas: string;
  estado: 'Pendiente' | 'Confirmada' | 'Completada';
}

@Component({
  selector: 'app-detalle-citas',
  standalone: true,
  imports: [CommonModule, EstilistaNavbarComponent],
  templateUrl: './detalle-citas.html',
  styleUrls: ['./detalle-citas.css']
})
export class DetalleCitasComponent {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout   = new EventEmitter<void>();

  // Citas de hoy (en producción se filtraría por fecha actual desde la API)
  citasHoy: CitaHoy[] = [
    { id: 1, cliente: 'María González',  telefono: '+502 1234-5678', servicio: 'Corte de cabello',  hora: '09:00', duracion: '45 min',  notas: 'Cliente prefiere corte tipo bob',      estado: 'Confirmada' },
    { id: 2, cliente: 'Ana Martínez',    telefono: '+502 2345-6789', servicio: 'Coloración',         hora: '10:00', duracion: '120 min', notas: 'Color rubio miel, tono 8.3',           estado: 'Confirmada' },
    { id: 3, cliente: 'Laura Rodríguez', telefono: '+502 3456-7890', servicio: 'Manicure',           hora: '13:00', duracion: '45 min',  notas: 'Esmalte en gel, diseño minimalista',   estado: 'Pendiente'  },
    { id: 4, cliente: 'Sofía López',     telefono: '+502 4567-8901', servicio: 'Tratamiento facial', hora: '15:00', duracion: '90 min',  notas: '',                                     estado: 'Pendiente'  },
  ];

  get fechaHoy(): string {
    return new Date().toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).replace(/^\w/, c => c.toUpperCase());
  }

  get completadas(): number { return this.citasHoy.filter(c => c.estado === 'Completada').length; }
  get total(): number       { return this.citasHoy.length; }

  marcarCompletada(id: number): void {
    const cita = this.citasHoy.find(c => c.id === id);
    if (cita) cita.estado = 'Completada';
  }

  onNavigate(dest: string) { this.navigate.emit(dest); }
  onLogout()               { this.logout.emit(); }
}
