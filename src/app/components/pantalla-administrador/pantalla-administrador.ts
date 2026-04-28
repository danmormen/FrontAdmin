import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar';

// === Tipos para los datos del dashboard (mock por ahora) ===
interface CitaHoy {
  hora:      string;
  cliente:   string;
  servicio:  string;
  estilista: string;
  estado:    'confirmada' | 'pendiente';
}

interface DiaSemana {
  nombre: string;
  citas:  number;
}

@Component({
  selector: 'app-pantalla-admin',
  standalone: true,
  imports: [CommonModule, AdminNavbarComponent],
  templateUrl: './pantalla-administrador.html',
  styleUrls: ['./pantalla-administrador.css']
})
export class PantallaAdminComponent {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout   = new EventEmitter<void>();

  // === Datos mock del dashboard (TODO: conectar con la API real) ===
  citasHoyTotal      = 5;
  clientesAtendidos  = 18;

  citasHoy: CitaHoy[] = [
    { hora: '09:00', cliente: 'María García',     servicio: 'Corte y Brushing',     estilista: 'Ana Martínez',    estado: 'confirmada' },
    { hora: '10:30', cliente: 'Sofía López',      servicio: 'Manicure Gel',         estilista: 'Carmen López',    estado: 'confirmada' },
    { hora: '11:00', cliente: 'Laura Hernández',  servicio: 'Tratamiento Facial',   estilista: 'María González',  estado: 'pendiente'  },
    { hora: '13:00', cliente: 'Ana Martínez',     servicio: 'Pestañas Extensiones', estilista: 'Carmen López',    estado: 'confirmada' },
    { hora: '15:30', cliente: 'Patricia Torres',  servicio: 'Balayage',             estilista: 'Ana Martínez',    estado: 'pendiente'  }
  ];

  semana: DiaSemana[] = [
    { nombre: 'Lun', citas: 12 },
    { nombre: 'Mar', citas: 15 },
    { nombre: 'Mié', citas: 18 },
    { nombre: 'Jue', citas: 14 },
    { nombre: 'Vie', citas: 22 },
    { nombre: 'Sáb', citas: 25 },
    { nombre: 'Dom', citas: 8  }
  ];

  // === Computed ===
  get totalSemana(): number {
    return this.semana.reduce((acc, d) => acc + d.citas, 0);
  }

  get confirmadasHoy(): number {
    return this.citasHoy.filter(c => c.estado === 'confirmada').length;
  }

  get pendientesHoy(): number {
    return this.citasHoy.filter(c => c.estado === 'pendiente').length;
  }

  get maxCitasSemana(): number {
    return Math.max(...this.semana.map(d => d.citas), 1);
  }

  // Calcula el % de la barra de cada dia (relativo al maximo de la semana)
  porcentajeBarra(citas: number): number {
    return Math.round((citas / this.maxCitasSemana) * 100);
  }

  // === Eventos ===
  navegarA(destino: string): void {
    this.navigate.emit(destino);
  }

  cerrarSesion(): void {
    this.logout.emit();
  }
}
