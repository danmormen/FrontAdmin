import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EstilistaNavbarComponent } from '../estilista-navbar/estilista-navbar';

const DIAS_ES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

@Component({
  selector: 'app-citas-estilista',
  standalone: true,
  imports: [CommonModule, EstilistaNavbarComponent],
  templateUrl: './citas-estilista.html',
  styleUrls: ['./citas-estilista.css']
})
export class CitasEstilistaComponent implements OnInit {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout   = new EventEmitter<void>();

  private apiUrl = 'http://localhost:3000/api';

  cargando = true;

  // Semana actual: lunes ISO + offset para navegar semanas
  semanaOffset = 0;
  diasSemana: { fecha: string; nombreDia: string; numeroDia: number; citas: any[] }[] = [];

  // Día expandido (click para ver detalle)
  diaExpandido: string | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.cargarSemana(); }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: 'Bearer ' + token });
  }

  // Calcula el lunes de la semana actual + offset
  get lunesISO(): string {
    const hoy  = new Date();
    const diff = hoy.getDay() === 0 ? -6 : 1 - hoy.getDay();
    hoy.setDate(hoy.getDate() + diff + this.semanaOffset * 7);
    return `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,'0')}-${String(hoy.getDate()).padStart(2,'0')}`;
  }

  get tituloSemana(): string {
    const lunes   = new Date(this.lunesISO + 'T00:00:00');
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    const optsCorto = { day: 'numeric', month: 'short' } as const;
    return `${lunes.toLocaleDateString('es-ES', optsCorto)} – ${domingo.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }

  get esSemanActual(): boolean { return this.semanaOffset === 0; }

  get totalCitasSemana(): number {
    return this.diasSemana.reduce((t, d) => t + d.citas.length, 0);
  }

  cargarSemana() {
    this.cargando     = true;
    this.diaExpandido = null;
    this.http.get<any>(`${this.apiUrl}/citas/mis-citas-semana?lunes=${this.lunesISO}`, { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.construirDias(data.lunes, data.citas || []);
        this.autoSeleccionarHoy();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.construirDias(this.lunesISO, []);
        this.autoSeleccionarHoy();
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Selecciona automáticamente el día de hoy si pertenece a esta semana
  private autoSeleccionarHoy() {
    const hoy = new Date();
    const iso  = `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,'0')}-${String(hoy.getDate()).padStart(2,'0')}`;
    const existe = this.diasSemana.find(d => d.fecha === iso);
    this.diaExpandido = existe ? iso : (this.diasSemana[0]?.fecha ?? null);
  }

  private construirDias(lunesStr: string, citas: any[]) {
    const lunes = new Date(lunesStr + 'T00:00:00');
    // Agrupar citas por fecha ISO
    const porFecha: Record<string, any[]> = {};
    for (const c of citas) {
      const f = c.fecha;
      if (!porFecha[f]) porFecha[f] = [];
      porFecha[f].push(c);
    }
    // Construir los 7 días (Lun-Dom)
    this.diasSemana = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(lunes);
      d.setDate(lunes.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      return {
        fecha:     iso,
        nombreDia: DIAS_ES[d.getDay()],
        numeroDia: d.getDate(),
        citas:     porFecha[iso] || []
      };
    });
  }

  semanAnterior()  { this.semanaOffset--; this.cargarSemana(); }
  semanaSiguiente(){ this.semanaOffset++; this.cargarSemana(); }
  volverSemana()   { this.semanaOffset = 0; this.cargarSemana(); }

  toggleDia(fecha: string) {
    this.diaExpandido = fecha; // selección, no toggle — siempre muestra el día clickeado
  }

  esHoy(fecha: string): boolean {
    const hoy = new Date();
    const iso = `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,'0')}-${String(hoy.getDate()).padStart(2,'0')}`;
    return fecha === iso;
  }

  formatearHora(hora: string): string {
    if (!hora) return '';
    const [hh, mm] = hora.split(':').map(Number);
    return `${hh % 12 || 12}:${String(mm).padStart(2,'0')} ${hh >= 12 ? 'PM' : 'AM'}`;
  }

  estadoClass(estado: string): string {
    const m: Record<string,string> = { confirmada:'pill-green', pendiente:'pill-yellow', cancelada:'pill-red', completada:'pill-blue' };
    return m[estado] ?? 'pill-yellow';
  }

  onNavigate(dest: string) { this.navigate.emit(dest); }
  onLogout()               { this.logout.emit(); }
}
