import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promociones.html',
  styleUrl: './promociones.css'
})
export class PromocionesComponent {
  @Output() backToHome = new EventEmitter<void>();
  @Output() seleccionarPromo = new EventEmitter<string>();

  promociones = [
    { 
      porcentaje: 50, 
      servicio: 'Manicure + Pedicure', 
      descripcion: '2x1 en servicios de manicure y pedicure', 
      precioOriginal: 'Q450', 
      precioPromo: 'Q225' 
    },
    { 
      porcentaje: 30, 
      servicio: 'Tratamiento Facial', 
      descripcion: 'Descuento especial en tratamientos faciales', 
      precioOriginal: 'Q400', 
      precioPromo: 'Q280' 
    },
    { 
      porcentaje: 25, 
      servicio: 'Coloración', 
      descripcion: 'Promoción especial en servicios de coloración', 
      precioOriginal: 'Q500', 
      precioPromo: 'Q375' 
    }
  ];

  regresar() {
    this.backToHome.emit();
  }

  irAReservar(nombreServicio: string) {
    this.seleccionarPromo.emit(nombreServicio);
  }
}