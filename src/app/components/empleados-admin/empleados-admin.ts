import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  rol: 'Administrador' | 'Estilista';
  especialidades: string;
  telefono: string;
  email: string;
  estado: 'Activo' | 'Inactivo';
}

@Component({
  selector: 'app-empleados-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleados-admin.html',
  styleUrls: ['./empleados-admin.css']
})
export class EmpleadosAdminComponent {
  @Output() backToAdmin = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  empleados: Empleado[] = [
    { id: 1, nombre: 'Ana', apellido: 'Martínez', rol: 'Estilista', especialidades: 'Corte, Coloración, Tratamiento Facial', telefono: '+502 1234-5678', email: 'ana@ponteguapa.com', estado: 'Activo' },
    { id: 2, nombre: 'Carmen', apellido: 'López', rol: 'Estilista', especialidades: 'Manicure, Pedicure', telefono: '+502 8765-4321', email: 'carmen@ponteguapa.com', estado: 'Activo' }
  ];

  mostrarModal = false;
  editando = false;
  empleadoForm: Empleado = this.getNuevoEmpleado();

  getNuevoEmpleado(): Empleado {
    return { id: 0, nombre: '', apellido: '', rol: 'Estilista', especialidades: '', telefono: '', email: '', estado: 'Activo' };
  }

  abrirModalNuevo() {
    this.editando = false;
    this.empleadoForm = this.getNuevoEmpleado();
    this.mostrarModal = true;
  }

  abrirModalEditar(emp: Empleado) {
    this.editando = true;
    this.empleadoForm = { ...emp }; 
    this.mostrarModal = true;
  }

  guardarEmpleado() {
    if (this.editando) {
      const index = this.empleados.findIndex(e => e.id === this.empleadoForm.id);
      if (index !== -1) this.empleados[index] = this.empleadoForm;
    } else {
      this.empleadoForm.id = Date.now();
      this.empleados.push(this.empleadoForm);
    }
    this.mostrarModal = false;
  }

  eliminarEmpleado(id: number) {
    if(confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      this.empleados = this.empleados.filter(e => e.id !== id);
    }
  }

  cerrarSesion() {
    this.logout.emit();
  }
}