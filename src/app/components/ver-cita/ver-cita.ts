import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Cita {
  servicio: string;
  fecha: string;
  hora: string;
  estilista: string;
  estado: 'Confirmada' | 'Pendiente';
}

@Component({
  selector: 'app-ver-cita',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-cita.html',
  styleUrl: './ver-cita.css'
})
export class VerCitaComponent {
  @Output() backToHome = new EventEmitter<void>();
  @Output() modificar  = new EventEmitter<Cita>();
  @Output() logout     = new EventEmitter<void>();

  listaCitas: Cita[] = [
    { 
      servicio: 'Corte de cabello', 
      fecha: 'Martes, 24 De Marzo De 2026', 
      hora: '10:00', 
      estilista: 'Ana Martínez', 
      estado: 'Confirmada' 
    },
    { 
      servicio: 'Manicure + Pedicure', 
      fecha: 'Viernes, 27 De Marzo De 2026', 
      hora: '15:00', 
      estilista: 'Carmen López', 
      estado: 'Pendiente' 
    }
  ];

  regresar() {
    this.backToHome.emit();
  }

  cerrarSesion() {
    this.logout.emit();
  }

  onModificar(cita: Cita) {
    this.modificar.emit(cita);
  }

  onCancelar(cita: Cita) {
    if(confirm(`¿Estás seguro de cancelar tu cita de ${cita.servicio}?`)) {
      console.log('Cita cancelada');
    }
  }

  onConfirmar(cita: Cita) {
    alert('¡Cita confirmada con éxito!');
    cita.estado = 'Confirmada';
  }
}