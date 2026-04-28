import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar';

interface Cita {
  cliente: string;
  servicio: string;
  estilista: string;
  fecha: string;
  hora: string;
  precio: string;
  estado: 'Confirmada' | 'Pendiente' | 'Cancelada';
}

@Component({
  selector: 'app-gestion-citas-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbarComponent],
  templateUrl: './gestion-citas-admin.html',
  styleUrls: ['./gestion-citas-admin.css']
})
export class GestionCitasAdminComponent {
  @Output() navigate    = new EventEmitter<string>();
  @Output() logout      = new EventEmitter<void>();

  filtroBusqueda: string = '';
  filtroEstado: string = 'Todas';

  citas: Cita[] = [
    { cliente: 'María González', servicio: 'Corte de cabello', estilista: 'Ana Martínez', fecha: 'mar, 24 mar 2026', hora: '10:00', precio: 'Q280', estado: 'Confirmada' },
    { cliente: 'Laura Ramírez', servicio: 'Manicure + Pedicure', estilista: 'Carmen López', fecha: 'mar, 24 mar 2026', hora: '14:00', precio: 'Q450', estado: 'Pendiente' },
    { cliente: 'Sofia Hernández', servicio: 'Tratamiento facial', estilista: 'Ana Martínez', fecha: 'mié, 25 mar 2026', hora: '11:00', precio: 'Q400', estado: 'Confirmada' },
    { cliente: 'Patricia Torres', servicio: 'Coloración', estilista: 'Ana Martínez', fecha: 'mié, 25 mar 2026', hora: '15:00', precio: 'Q500', estado: 'Pendiente' }
  ];

  get citasFiltradas() {
    return this.citas.filter(cita => {
      const coincideBusqueda = cita.cliente.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) || 
                               cita.servicio.toLowerCase().includes(this.filtroBusqueda.toLowerCase());
      const coincideEstado = this.filtroEstado === 'Todas' || cita.estado === this.filtroEstado;
      return coincideBusqueda && coincideEstado;
    });
  }

  onNavigate(dest: string) { this.navigate.emit(dest); }
  cerrarSesion()           { this.logout.emit(); }
}