import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-cambio-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cambio-contrasena.html',
  styleUrls: ['./cambio-contrasena.css']
})
export class CambioContrasenaComponent implements OnInit {
  @Output() onPasswordChanged = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  private apiUrl = 'http://localhost:3000/api/usuarios'; 
  
  nuevaPassword = '';
  confirmarPassword = '';
  errorMsg = '';
  usuarioId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Recuperamos el ID del usuario desde el localStorage
    const userStr = localStorage.getItem('usuario');
    console.log('Datos en LocalStorage al cargar:', userStr);

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.usuarioId = user.id;
        console.log('ID de usuario detectado:', this.usuarioId);
      } catch (error) {
        console.error('Error al parsear el usuario del localStorage:', error);
        this.errorMsg = 'Error al recuperar los datos del usuario. Intenta iniciar sesión nuevamente.';
      }
    }

    if (!this.usuarioId) {
      this.errorMsg = 'Error de sesión. No se encontró tu ID. Intenta loguearte de nuevo.';
    }
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado en localStorage.');
      this.errorMsg = 'Error de autenticación. Intenta iniciar sesión nuevamente.';
      return null;
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  guardarPassword() {
    console.log('Intentando guardar contraseña...');
    this.errorMsg = '';

    // Validaciones básicas
    if (!this.usuarioId) {
      this.errorMsg = 'Error: ID de usuario no válido.';
      return;
    }

    if (this.nuevaPassword.trim().length < 6) {
      this.errorMsg = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.nuevaPassword !== this.confirmarPassword) {
      this.errorMsg = 'Las contraseñas no coinciden.';
      return;
    }

    const headers = this.getHeaders();
    if (!headers) {
      return; // Si no hay headers, detenemos la ejecución
    }

    console.log('Enviando petición PATCH al servidor...');

    // Llamada al servidor
    this.http.patch(`${this.apiUrl}/${this.usuarioId}/cambiar-password`, 
      { password: this.nuevaPassword }, 
      { headers }
    ).subscribe({
      next: (res: any) => {
        console.log('Respuesta del servidor:', res);
        alert('Contraseña actualizada con éxito.');
        // Emitimos el evento al componente padre
        this.onPasswordChanged.emit();
      },
      error: (err) => {
        console.error('Error en la petición PATCH:', err);
        if (err.status === 401) {
          this.errorMsg = 'No autorizado. Verifica tus credenciales.';
        } else if (err.status === 404) {
          this.errorMsg = 'Usuario no encontrado. Intenta iniciar sesión nuevamente.';
        } else if (err.status === 500) {
          this.errorMsg = 'Error interno del servidor. Intenta más tarde.';
        } else {
          this.errorMsg = err.error?.error || 'Error al conectar con el servidor.';
        }
      }
    });
  }

  cancelar() {
    this.onCancel.emit();
  }
}