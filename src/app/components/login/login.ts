import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  
  @Output() onLogin = new EventEmitter<void>();          // Usuario/Cliente
  @Output() onAdminLogin = new EventEmitter<void>();     // Administrador
  @Output() onEstilistaLogin = new EventEmitter<void>(); // Estilista Normal
  @Output() onRequirePasswordChange = new EventEmitter<void>(); // Primer ingreso del estilista
  @Output() onNavigate = new EventEmitter<string>();     // Registro / Otros
  
  // <-- NUEVO: Evento para cuando olvidan la contraseña
  @Output() onOlvidePassword = new EventEmitter<void>(); 

  email: string = '';
  pass: string = '';

  iniciarSesion() {
    // Validación de campos vacíos
    if (!this.email || !this.pass) {
      alert('Por favor, ingresa tus credenciales');
      return;
    }

    const emailLower = this.email.toLowerCase();

    // Acceso por rol
    if (emailLower.includes('@admin')) {
      console.log('Accediendo como Administrador...');
      this.onAdminLogin.emit(); // admin
    } 
    else if (emailLower.includes('@estilista')) {
      
      // ==========================================
      // LÓGICA DE PRIMER INGRESO (SIMULADA)
      // ==========================================
      // En un entorno real, tu backend devolvería si el usuario tiene "debeCambiarPassword: true".
      // Aquí simulamos que "123456" es la contraseña provisional que asigna el admin.
      const debeCambiarPassword = (this.pass === '123456');

      if (debeCambiarPassword) {
        console.log('Requiere cambio de contraseña obligatorio...');
        this.onRequirePasswordChange.emit(); // Enviamos al estilista a cambiar su clave
      } else {
        console.log('Accediendo como Estilista...');
        this.onEstilistaLogin.emit(); // Estilista con clave ya actualizada
      }

    } 
    else {
      console.log('Accediendo como Cliente...');
      this.onLogin.emit(); // cliente 
    }
  }

  irARegistro() {
    this.onNavigate.emit('registro');
  }

  // <-- ACTUALIZADO: Ahora emite el evento en lugar de mostrar la alerta
  irAOlvide() {
    this.onOlvidePassword.emit();
  }
}