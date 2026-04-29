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

  nuevaPassword     = '';
  confirmarPassword = '';
  errorMsg          = '';
  usuarioId: number | null = null;
  rol: string = '';

  // UI state
  mostrarNueva     = false;
  mostrarConfirmar = false;
  guardando        = false;
  exito            = false;

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

  // ── Mensaje personalizado según rol ──────────────────────────────
  getMensajeInstruccion(): string {
    if (this.rol === 'estilista') {
      return 'Es tu primer ingreso. Por seguridad debes cambiar la contraseña provisional que te asignó el administrador.';
    }
    return 'Ingresaste con una contraseña temporal. Establece una nueva contraseña para proteger tu cuenta.';
  }

  // ── Indicador de fortaleza ────────────────────────────────────────
  get fortalezaClass(): string {
    const len = this.nuevaPassword.length;
    if (len < 6)  return 'debil';
    if (len < 10) return 'media';
    return 'fuerte';
  }
  get fortalezaAncho(): string {
    const len = this.nuevaPassword.length;
    if (len === 0)  return '0%';
    if (len < 6)   return '33%';
    if (len < 10)  return '66%';
    return '100%';
  }
  get fortalezaTexto(): string {
    const c = this.fortalezaClass;
    if (c === 'debil')  return 'Débil';
    if (c === 'media')  return 'Media';
    return 'Fuerte';
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
    this.errorMsg = '';

    if (!this.usuarioId) {
      this.errorMsg = 'Error de sesión. Intenta iniciar sesión nuevamente.';
      return;
    }
    if (this.nuevaPassword.trim().length < 6) {
      this.errorMsg = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }
    if (this.nuevaPassword !== this.confirmarPassword) {
      this.errorMsg = 'Las contraseñas no coinciden. Verifícalas e intenta de nuevo.';
      return;
    }

    const headers = this.getHeaders();
    if (!headers) return;

    this.guardando = true;

    this.http.patch(
      `${this.apiUrl}/${this.usuarioId}/cambiar-password`,
      { password: this.nuevaPassword },
      { headers }
    ).subscribe({
      next: () => {
        this.guardando = false;
        this.exito     = true;

        // Actualizar localStorage
        const userStr = localStorage.getItem('usuario');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.requiere_cambio = 0;
          localStorage.setItem('usuario', JSON.stringify(user));
        }

        // Navegar después de un breve delay para que el usuario vea el mensaje
        setTimeout(() => this.onPasswordChanged.emit(), 1200);
      },
      error: (err) => {
        this.guardando = false;
        if (err.status === 401) {
          this.errorMsg = 'No autorizado. Verifica tus credenciales.';
        } else if (err.status === 404) {
          this.errorMsg = 'Usuario no encontrado. Intenta iniciar sesión nuevamente.';
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