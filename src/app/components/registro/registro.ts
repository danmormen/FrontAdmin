import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  @Output() onNavigate = new EventEmitter<string>();

  nombre: string = '';
  apellido: string = '';
  email: string = '';
  pass: string = '';
  fechaNacimiento: string = '';

  // Bloquea cualquier tecla que no sea un número (0-9)
  validarSoloNumeros(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  // Inserta los "/" automáticamente: DD/MM/AAAA
  formatearFecha(event: any) {
    let input = event.target.value.replace(/\D/g, ''); // Limpia letras si intentan pegar texto
    let formatted = '';

    if (input.length > 0) {
      formatted = input.substring(0, 2); // Día
      if (input.length > 2) {
        formatted += '/' + input.substring(2, 4); // Mes
        if (input.length > 4) {
          formatted += '/' + input.substring(4, 8); // Año (máximo 4 dígitos)
        }
      }
    }
    this.fechaNacimiento = formatted;
  }

  registrar() {
    // 1. Validar que la fecha esté completa
    if (this.fechaNacimiento.length < 10) {
      alert('Por favor, ingresa la fecha completa (DD/MM/AAAA)');
      return;
    }

    const [dia, mes, anio] = this.fechaNacimiento.split('/').map(Number);

    // 2. Validaciones de lógica de calendario
    if (dia < 1 || dia > 31) { alert('Día inválido (01-31)'); return; }
    if (mes < 1 || mes > 12) { alert('Mes inválido (01-12)'); return; }

    // 3. Validación de mayoría de edad (En 2026, debe ser 2008 o antes)
    if (anio > 2008) {
      alert('Debes ser mayor de 18 años para registrarte.');
      return;
    }
    if (anio < 1920) {
      alert('Por favor, ingresa un año de nacimiento realista.');
      return;
    }

    // 4. Validar campos vacíos
    if (this.nombre && this.apellido && this.email && this.pass) {
      console.log('Registro exitoso:', { nombre: this.nombre, fecha: this.fechaNacimiento });
      alert('¡Cuenta creada con éxito!');
      this.onNavigate.emit('login');
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }

  irALogin() {
    this.onNavigate.emit('login');
  }
}