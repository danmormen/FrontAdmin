import { Component, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { EstilistaNavbarComponent } from '../estilista-navbar/estilista-navbar';

interface DiaHorario {
  dia:            string;
  nombreCompleto: string;
  numeroFecha:    number;
  horas:          number;
  inicio:         string;
  fin:            string;
  descanso:       boolean;
}

@Component({
  selector: 'app-pantalla-estilista',
  standalone: true,
  imports: [CommonModule, EstilistaNavbarComponent],
  templateUrl: './pantalla-estilista.html',
  styleUrls: ['./pantalla-estilista.css']
})
export class PantallaEstilistaComponent implements OnInit {
  @Output() logout   = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<string>();

  private api = 'http://localhost:3000/api';

  nombreEstilista = '';

  // Citas de hoy — reales
  citasHoy:     any[] = [];
  cargandoCitas = true;

  // Notificaciones recientes — reales (máx 3)
  notificaciones: any[] = [];

  // Horario semanal — real
  horarioSemanal: DiaHorario[] = [];
  cargandoHorario = false;
  errorHorario    = '';
  sinHorario      = false;

  private readonly ABREV: Record<string, string> = {
    'domingo':'Dom','lunes':'Lun','martes':'Mar','miércoles':'Mié',
    'miercoles':'Mié','jueves':'Jue','viernes':'Vie','sábado':'Sáb','sabado':'Sáb'
  };
  private readonly INDICE_DIA: Record<string, number> = {
    'domingo':0,'lunes':1,'martes':2,'miércoles':3,'miercoles':3,
    'jueves':4,'viernes':5,'sábado':6,'sabado':6
  };

  private getFechaDelDia(nombreDia: string): number {
    const indice  = this.INDICE_DIA[nombreDia.toLowerCase().trim()] ?? 0;
    const hoy     = new Date();
    const domingo = new Date(hoy);
    domingo.setDate(hoy.getDate() - hoy.getDay() + indice);
    return domingo.getDate();
  }

  private get hoyISO(): string {
    const h = new Date();
    return `${h.getFullYear()}-${String(h.getMonth()+1).padStart(2,'0')}-${String(h.getDate()).padStart(2,'0')}`;
  }

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      try { this.nombreEstilista = JSON.parse(usuarioStr).nombre || ''; } catch {}
    }
    this.cargarCitasHoy();
    this.cargarNotificaciones();
    this.cargarHorario();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ── Citas de hoy ─────────────────────────────────────────────────
  cargarCitasHoy(): void {
    this.cargandoCitas = true;
    this.http.get<any[]>(
      `${this.api}/citas/mis-citas-estilista?fecha=${this.hoyISO}`,
      { headers: this.getHeaders() }
    ).subscribe({
      next: (data) => { this.citasHoy = data; this.cargandoCitas = false; this.cdr.detectChanges(); },
      error: ()     => { this.cargandoCitas = false; this.cdr.detectChanges(); }
    });
  }

  // ── Notificaciones recientes (últimas 3) ─────────────────────────
  cargarNotificaciones(): void {
    this.http.get<any[]>(
      `${this.api}/notif-estilista/mis-notificaciones`,
      { headers: this.getHeaders() }
    ).subscribe({
      next: (data) => { this.notificaciones = data.slice(0, 3); this.cdr.detectChanges(); },
      error: ()     => {}
    });
  }

  formatearHora(hora: string): string {
    if (!hora) return '';
    const [hh, mm] = hora.split(':').map(Number);
    const ampm = hh >= 12 ? 'PM' : 'AM';
    return `${hh % 12 || 12}:${String(mm).padStart(2,'0')} ${ampm}`;
  }

  formatearTiempo(fechaStr: string): string {
    if (!fechaStr) return '';
    const diff = Date.now() - new Date(fechaStr).getTime();
    const min  = Math.floor(diff / 60000);
    if (min < 1)   return 'Ahora';
    if (min < 60)  return `Hace ${min} min`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24)  return `Hace ${hrs}h`;
    return `Hace ${Math.floor(hrs / 24)}d`;
  }

  // ── Horario semanal ───────────────────────────────────────────────
  cargarHorario(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
    this.cargandoHorario = true;
    this.http.get<any[]>(`${this.api}/horarios/mi-horario`, { headers: this.getHeaders() })
      .pipe(timeout(10000))
      .subscribe({
        next: (res) => {
          this.cargandoHorario = false;
          if (!res || res.length === 0) { this.sinHorario = true; this.cdr.detectChanges(); return; }
          this.horarioSemanal = res.map(d => {
            const esDescanso = d.es_descanso === 1 || d.es_descanso === true;
            const inicio     = d.hora_inicio ? d.hora_inicio.substring(0, 5) : '';
            const fin        = d.hora_fin    ? d.hora_fin.substring(0, 5)    : '';
            let horas = 0;
            if (!esDescanso && d.hora_inicio && d.hora_fin) {
              const [h1, m1] = d.hora_inicio.split(':').map(Number);
              const [h2, m2] = d.hora_fin.split(':').map(Number);
              horas = Math.round(((h2 - h1) + (m2 - m1) / 60) * 10) / 10;
            }
            const nombreDia = (d.dia_semana || '').toLowerCase().trim();
            return {
              dia:            this.ABREV[nombreDia] ?? d.dia_semana.substring(0, 3),
              nombreCompleto: nombreDia,
              numeroFecha:    this.getFechaDelDia(nombreDia),
              horas, inicio, fin, descanso: esDescanso
            };
          });
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.cargandoHorario = false;
          if (err.status === 404) this.sinHorario = true;
          else this.errorHorario = err.error?.message || `Error ${err.status}`;
          this.cdr.detectChanges();
        }
      });
  }

  get totalHoras(): number  { return this.horarioSemanal.reduce((t, d) => t + d.horas, 0); }
  get confirmadas(): number { return this.citasHoy.filter(c => c.estado === 'confirmada').length; }
  get pendientes():  number { return this.citasHoy.filter(c => c.estado === 'pendiente').length; }

  onNavigate(dest: string) { this.navigate.emit(dest); }
  cerrarSesion()           { this.logout.emit(); }
  navegarA(modulo: string) { this.navigate.emit(modulo); }
}
