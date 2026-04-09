import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CitaResena {
  servicio: string;
  fecha: string;
  estilista: string;
  completada: boolean;
  resenada: boolean;
}

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resenas.html',
  styleUrl: './resenas.css'
})
export class ResenasComponent {
  @Output() backToHome = new EventEmitter<void>();

  
  mostrarModal: boolean = false;
  citaSeleccionada: CitaResena | null = null;
  
  // Datos del Formulario
  nuevaCalificacion: number = 0;
  nuevoComentario: string = '';

  //  Citas
  misCitas: CitaResena[] = [
    { servicio: 'Corte de cabello', fecha: '14 de marzo de 2026', estilista: 'Ana Martínez', completada: true, resenada: true },
    { servicio: 'Manicure', fecha: '9 de marzo de 2026', estilista: 'Carmen López', completada: true, resenada: false },
    { servicio: 'Tratamiento facial', fecha: '4 de marzo de 2026', estilista: 'Ana Martínez', completada: false, resenada: false }
  ];

  // Lista de reseñas
  resenasPublicas = [
    { cliente: 'María González', servicio: 'Coloración', estilista: 'Ana Martínez', estrellas: 5, comentario: '¡Excelente servicio! Ana es muy profesional y el resultado quedó increíble. Definitivamente regresaré.', fecha: '19 de marzo de 2026' },
    { cliente: 'Laura Ramírez', servicio: 'Manicure + Pedicure', estilista: 'Carmen López', estrellas: 5, comentario: 'Me encantó la atención al detalle. El lugar es muy limpio y el servicio es excelente.', fecha: '17 de marzo de 2026' },
    { cliente: 'Sofía Hernández', servicio: 'Corte de cabello', estilista: 'Ana Martínez', estrellas: 4, comentario: 'Muy buen corte, justo lo que pedí. Ana es muy amable.', fecha: '15 de marzo de 2026' },
    { cliente: 'Patricia Torres', servicio: 'Tratamiento facial', estilista: 'Carmen López', estrellas: 5, comentario: 'Mi piel quedó increíble después del tratamiento. Súper relajante.', fecha: '12 de marzo de 2026' }
  ];

  regresar(): void {
    this.backToHome.emit();
  }

  abrirModal(cita: CitaResena): void {
    this.citaSeleccionada = cita;
    this.nuevaCalificacion = 0;
    this.nuevoComentario = '';
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.citaSeleccionada = null;
  }

  seleccionarEstrellas(n: number): void {
    this.nuevaCalificacion = n;
  }

  enviarResena(): void {
    if (this.citaSeleccionada) {
      this.citaSeleccionada.resenada = true;
      console.log('Reseña guardada:', {
        servicio: this.citaSeleccionada.servicio,
        estrellas: this.nuevaCalificacion,
        comentario: this.nuevoComentario
      });
      this.cerrarModal();
    }
  }
}