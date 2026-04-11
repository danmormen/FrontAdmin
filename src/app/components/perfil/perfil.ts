import { Component, EventEmitter, Output } from '@angular/core'; 
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
  
  @Output() backToHome = new EventEmitter<void>();

  usuario = {
    nombre: 'María',
    apellido: 'García',
    email: 'maria.garcia@email.com',
    telefono: '+34 612 345 678',
    iniciales: 'MG',
    fechaCumpleanos: '1995-08-24' 
  };

  // Función para regresar
  regresar() {
    this.backToHome.emit();
  }

  guardarCambios() {
   
    console.log('Botón guardar cambios presionado. Datos:', this.usuario);
  }
}