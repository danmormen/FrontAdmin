import { Component, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-estilista-horario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './horario-estilista.html',
  styleUrls: ['./horario-estilista.css']
})
export class EstilistaHorarioComponent implements OnInit {
  @Output() back = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  private apiUrl = 'http://localhost:3000/api/horarios/mi-horario';

  // Inicializamos como array vacío
  horarioSemanal: any[] = [];
  mensajeError: string = '';
  
  // Totales para la interfaz
  diasLaborables = 0;
  horasSemanalesTotal = 0;
  diasDescansoCount = 0;

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

  regresar(): void {
    this.back.emit();
  }

  cerrarSesion(): void {
    this.logout.emit();
  }
}