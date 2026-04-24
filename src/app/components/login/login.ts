import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  @Output() onLogin                   = new EventEmitter<void>();
  @Output() onAdminLogin              = new EventEmitter<void>();
  @Output() onEstilistaLogin          = new EventEmitter<void>();
  @Output() onRequirePasswordChange   = new EventEmitter<void>(); // ← Usado por estilistas Y clientes
  @Output() onNavigate                = new EventEmitter<string>();
  @Output() onOlvidePassword          = new EventEmitter<void>();

  email    = '';
  pass     = '';
  cargando = false;

  constructor(private http: HttpClient) {}

  iniciarSesion() {
    if (!this.email || !this.pass) {
      alert('Por favor, ingresa tus credenciales');
      return;
    }

    this.cargando = true;

    const credenciales = { email: this.email, password: this.pass };

    this.http.post('http://localhost:3000/api/auth/login', credenciales).subscribe({
      next: (respuesta: any) => {
        this.cargando = false;
        console.log('Login exitoso:', respuesta);

        // Guardamos token para futuras peticiones
        localStorage.setItem('token', respuesta.token);

        // Guardamos datos del usuario incluyendo requiere_cambio
        localStorage.setItem('usuario', JSON.stringify({
          id:              respuesta.id,
          nombre:          respuesta.nombre,
          rol:             respuesta.rol,
          requiere_cambio: respuesta.requiere_cambio // ← Guardamos para usarlo en cambio-contrasena
        }));

        const rol             = respuesta.rol;
        const requiereCambio  = respuesta.requiere_cambio === 1 || respuesta.requiere_cambio === true;

        // ── Redirección según rol y estado de contraseña ──────────
        if (rol === 'admin') {
          // El admin nunca necesita cambiar contraseña desde aquí
          this.onAdminLogin.emit();

        } else if (rol === 'estilista') {
          if (requiereCambio) {
            // Estilista nuevo con contraseña asignada por el admin
            console.log('Estilista nuevo: redirigiendo a cambio de contraseña');
            this.onRequirePasswordChange.emit();
          } else {
            this.onEstilistaLogin.emit();
          }

        } else {
          // Cliente
          if (requiereCambio) {
            // Cliente que usó contraseña temporal de recuperación
            console.log('Cliente con contraseña temporal: redirigiendo a cambio de contraseña');
            this.onRequirePasswordChange.emit();
          } else {
            this.onLogin.emit();
          }
        }
      },
      error: (errorRes) => {
        this.cargando = false;
        console.error('Error en el login:', errorRes);
        if (errorRes.status === 401) {
          alert(errorRes.error?.message || 'Correo o contraseña incorrectos.');
        } else {
          alert('Error de conexión. Asegúrate de que el servidor esté encendido.');
        }
      }
    });
  }

  irARegistro() {
    this.onNavigate.emit('registro');
  }

  irAOlvide() {
    this.onOlvidePassword.emit();
  }
}