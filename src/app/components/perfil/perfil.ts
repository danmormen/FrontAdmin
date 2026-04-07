import { Component, EventEmitter, Output } from '@angular/core'; // Añadimos Output y EventEmitter
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class PerfilComponent {
  // Evento para regresar a la home
  @Output() backToHome = new EventEmitter<void>();

  usuario = {
    nombre: 'María',
    apellido: 'García',
    email: 'maria.garcia@email.com',
    telefono: '+34 612 345 678',
    iniciales: 'MG'
  };

  // Función para regresar
  regresar() {
    this.backToHome.emit();
  }

  // Por ahora no hace nada, como pediste
  guardarCambios() {
    console.log('Botón guardar cambios presionado (sin acción aún).');
  }
}