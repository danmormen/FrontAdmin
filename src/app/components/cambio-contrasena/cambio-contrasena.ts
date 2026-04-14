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

  private apiUrl = 'http://localhost:3000/api/usuarios'; // Ajusta a tu URL de backend
  
  nuevaPassword = '';
  confirmarPassword = '';
  errorMsg = '';
  usuarioId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Recuperamos el ID del usuario que se acaba de loguear
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.usuarioId = user.id;
    }

    if (!this.usuarioId) {
      this.errorMsg = 'Error de sesión. Por favor, intenta loguearte de nuevo.';
    }
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  guardarPassword() {
    this.errorMsg = '';

    // 1. Validaciones de cliente
    if (!this.usuarioId) {
      this.errorMsg = 'No se encontró el ID del usuario.';
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

    // 2. Llamada al servidor (usamos PATCH porque solo actualizamos un campo)
    // Usamos el mismo endpoint que creamos para el administrador, pero para el usuario actual
    this.http.patch(`${this.apiUrl}/${this.usuarioId}/cambiar-password`, 
      { password: this.nuevaPassword }, 
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => {
        console.log('Contraseña actualizada en DB');
        alert('Contraseña actualizada con éxito. ¡Bienvenido!');
        this.onPasswordChanged.emit();
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.errorMsg = err.error?.error || 'No se pudo actualizar la contraseña en el servidor.';
      }
    });
  }

  cancelar() {
    this.onCancel.emit();
  }
}