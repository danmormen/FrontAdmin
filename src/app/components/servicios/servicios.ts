import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Servicio {
  nombre: string;
  descripcion: string;
  precio: string;
  duracion: string;
}

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class ServiciosComponent {
  // Evento para volver a la pantalla de inicio
  @Output() backToHome = new EventEmitter<void>();
  
  // Evento que envía el nombre del servicio en la reserva
  @Output() reservar = new EventEmitter<string>();

  listaServicios: Servicio[] = [
    { 
      nombre: 'Manicure', 
      descripcion: 'Cuidado completo de tus manos con esmaltado profesional.', 
      precio: 'Q200', 
      duracion: '45 min' 
    },
    { 
      nombre: 'Pedicure', 
      descripcion: 'Tratamiento integral para tus pies con acabado perfecto.', 
      precio: 'Q250', 
      duracion: '60 min' 
    },
    { 
      nombre: 'Corte de Cabello', 
      descripcion: 'Corte personalizado según tu estilo y preferencias.', 
      precio: 'Q280', 
      duracion: '45 min' 
    },
    { 
      nombre: 'Coloración', 
      descripcion: 'Coloración profesional con productos de alta calidad.', 
      precio: 'Q500', 
      duracion: '120 min' 
    },
    { 
      nombre: 'Tratamiento Facial', 
      descripcion: 'Limpieza profunda e hidratación para tu rostro.', 
      precio: 'Q400', 
      duracion: '75 min' 
    }
  ];

  
  regresar() {
    this.backToHome.emit();
  }

  
  onReservar(servicio: string) {
    this.reservar.emit(servicio);
  }
}