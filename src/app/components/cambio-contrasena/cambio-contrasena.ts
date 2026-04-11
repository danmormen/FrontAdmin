import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cambio-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cambio-contrasena.html',
  styleUrls: ['./cambio-contrasena.css']
})
export class CambioContrasenaComponent {
  // Evento que avisa que la clave se cambió con éxito y debe ir al panel
  @Output() onPasswordChanged = new EventEmitter<void>();
  
  // Evento por si el usuario decide no cambiarla y volver al login
  @Output() onCancel = new EventEmitter<void>();

  nuevaPassword = '';
  confirmarPassword = '';
  errorMsg = '';

  guardarPassword() {
    this.errorMsg = ''; // Limpiamos errores previos

    // Validaciones
    if (this.nuevaPassword.trim().length < 6) {
      this.errorMsg = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    if (this.nuevaPassword !== this.confirmarPassword) {
      this.errorMsg = 'Las contraseñas no coinciden. Inténtalo de nuevo.';
      return;
    }

    // Aquí (en el futuro) conectarás con tu servicio para guardar en base de datos
    console.log('Nueva contraseña establecida correctamente.');
    alert('Contraseña actualizada con éxito. ¡Bienvenido a tu panel!');
    
    // Emitimos el evento para entrar a la aplicación
    this.onPasswordChanged.emit();
  }

  cancelar() {
    this.onCancel.emit(); // Vuelve a la pantalla de login
  }
}