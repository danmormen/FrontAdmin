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
  fechaNacimiento: string;
  password?: string;
  debeCambiarPassword?: boolean; // <-- NUEVA BANDERA AGREGADA
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

  // A los empleados de prueba les ponemos 'false' para que no se bloqueen al hacer pruebas
  empleados: Empleado[] = [
    { id: 1, nombre: 'Ana', apellido: 'Martínez', rol: 'Estilista', especialidades: 'Corte, Coloración, Tratamiento Facial', telefono: '+502 1234-5678', email: 'ana@ponteguapa.com', estado: 'Activo', fechaNacimiento: '1990-05-15', debeCambiarPassword: false },
    { id: 2, nombre: 'Carmen', apellido: 'López', rol: 'Estilista', especialidades: 'Manicure, Pedicure', telefono: '+502 8765-4321', email: 'carmen@ponteguapa.com', estado: 'Activo', fechaNacimiento: '1995-10-22', debeCambiarPassword: false }
  ];

  mostrarModal = false;
  editando = false;
  empleadoForm: Empleado = this.getNuevoEmpleado();

  mostrarModalPassword = false;
  empleadoPasswordActual: string = '';
  nuevaPassword = '';

  getNuevoEmpleado(): Empleado {
    // Al crear un empleado nuevo, obligamos a que cambie la contraseña (true)
    return { 
      id: 0, nombre: '', apellido: '', rol: 'Estilista', especialidades: '', 
      telefono: '', email: '', estado: 'Activo', fechaNacimiento: '', 
      password: '', debeCambiarPassword: true 
    };
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
    if (this.empleadoForm.fechaNacimiento) {
      const anio = parseInt(this.empleadoForm.fechaNacimiento.split('-')[0], 10);
      if (anio > 9999) {
        alert('Por favor, ingresa un año de nacimiento válido (máximo 4 dígitos).');
        return; 
      }
    }

    if (!this.editando) {
      if (!this.empleadoForm.password || this.empleadoForm.password.trim().length < 6) {
        alert('Por favor, asigna una contraseña de al menos 6 caracteres para el nuevo empleado.');
        return;
      }
    }

    if (this.editando) {
      const index = this.empleados.findIndex(e => e.id === this.empleadoForm.id);
      if (index !== -1) {
        const empActual = this.empleados[index];
        // Respetamos la bandera y contraseña que ya tenía
        this.empleados[index] = { ...this.empleadoForm, password: empActual.password, debeCambiarPassword: empActual.debeCambiarPassword };
      }
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

  abrirModalPassword(emp: Empleado) {
    this.empleadoPasswordActual = `${emp.nombre} ${emp.apellido}`;
    this.nuevaPassword = ''; 
    this.mostrarModalPassword = true;
  }

  cerrarModalPassword() {
    this.mostrarModalPassword = false;
    this.nuevaPassword = '';
  }

  guardarPassword() {
    if (this.nuevaPassword.trim().length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    console.log(`Actualizando contraseña para ${this.empleadoPasswordActual}:`, this.nuevaPassword);
    alert(`Contraseña actualizada correctamente para ${this.empleadoPasswordActual}`);
    this.cerrarModalPassword();
  }

  cerrarSesion() {
    this.logout.emit();
  }
}