import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservar.html',
  styleUrl: './reservar.css'
})
export class ReservarComponent implements OnInit {
  @Output() backToHome = new EventEmitter<void>();
  
  @Input() servicioFijo: string = ''; 
  @Input() esPromo: boolean = false; 
  
  // Recibe los datos de la cita si venimos desde "Modificar"
  @Input() datosEdicion: any = null; 

  fechaMinima: string;

  servicios = ['Manicure', 'Pedicure', 'Corte de Cabello', 'Coloración', 'Tratamiento Facial', 'Manicure + Pedicure'];
  
  horarios = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', 
    '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  detallesPromociones: { [key: string]: { descripcion: string, descuento: string } } = {
    'Manicure + Pedicure': { descripcion: '2x1 en servicios de manicure y pedicure', descuento: '50%' },
    'Tratamiento Facial': { descripcion: 'Descuento especial en tratamientos faciales', descuento: '30%' },
    'Coloración': { descripcion: 'Promoción especial en servicios de coloración', descuento: '25%' },
    'Manicure': { descripcion: 'Descuento especial en Manicure', descuento: '15%' }
  };

  textoPromoActual: string = '';
  porcentajePromoActual: string = '';

  nuevaCita = {
    servicio: '',
    fecha: '',
    hora: '',
    notas: ''
  };

  constructor() {
    this.fechaMinima = new Date().toISOString().split('T')[0];
    this.nuevaCita.fecha = this.fechaMinima;
  }

  ngOnInit() {
    // modificando una cita existente
    if (this.datosEdicion) {
      this.nuevaCita = {
        servicio: this.datosEdicion.servicio,
        fecha: this.formatearFechaParaInput(this.datosEdicion.fecha),
        hora: this.datosEdicion.hora,
        notas: this.datosEdicion.notas || ''
      };
    } 
    // Es una reserva nueva (con o sin promo)
    else if (this.servicioFijo) {
      this.nuevaCita.servicio = this.servicioFijo;
      
      if (this.esPromo) {
        const promo = this.detallesPromociones[this.servicioFijo];
        if (promo) {
          this.textoPromoActual = promo.descripcion;
          this.porcentajePromoActual = promo.descuento;
        }
      }
    }
  }

  
  private formatearFechaParaInput(fechaTexto: string): string {
   
    if (fechaTexto.includes('-') && fechaTexto.length === 10) return fechaTexto;
    
    
    return this.fechaMinima;
  }

  regresar() {
    this.backToHome.emit();
  }

  confirmarReserva() {
    if (!this.nuevaCita.servicio || !this.nuevaCita.hora) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }

    if (this.datosEdicion) {
      // Lógica de Modificación
      console.log('Cita modificada:', this.nuevaCita);
      alert(`¡Cita de ${this.nuevaCita.servicio} actualizada con éxito!`);
    } else {
      // Lógica de Reserva nueva
      console.log('Reserva realizada:', this.nuevaCita);
      alert(`¡Cita para ${this.nuevaCita.servicio} agendada con éxito!`);
    }
    
    this.regresar();
  }
}