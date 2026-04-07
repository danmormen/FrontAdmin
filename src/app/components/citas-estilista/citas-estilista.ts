import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './citas-estilista.html',
  styleUrls: ['./citas-estilista.css']
})
export class CitasEstilistaComponent {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();

  fechaSeleccionada: string = '2026-03-24'; // Fecha visible en la captura

  citas: CitaAgendada[] = [
    { id: 1, cliente: 'María González', telefono: '+502 1234-5678', servicio: 'Corte de cabello', hora: '09:00', duracion: '45 min', estado: 'Confirmada' },
    { id: 2, cliente: 'Ana Martínez', telefono: '+502 2345-6789', servicio: 'Coloración', hora: '10:00', duracion: '120 min', estado: 'Confirmada' },
    { id: 3, cliente: 'Laura Rodríguez', telefono: '+502 3456-7890', servicio: 'Manicure', hora: '13:00', duracion: '45 min', estado: 'Pendiente' },
    { id: 4, cliente: 'Sofía López', telefono: '+502 4567-8901', servicio: 'Tratamiento facial', hora: '15:00', duracion: '90 min', estado: 'Confirmada' }
  ];

  marcarCompletada(id: number) {
    const cita = this.citas.find(c => c.id === id);
    if (cita) {
      cita.estado = 'Completada';
      alert(`Servicio de ${cita.cliente} completado. Ahora el cliente puede calificar el servicio.`);
    }
  }

  onBack() { this.navigate.emit('estilista'); }
  onLogout() { this.logout.emit(); }
}