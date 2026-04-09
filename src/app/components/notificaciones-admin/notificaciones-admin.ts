import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface NotificacionReciente {
  id: number;
  asunto: string;
  mensaje: string;
  destinatarios: string;
  fecha: string;
  enviados: number;
}

@Component({
  selector: 'app-notificaciones-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notificaciones-admin.html',
  styleUrls: ['./notificaciones-admin.css']
})
export class NotificacionesAdminComponent {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();

  // Formulario
  destinatarioSeleccionado: string = 'Todos los clientes';
  correoEspecifico: string = ''; 
  asunto: string = '';
  mensaje: string = '';

  
  historial: NotificacionReciente[] = [
    { id: 1, asunto: 'Promoción especial de marzo', mensaje: 'Aprovecha nuestras promociones...', destinatarios: 'Todos los clientes', fecha: '2026-03-19', enviados: 156 },
    { id: 2, asunto: 'Recordatorio de cita', mensaje: 'Tu cita es mañana a las 10:00 AM', destinatarios: 'Clientes con citas', fecha: '2026-03-23', enviados: 12 },
    { id: 3, asunto: 'Nuevos servicios disponibles', mensaje: 'Descubre nuestros nuevos tratamientos...', destinatarios: 'Todos los clientes', fecha: '2026-03-14', enviados: 156 }
  ];

  enviarNotificacion() {
    const destinoFinal = this.destinatarioSeleccionado === 'Cliente específico (Individual)' 
      ? `Individual: ${this.correoEspecifico}` 
      : this.destinatarioSeleccionado;

    const nueva: NotificacionReciente = {
      id: Date.now(),
      asunto: this.asunto,
      mensaje: this.mensaje,
      destinatarios: destinoFinal,
      fecha: new Date().toISOString().split('T')[0],
      enviados: this.destinatarioSeleccionado === 'Cliente específico (Individual)' ? 1 : 156
    };

    this.historial.unshift(nueva);
    alert(`Notificación enviada con éxito a: ${destinoFinal}`);
    
    // Resetear campos
    this.asunto = '';
    this.mensaje = '';
    this.correoEspecifico = '';
  }

  onBack() { this.navigate.emit('admin'); }
  onLogout() { this.logout.emit(); }
}