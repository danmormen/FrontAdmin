import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar';

@Component({
  selector: 'app-reportes-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbarComponent],
  templateUrl: './reportes-admin.html',
  styleUrls: ['./reportes-admin.css']
})
export class ReportesAdminComponent {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout   = new EventEmitter<void>();

  periodoSeleccionado = 'mes';

  // ── KPIs principales ──────────────────────────────────────────────
  kpis = {
    ingresosTotales:      15420,
    ingresosAnterior:     13850,
    citasCompletadas:     248,
    citasAnterior:        232,
    satisfaccion:         4.7,
    satisfaccionAnterior: 4.5
  };

  // ── Citas por día ─────────────────────────────────────────────────
  citasPorDia = [
    { dia: 'Lun', total: 42 },
    { dia: 'Mar', total: 38 },
    { dia: 'Mié', total: 35 },
    { dia: 'Jue', total: 41 },
    { dia: 'Vie', total: 52 },
    { dia: 'Sáb', total: 48 },
    { dia: 'Dom', total: 12 }
  ];

  // ── Servicios más populares ───────────────────────────────────────
  serviciosPopulares = [
    { nombre: 'Corte de Cabello',    total: 89 },
    { nombre: 'Tinte y Color',       total: 56 },
    { nombre: 'Peinado Especial',    total: 42 },
    { nombre: 'Tratamiento Capilar', total: 35 },
    { nombre: 'Manicure/Pedicure',   total: 26 }
  ];

  // ── Estilistas más activos ────────────────────────────────────────
  estilistas = [
    { nombre: 'Ana Martínez',   citas: 78, ingresos: 5240, satisfaccion: 4.8 },
    { nombre: 'Carmen López',   citas: 72, ingresos: 4850, satisfaccion: 4.7 },
    { nombre: 'María González', citas: 65, ingresos: 4120, satisfaccion: 4.6 }
  ];

  // ── Helpers ───────────────────────────────────────────────────────
  getPorcentajeCambio(actual: number, anterior: number): number {
    if (anterior === 0) return 0;
    return Math.round(((actual - anterior) / anterior) * 100);
  }

  esCambioPositivo(actual: number, anterior: number): boolean {
    return actual >= anterior;
  }

  getAlturaBarra(total: number): number {
    const max = Math.max(...this.citasPorDia.map(d => d.total));
    return Math.round((total / max) * 160);
  }

  esDiaPico(total: number): boolean {
    return total === Math.max(...this.citasPorDia.map(d => d.total));
  }

  getAnchoServicio(total: number): number {
    const max = this.serviciosPopulares[0].total;
    return Math.round((total / max) * 100);
  }

  onNavigate(dest: string) { this.navigate.emit(dest); }
  volverAlPanel()          { this.navigate.emit('admin'); }
  cerrarSesion()           { this.logout.emit(); }
}