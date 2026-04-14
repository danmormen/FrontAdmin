import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Empleado {
  id: number;
  nombre: string;
  apellido?: string; 
  email: string;
  password?: string;
  telefono: string;
  rol: 'admin' | 'estilista' | 'cliente';
  especialidad: string;
  fecha_nacimiento: string;
  activo: boolean | number;
}

@Component({
  selector: 'app-empleados-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleados-admin.html',
  styleUrls: ['./empleados-admin.css']
})
export class EmpleadosAdminComponent implements OnInit {
  @Output() backToAdmin = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  private apiUrl = 'http://localhost:3000/api/usuarios'; 
  empleados: Empleado[] = [];
  
  mostrarModal = false;
  editando = false;
  empleadoForm: Empleado = this.getNuevoEmpleado();

  mostrarModalPassword = false;
  idUsuarioPassword: number = 0;
  empleadoPasswordActual: string = '';
  nuevaPassword = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.cargarEmpleados();
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getNuevoEmpleado(): Empleado {
    return { 
      id: 0, 
      nombre: '', 
      apellido: '', 
      email: '', 
      password: '', 
      telefono: '+502 ', 
      rol: 'estilista', 
      especialidad: '', 
      fecha_nacimiento: '', 
      activo: 1 
    };
  }

  // --- LÓGICA DE MÁSCARA PARA TELÉFONO ---
  onTelefonoInput(event: any) {
    let numeros = event.target.value.replace(/\D/g, ''); 
    if (numeros.length > 8) numeros = numeros.substring(0, 8);

    let formateado = '';
    if (numeros.length > 4) {
      formateado = `${numeros.substring(0, 4)}-${numeros.substring(4)}`;
    } else {
      formateado = numeros;
    }

    this.empleadoForm.telefono = `+502 ${formateado}`;
    event.target.value = formateado;
  }

  // --- CARGA DE DATOS ---
  cargarEmpleados() {
    this.http.get<Empleado[]>(this.apiUrl, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          this.empleados = res;
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          console.error('Error al cargar:', err);
          alert('Error al obtener la lista de empleados.');
        }
      });
  }

  abrirModalNuevo() {
    this.editando = false;
    this.empleadoForm = this.getNuevoEmpleado();
    this.mostrarModal = true;
  }

  // --- EDICIÓN (CON CORRECCIÓN DE FECHA Y NOMBRE) ---
  abrirModalEditar(emp: Empleado) {
    this.editando = true;
    
    // Clonamos el objeto para no ensuciar la lista de la tabla mientras editamos
    const tempEmp = { ...emp };

    // 1. Limpiar la Fecha (CRÍTICO para el input type="date")
    // Cortamos "YYYY-MM-DDThh:mm..." a solo "YYYY-MM-DD"
    if (tempEmp.fecha_nacimiento) {
      tempEmp.fecha_nacimiento = tempEmp.fecha_nacimiento.substring(0, 10);
    }

    // 2. Separar Nombre y Apellido
    const nombreCompleto = (tempEmp.nombre || '').trim();
    const indexEspacio = nombreCompleto.indexOf(' ');

    if (indexEspacio !== -1) {
      tempEmp.nombre = nombreCompleto.substring(0, indexEspacio);
      tempEmp.apellido = nombreCompleto.substring(indexEspacio + 1);
    } else {
      tempEmp.apellido = ''; 
    }

    this.empleadoForm = tempEmp;
    this.mostrarModal = true;
  }

  guardarEmpleado() {
    if (!this.empleadoForm.nombre || !this.empleadoForm.email) {
      alert('Nombre y Correo son obligatorios.');
      return;
    }

    if (this.empleadoForm.telefono.length < 14) {
      alert('El teléfono debe tener 8 números (formato xxxx-xxxx).');
      return;
    }

    const payload = {
      ...this.empleadoForm,
      nombre: this.empleadoForm.apellido 
              ? `${this.empleadoForm.nombre.trim()} ${this.empleadoForm.apellido.trim()}`
              : this.empleadoForm.nombre.trim(),
      activo: this.empleadoForm.activo ? 1 : 0
    };

    if (this.editando) {
      this.http.put(`${this.apiUrl}/${this.empleadoForm.id}`, payload, { headers: this.getHeaders() })
        .subscribe({
          next: () => {
            alert('Empleado actualizado correctamente');
            this.cerrarYRefrescar();
          },
          error: (err) => alert('Error al actualizar: ' + (err.error?.error || 'Error desconocido'))
        });
    } else {
      if (!this.empleadoForm.password || this.empleadoForm.password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      this.http.post(this.apiUrl, payload, { headers: this.getHeaders() })
        .subscribe({
          next: () => {
            alert('Empleado creado con éxito');
            this.cerrarYRefrescar();
          },
          error: (err) => alert('Error al crear: ' + (err.error?.error || 'Error desconocido'))
        });
    }
  }

  eliminarEmpleado(id: number) {
    if(confirm('¿Estás seguro de eliminar a este empleado?')) {
      this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
        .subscribe({
          next: () => {
            alert('Usuario eliminado');
            this.cargarEmpleados();
          },
          error: (err) => alert('Error al eliminar')
        });
    }
  }

  // --- PASSWORD Y UTILIDADES ---
  abrirModalPassword(emp: Empleado) {
    this.idUsuarioPassword = emp.id;
    this.empleadoPasswordActual = emp.nombre;
    this.nuevaPassword = ''; 
    this.mostrarModalPassword = true;
  }

  guardarPassword() {
    if (this.nuevaPassword.trim().length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    this.http.patch(`${this.apiUrl}/${this.idUsuarioPassword}/cambiar-password`, 
      { password: this.nuevaPassword }, 
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        alert('Contraseña actualizada correctamente');
        this.cerrarModalPassword();
      },
      error: (err) => alert('Error al cambiar contraseña')
    });
  }

  cerrarYRefrescar() {
    this.mostrarModal = false; 
    this.editando = false;
    this.empleadoForm = this.getNuevoEmpleado();
    this.cargarEmpleados();
  }

  cerrarModalPassword() {
    this.mostrarModalPassword = false;
    this.nuevaPassword = '';
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.logout.emit();
  }
}