import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstilistaNavbarComponent } from '../estilista-navbar/estilista-navbar';

interface Notificacion {
  id: number;
  tipo: 'nueva-cita' | 'cancelada' | 'confirmada' | 'recordatorio' | 'resena';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
}

@Component({
  selector: 'app-notificacion-estilista',
  standalone: true,
  imports: [CommonModule, EstilistaNavbarComponent],
  templateUrl: './notificacion-estilista.html',
  styleUrls: ['./notificacion-estilista.css']
})
export class NotificacionEstilistaComponent {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();

  notificaciones: Notificacion[] = [
    {
      id: 1,
      tipo: 'nueva-cita',
      titulo: 'Nueva cita agendada',
      mensaje: 'María González ha reservado un corte de cabello para mañana a las 09:00',
      fecha: '24 mar 2026, 08:30',
      leida: false
    },
    {
      id: 2,
      tipo: 'cancelada',
      titulo: 'Cita cancelada',
      mensaje: 'La cita de Pedro Ramírez para el tratamiento facial ha sido cancelada',
      fecha: '23 mar 2026, 15:45',
      leida: false
    },
    {
      id: 3,
      tipo: 'confirmada',
      titulo: 'Cita confirmada',
      mensaje: 'Ana Martínez confirmó su cita de coloración para hoy a las 10:00',
      fecha: '24 mar 2026, 07:00',
      leida: true
    },
    {
      id: 4,
      tipo: 'recordatorio',
      titulo: 'Recordatorio de cita',
      mensaje: 'Tienes una cita con Laura Rodríguez en 30 minutos - Manicure',
      fecha: '23 mar 2026, 12:30',
      leida: true
    },
    {
      id: 5,
      tipo: 'resena',
      titulo: 'Nueva reseña recibida',
      mensaje: 'Sofía López dejó una reseña de 5 estrellas para tu servicio de tratamiento facial',
      fecha: '22 mar 2026, 18:20',
      leida: true
    }
  ];

  get sinLeerCount(): number {
    return this.notificaciones.filter(n => !n.leida).length;
  }

  marcarComoLeida(id: number) {
    const notif = this.notificaciones.find(n => n.id === id);
    if (notif) notif.leida = true;
  }

  eliminarNotificacion(id: number) {
    this.notificaciones = this.notificaciones.filter(n => n.id !== id);
  }

  onNavigate(dest: string) { this.navigate.emit(dest); }
  onLogout() { this.logout.emit(); }
}