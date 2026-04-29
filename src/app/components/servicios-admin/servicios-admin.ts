import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar';

interface Servicio {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number; 
  categoria: 'cabello' | 'uñas' | 'maquillaje' | 'tratamientos' | 'otros';
  imagen?: string;
  activo: boolean | number;
}

@Component({
  selector: 'app-servicios-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbarComponent],
  templateUrl: './servicios-admin.html',
  styleUrls: ['./servicios-admin.css']
})
export class ServiciosAdminComponent implements OnInit {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout   = new EventEmitter<void>();

  private apiUrl = 'http://localhost:3000/api/servicios';
  servicios: Servicio[] = [];
  
  mostrarModal = false;
  editando = false;
  servicioForm: Servicio = this.getNuevoServicio();

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef // Agregado para forzar la vista
  ) {}

  ngOnInit() {
    this.cargarServicios();
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getNuevoServicio(): Servicio {
    return { 
      nombre: '', 
      descripcion: '', 
      precio: 0, 
      duracion: 0, 
      categoria: 'otros',
      activo: 1 
    };
  }

  // --- CARGA DE DATOS (Misma lógica que empleados) ---
  cargarServicios() {
    this.http.get<Servicio[]>(this.apiUrl) // Quitamos headers aquí porque la ruta es pública según tu servicios.js
      .subscribe({
        next: (res) => {
          this.servicios = res;
          this.cdr.detectChanges(); // Forzamos a Angular a pintar los cambios
        },
        error: (err) => {
          console.error('Error al cargar servicios:', err);
          alert('Error al obtener la lista de servicios.');
        }
      });
  }

  abrirModalNuevo() {
    this.editando = false;
    this.servicioForm = this.getNuevoServicio();
    this.mostrarModal = true;
  }

  abrirModalEditar(s: Servicio) {
    this.editando = true;
    // Clonamos para no editar la fila de la tabla directamente
    this.servicioForm = { ...s };
    this.mostrarModal = true;
  }

  guardarServicio() {
    if (!this.servicioForm.nombre || !this.servicioForm.precio || !this.servicioForm.duracion) {
      alert('Nombre, Precio y Duración son obligatorios.');
      return;
    }
    if (this.servicioForm.precio < 0) {
      alert('El precio no puede ser negativo.');
      return;
    }
    if (this.servicioForm.duracion < 1) {
      alert('La duración debe ser de al menos 1 minuto.');
      return;
    }

    const payload = {
      ...this.servicioForm,
      activo: this.servicioForm.activo ? 1 : 0
    };

    if (this.editando) {
      this.http.put(`${this.apiUrl}/${this.servicioForm.id}`, payload, { headers: this.getHeaders() })
        .subscribe({
          next: () => {
            alert('Servicio actualizado correctamente');
            this.cerrarYRefrescar();
          },
          error: (err) => alert('Error al actualizar: ' + (err.error?.error || 'Error desconocido'))
        });
    } else {
      this.http.post(this.apiUrl, payload, { headers: this.getHeaders() })
        .subscribe({
          next: () => {
            alert('Servicio creado con éxito');
            this.cerrarYRefrescar();
          },
          error: (err) => alert('Error al crear: ' + (err.error?.error || 'Error desconocido'))
        });
    }
  }

  eliminarServicio(id: number | undefined) {
    if(!id) return;
    if(confirm('¿Estás seguro de eliminar este servicio?')) {
      this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
        .subscribe({
          next: () => {
            alert('Servicio eliminado');
            this.cargarServicios();
          },
          error: (err) => alert('Error al eliminar')
        });
    }
  }

  cerrarYRefrescar() {
    this.mostrarModal = false; 
    this.editando = false;
    this.servicioForm = this.getNuevoServicio();
    this.cargarServicios();
  }

  onNavigate(dest: string) { this.navigate.emit(dest); }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.logout.emit();
  }
}