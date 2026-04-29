import { Component, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EstilistaNavbarComponent } from '../estilista-navbar/estilista-navbar';

@Component({
  selector: 'app-estilista-horario',
  standalone: true,
  imports: [CommonModule, EstilistaNavbarComponent],
  templateUrl: './horario-estilista.html',
  styleUrls: ['./horario-estilista.css']
})
export class EstilistaHorarioComponent implements OnInit {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout   = new EventEmitter<void>();

  private apiUrl = 'http://localhost:3000/api/horarios/mi-horario';

  // Inicializamos como array vacío
  horarioSemanal: any[] = [];
  mensajeError: string = '';

  // Totales para la interfaz
  diasLaborables = 0;
  horasSemanalesTotal = 0;
  diasDescansoCount = 0;

  // ── NAVEGACIÓN DE SEMANA ─────────────────────────────────────────
  semanaOffset = 0; // 0 = semana actual, -1 = anterior, +1 = siguiente

  private readonly DIAS_IDX: Record<string, number> = {
    'domingo': 0, 'lunes': 1, 'martes': 2,
    'miércoles': 3, 'miercoles': 3,
    'jueves': 4, 'viernes': 5, 'sábado': 6, 'sabado': 6
  };

  /** Domingo de la semana mostrada (con offset) */
  get inicioSemana(): Date {
    const hoy = new Date();
    const dia = new Date(hoy);
    dia.setDate(hoy.getDate() - hoy.getDay() + this.semanaOffset * 7);
    dia.setHours(0, 0, 0, 0);
    return dia;
  }

  /** "26 - 2 Mayo de 2026" — mismo formato que admin */
  get tituloSemana(): string {
    const inicio = this.inicioSemana;
    const fin    = new Date(inicio);
    fin.setDate(inicio.getDate() + 6);
    const mes = fin.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    return `${inicio.getDate()} - ${fin.getDate()} ${mes.charAt(0).toUpperCase() + mes.slice(1)}`;
  }

  get esSemanaActual(): boolean { return this.semanaOffset === 0; }

  semanaAnterior(): void   { this.semanaOffset--; this.cdr.detectChanges(); }
  semanaSiguiente(): void  { this.semanaOffset++; this.cdr.detectChanges(); }
  volverSemanaActual(): void { this.semanaOffset = 0; this.cdr.detectChanges(); }

  /** Devuelve "28 abr." para el nombre de día recibido de la API */
  getFechaDia(diaSemana: string): string {
    const idx = this.DIAS_IDX[diaSemana?.toLowerCase().trim()] ?? -1;
    if (idx < 0) return '';
    const fecha = new Date(this.inicioSemana);
    fecha.setDate(this.inicioSemana.getDate() + idx);
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef // Inyectamos el detector de cambios
  ) {}

  ngOnInit(): void {
    this.cargarMiHorario();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  cargarMiHorario(): void {
    this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        console.log("Datos recibidos del servidor:", res);
        
        if (res && res.length > 0) {
          // Usamos el operador spread [...] para asegurar que Angular detecte el cambio de referencia
          this.horarioSemanal = [...res]; 
          this.calcularResumenSemanal();
          this.mensajeError = '';
        } else {
          this.horarioSemanal = [];
          this.mensajeError = 'Aún no tienes un horario asignado.';
        }
        
        // Forzamos la detección de cambios para que el *ngIf del HTML reaccione
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error cargando horario:", err);
        this.mensajeError = 'No se pudo conectar con el servidor.';
        this.cdr.detectChanges();
      }
    });
  }

  calcularResumenSemanal(): void {
    let totalH = 0;
    let laborables = 0;
    let descansos = 0;

    this.horarioSemanal.forEach(dia => {
      // Importante: Verificamos si es_descanso es true o 1
      if (dia.es_descanso === 1 || dia.es_descanso === true) {
        descansos++;
      } else {
        laborables++;
        if (dia.hora_inicio && dia.hora_fin) {
          try {
            const [h1, m1] = dia.hora_inicio.split(':').map(Number);
            const [h2, m2] = dia.hora_fin.split(':').map(Number);
            const diferencia = (h2 - h1) + (m2 - m1) / 60;
            totalH += diferencia > 0 ? diferencia : 0;
          } catch (e) {
            console.error("Error calculando horas para el día:", dia.dia_semana);
          }
        }
      }
    });

    this.horasSemanalesTotal = Math.round(totalH * 10) / 10;
    this.diasLaborables = laborables;
    this.diasDescansoCount = descansos;
  }

  onNavigate(dest: string): void { this.navigate.emit(dest); }
  cerrarSesion(): void { this.logout.emit(); }
}