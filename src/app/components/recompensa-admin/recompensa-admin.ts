import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-recompensa-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recompensa-admin.html',
  styleUrls: ['./recompensa-admin.css']
})
export class RecompensasAdminComponent {
  @Output() back = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  recompensas = [
    { id: 1, titulo: 'Descuento 10%', descripcion: '10% de descuento en tu próxima visita', puntos: 200, estado: 'Activa', canjes: 45, fecha: '2025-01-14' },
    { id: 2, titulo: 'Descuento 15%', descripcion: '15% de descuento en tu próxima visita', puntos: 400, estado: 'Activa', canjes: 28, fecha: '2025-01-14' },
    { id: 3, titulo: 'Descuento 20%', descripcion: '20% de descuento en tu próxima visita', puntos: 600, estado: 'Activa', canjes: 15, fecha: '2025-01-14' },
    { id: 4, titulo: 'Manicure Gratis', descripcion: 'Manicure de cortesía', puntos: 1000, estado: 'Activa', canjes: 8, fecha: '2025-01-14' },
  ];

  
  mostrarModal: boolean = false;
  esEdicion: boolean = false;
  
  recompensaForm: any = {
    id: null,
    titulo: '',
    descripcion: '',
    puntos: null,
    estado: 'Activa',
    canjes: 0,
    fecha: ''
  };
 // Calculos (KPIS)
  
  get totalRecompensas() {
    return this.recompensas.length;
  }

  get recompensasActivas() {
    return this.recompensas.filter(r => r.estado === 'Activa').length;
  }

  get totalCanjes() {
    return this.recompensas.reduce((acc, curr) => acc + curr.canjes, 0);
  }


  regresar() { this.back.emit(); }
  cerrarSesion() { this.logout.emit(); }

  
  nuevaRecompensa() { 
    this.esEdicion = false;
    this.recompensaForm = {
      id: null,
      titulo: '',
      descripcion: '',
      puntos: null,
      estado: 'Activa',
      canjes: 0,
      fecha: new Date().toISOString().split('T')[0] // Asigna la fecha de hoy por defecto
    };
    this.mostrarModal = true;
  }

  editarRecompensa(recompensa: any) { 
    this.esEdicion = true;
    this.recompensaForm = { ...recompensa }; 
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarRecompensa() {
    if (this.esEdicion) {
      // Actualizar recompensa existente
      const index = this.recompensas.findIndex(r => r.id === this.recompensaForm.id);
      if (index !== -1) {
        this.recompensas[index] = { ...this.recompensaForm };
      }
    } else {
      // Crear nueva recompensa
      const nuevoId = this.recompensas.length > 0 ? Math.max(...this.recompensas.map(r => r.id)) + 1 : 1;
      this.recompensas.push({
        ...this.recompensaForm,
        id: nuevoId
      });
    }
    this.cerrarModal();
  }

  eliminarRecompensa(id: number) { 
  
    if(confirm('¿Estás seguro de que deseas eliminar esta recompensa?')) {
      this.recompensas = this.recompensas.filter(r => r.id !== id);
    }
  }
}