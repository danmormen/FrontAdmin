import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar-contrasena.html',
  styleUrls: ['./recuperar-contrasena.css']
})
export class RecuperarContrasenaComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSuccess = new EventEmitter<void>();

  pasoActual: number = 1; // 1: Pedir correo, 2: Nueva contraseña
  
  email: string = '';
  nuevaPassword: string = '';
  confirmarPassword: string = '';
  
  errorMsg: string = '';
  successMsg: string = '';

  // PASO 1: Validar el correo
  enviarCodigo() {
    this.errorMsg = '';
    
    if (!this.email || !this.email.includes('@')) {
      this.errorMsg = 'Por favor, ingresa un correo electrónico válido.';
      return;
    }

    // Simulación: aquí harías la petición a tu backend
    this.successMsg = 'Verificando cuenta...';
    
    setTimeout(() => {
      this.successMsg = '';
      this.pasoActual = 2; // Avanzamos al paso de cambiar la contraseña
    }, 1500);
  }

  // PASO 2: Guardar la nueva contraseña
  guardarPassword() {
    this.errorMsg = '';
    
    if (this.nuevaPassword.trim().length < 6) {
      this.errorMsg = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }
    
    if (this.nuevaPassword !== this.confirmarPassword) {
      this.errorMsg = 'Las contraseñas no coinciden. Inténtalo de nuevo.';
      return;
    }

    // Simulación de éxito
    alert('Tu contraseña ha sido restablecida con éxito. Ya puedes iniciar sesión con tu nueva clave.');
    this.onSuccess.emit(); // Lo mandamos de vuelta al login
  }

  cancelar() {
    this.onCancel.emit(); // Vuelve al login sin hacer nada
  }
}