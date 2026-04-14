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
  
  @Output() onLogin = new EventEmitter<void>();          
  @Output() onAdminLogin = new EventEmitter<void>();     
  @Output() onEstilistaLogin = new EventEmitter<void>(); 
  @Output() onRequirePasswordChange = new EventEmitter<void>(); 
  @Output() onNavigate = new EventEmitter<string>();     
  @Output() onOlvidePassword = new EventEmitter<void>(); 

  email: string = '';
  pass: string = '';
  cargando: boolean = false; 

  constructor(private http: HttpClient) {}

  iniciarSesion() {
    if (!this.email || !this.pass) {
      alert('Por favor, ingresa tus credenciales');
      return;
    }

    this.cargando = true;

    const credenciales = {
      email: this.email,
      password: this.pass
    };

    // Llamada al endpoint que actualizamos en authController.js
    this.http.post('http://localhost:3000/api/auth/login', credenciales)
      .subscribe({
        next: (respuesta: any) => {
          this.cargando = false;
          console.log('Login exitoso:', respuesta);

          // 1. Guardamos el Token para futuras peticiones con interceptores
          localStorage.setItem('token', respuesta.token);

          // 2. GUARDADO CRÍTICO: Guardamos el ID que viene del backend.
          
          localStorage.setItem('usuario', JSON.stringify({
            id: respuesta.id,
            nombre: respuesta.nombre,
            rol: respuesta.rol
          }));

          // 3. Redirección basada en el flag 'requiere_cambio' que añadimos al Backend
          const rol = respuesta.rol;

          if (rol === 'admin') {
            this.onAdminLogin.emit();
          } 
          else if (rol === 'estilista') {
            // flag que viene de la base de datos
            if (respuesta.requiere_cambio === 1 || respuesta.requiere_cambio === true) {
              console.log('Usuario nuevo detectado: Redirigiendo a cambio de contraseña');
              this.onRequirePasswordChange.emit();
            } else {
              this.onEstilistaLogin.emit();
            }
          } 
          else {
            this.onLogin.emit(); // Clientes
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