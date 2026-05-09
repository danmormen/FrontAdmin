import { Component, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar';

@Component({
  selector: 'app-reportes-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbarComponent],
  templateUrl: './reportes-admin.html',
  styleUrls: ['./reportes-admin.css']
})
export class ReportesAdminComponent implements OnInit {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout   = new EventEmitter<void>();

  private apiUrl = 'http://localhost:3000/api/reportes';

  periodoSeleccionado = 'mes';
  cargando  = true;
  error     = '';

  // ── Datos del API ─────────────────────────────────────────────────
  kpis = {
    ingresos: 0, ingresosAnterior: 0,
    citas: 0,    citasAnterior: 0,
    satisfaccion: 0, satisfaccionAnterior: 0
  };

  totales = { total: 0, completadas: 0, canceladas: 0, pendientes: 0, confirmadas: 0 };

  citasPorDia:     { dia: string; total: number }[] = [];
  serviciosTop:    { nombre: string; total: number }[] = [];
  estilistas:      { nombre: string; citas: number; ingresos: number; satisfaccion: number }[] = [];

  rango = { inicio: '', fin: '' };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.cargarReporte(); }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: 'Bearer ' + token });
  }

  cargarReporte() {
    this.cargando = true;
    this.error    = '';
    const url = `${this.apiUrl}?periodo=${this.periodoSeleccionado}`;

    this.http.get<any>(url, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.kpis        = data.kpis;
        this.citasPorDia = data.citasPorDia;
        this.serviciosTop= data.serviciosTop;
        this.estilistas  = data.estilistas;
        this.totales     = data.totales;
        this.rango       = data.rango;
        this.cargando    = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error    = 'No se pudo cargar el reporte.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  onPeriodoChange() { this.cargarReporte(); }

  // ── Helpers de KPIs ──────────────────────────────────────────────
  getPorcentajeCambio(actual: number, anterior: number): number {
    if (!anterior) return actual > 0 ? 100 : 0;
    return Math.round(((actual - anterior) / anterior) * 100);
  }

  esCambioPositivo(actual: number, anterior: number): boolean {
    return actual >= anterior;
  }

  // ── Helpers de gráficas ───────────────────────────────────────────
  getMaxDia(): number {
    return Math.max(...this.citasPorDia.map(d => d.total), 1);
  }

  getAlturaBarra(total: number): number {
    return Math.round((total / this.getMaxDia()) * 160);
  }

  esDiaPico(total: number): boolean {
    return total > 0 && total === this.getMaxDia();
  }

  getAnchoServicio(total: number): number {
    const max = this.serviciosTop[0]?.total || 1;
    return Math.round((total / max) * 100);
  }

  // ── Labels de período ─────────────────────────────────────────────
  get labelPeriodo(): string {
    const map: Record<string, string> = {
      semana: 'Esta semana', mes: 'Este mes',
      trimestre: 'Este trimestre', año: 'Este año'
    };
    return map[this.periodoSeleccionado] ?? '';
  }

  get labelRango(): string {
    if (!this.rango.inicio) return '';
    const fmt = (s: string) => {
      const [y, m, d] = s.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    };
    return `${fmt(this.rango.inicio)} – ${fmt(this.rango.fin)}`;
  }

  // ── Tasa de cancelación ───────────────────────────────────────────
  get tasaCancelacion(): number {
    if (!this.totales.total) return 0;
    return Math.round((this.totales.canceladas / this.totales.total) * 100);
  }

  onNavigate(dest: string) { this.navigate.emit(dest); }
  cerrarSesion()            { this.logout.emit(); }
}
