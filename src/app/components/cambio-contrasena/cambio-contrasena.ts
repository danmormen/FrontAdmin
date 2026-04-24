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

  nuevaPassword    = '';
  confirmarPassword = '';
  errorMsg         = '';
  usuarioId: number | null = null;
  rol: string = ''; // ← Guardamos el rol para personalizar el mensaje

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Recuperamos los datos del usuario desde localStorage
    const userStr = localStorage.getItem('usuario');
    console.log('Datos en LocalStorage al cargar:', userStr);

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.usuarioId = user.id;
        this.rol       = user.rol || ''; // ← Guardamos el rol (cliente, estilista, admin)
        console.log('ID de usuario detectado:', this.usuarioId, '| Rol:', this.rol);
      } catch (error) {
        console.error('Error al parsear el usuario del localStorage:', error);
        this.errorMsg = 'Error al recuperar los datos del usuario. Intenta iniciar sesión nuevamente.';
      }
    }

    if (!this.usuarioId) {
      this.errorMsg = 'Error de sesión. No se encontró tu ID. Intenta loguearte de nuevo.';
    }
  }

  // ── Mensaje de instrucción personalizado según el rol ─────────────
  // Los estilistas reciben contraseña del admin
  // Los clientes reciben contraseña temporal por correo
  getMensajeInstruccion(): string {
    if (this.rol === 'estilista') {
      return 'Estás ingresando por primera vez. Por motivos de seguridad, debes cambiar la contraseña provisional que te asignó el administrador.';
    }
    return 'Ingresaste con una contraseña temporal. Por seguridad, establece una nueva contraseña para tu cuenta.';
  }

  // ── Construye los headers con el token JWT ────────────────────────
  getHeaders(): HttpHeaders | null {
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

  // ── Guarda la nueva contraseña ────────────────────────────────────
  guardarPassword() {
    console.log('Intentando guardar contraseña...');
    this.errorMsg = '';

    // Validaciones
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
    if (!headers) return;

    console.log('Enviando petición PATCH al servidor...');

    this.http.patch(
      `${this.apiUrl}/${this.usuarioId}/cambiar-password`,
      { password: this.nuevaPassword },
      { headers }
    ).subscribe({
      next: (res: any) => {
        console.log('Respuesta del servidor:', res);
        alert('¡Contraseña actualizada con éxito!');

        // Actualizamos requiere_cambio en localStorage para que
        // el frontend sepa que ya no necesita redirigir al cambio
        const userStr = localStorage.getItem('usuario');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.requiere_cambio = 0;
          localStorage.setItem('usuario', JSON.stringify(user));
        }

        // Emitimos el evento al componente padre para que navegue
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