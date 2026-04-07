import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number; // en minutos
  estado: 'Activo' | 'Inactivo';
}

@Component({
  selector: 'app-servicios-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios-admin.html',
  styleUrls: ['./servicios-admin.css']
})
export class ServiciosAdminComponent {
  @Output() backToAdmin = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  servicios: Servicio[] = [
    { id: 1, nombre: 'Manicure', descripcion: 'Cuidado completo de uñas de las manos', precio: 200, duracion: 45, estado: 'Activo' },
    { id: 2, nombre: 'Pedicure', descripcion: 'Cuidado completo de uñas de los pies', precio: 250, duracion: 60, estado: 'Activo' },
    { id: 3, nombre: 'Corte de cabello', descripcion: 'Corte personalizado según tu estilo', precio: 280, duracion: 45, estado: 'Activo' },
    { id: 4, nombre: 'Coloración', descripcion: 'Coloración completa del cabello', precio: 500, duracion: 120, estado: 'Activo' },
    { id: 5, nombre: 'Tratamiento facial', descripcion: 'Limpieza profunda y cuidado de la piel', precio: 400, duracion: 90, estado: 'Activo' }
  ];

  mostrarModal = false;
  editando = false;
  servicioForm: Servicio = this.getNuevoServicio();

  getNuevoServicio(): Servicio {
    return { id: 0, nombre: '', descripcion: '', precio: 0, duracion: 0, estado: 'Activo' };
  }

  abrirModalNuevo() {
    this.editando = false;
    this.servicioForm = this.getNuevoServicio();
    this.mostrarModal = true;
  }

  abrirModalEditar(serv: Servicio) {
    this.editando = true;
    this.servicioForm = { ...serv };
    this.mostrarModal = true;
  }

  guardarServicio() {
    if (this.editando) {
      const index = this.servicios.findIndex(s => s.id === this.servicioForm.id);
      if (index !== -1) this.servicios[index] = this.servicioForm;
    } else {
      this.servicioForm.id = Date.now();
      this.servicios.push(this.servicioForm);
    }
    this.mostrarModal = false;
  }

  eliminarServicio(id: number) {
    if(confirm('¿Seguro que deseas eliminar este servicio?')) {
      this.servicios = this.servicios.filter(s => s.id !== id);
    }
  }

  cerrarSesion() {
    this.logout.emit();
  }
}