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
  // Definimos las salidas para que el componente padre (App) sepa a dónde ir
  @Output() onLogin = new EventEmitter<void>();          // Usuario/Cliente
  @Output() onAdminLogin = new EventEmitter<void>();     // Administrador
  @Output() onEstilistaLogin = new EventEmitter<void>(); // Estilista
  @Output() onNavigate = new EventEmitter<string>();     // Registro / Otros

  email: string = '';
  pass: string = '';

  iniciarSesion() {
    // Validamos que los campos no estén vacíos
    if (!this.email || !this.pass) {
      alert('Por favor, ingresa tus credenciales');
      return;
    }

    const emailLower = this.email.toLowerCase();

    // Lógica de ruteo por "rol" basado en el texto del correo
    if (emailLower.includes('@admin')) {
      console.log('Accediendo como Administrador...');
      this.onAdminLogin.emit(); 
    } 
    else if (emailLower.includes('@estilista')) {
      console.log('Accediendo como Estilista...');
      this.onEstilistaLogin.emit(); // Emitimos el evento de estilista
    } 
    else {
      console.log('Accediendo como Cliente...');
      this.onLogin.emit();
    }
  }

  irARegistro() {
    this.onNavigate.emit('registro');
  }

  irAOlvide() {
    alert('Función de recuperación en desarrollo');
  }
}