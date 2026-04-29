import { Component, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { EstilistaNavbarComponent } from '../estilista-navbar/estilista-navbar';

interface CitaHoy {
  hora: string;
  cliente: string;
  servicio: string;
  duracion: string;
  estado: 'confirmada' | 'pendiente';
}

interface NotifItem {
  icon: 'cita' | 'cancelada' | 'resena';
  mensaje: string;
  hace: string;
}

interface DiaHorario {
  dia:            string;  // abreviatura (Dom, Lun...) — la dejamos por compatibilidad
  nombreCompleto: string;  // 'domingo', 'lunes'... lo que pintamos en la card
  numeroFecha:    number;  // dia del mes (26, 27...) calculado para la semana actual
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

  private apiUrl = 'http://localhost:3000/api/horarios/mi-horario';

  // Nombre leído desde el localStorage
  nombreEstilista = '';

  // Horario conectado al backend
  horarioSemanal: DiaHorario[] = [];
  cargandoHorario = false;
  errorHorario    = '';   // mensaje de error a pintar si la API falla
  sinHorario      = false; // true si la API devolvio 404 (no asignado)

  // Datos estáticos del dashboard (se conectarán al backend más adelante)
  citasHoy: CitaHoy[] = [
    { hora: '09:00', cliente: 'María García',    servicio: 'Corte y Brushing',    duracion: '60 min',  estado: 'confirmada' },
    { hora: '11:00', cliente: 'Sofía López',     servicio: 'Coloración',          duracion: '120 min', estado: 'confirmada' },
    { hora: '14:00', cliente: 'Laura Hernández', servicio: 'Tratamiento Capilar', duracion: '90 min',  estado: 'pendiente'  },
    { hora: '16:30', cliente: 'Patricia Ruiz',   servicio: 'Peinado Especial',    duracion: '75 min',  estado: 'confirmada' },
  ];

  notificaciones: NotifItem[] = [
    { icon: 'cita',      mensaje: 'Nueva cita agendada para mañana a las 10:00',  hace: 'Hace 5 min'   },
    { icon: 'cancelada', mensaje: 'Cita de Carmen López cancelada (Mié 14:00)',    hace: 'Hace 1 hora'  },
    { icon: 'resena',    mensaje: 'María García dejó una reseña de 5 estrellas',   hace: 'Hace 2 horas' },
  ];

  // Abreviaturas para mapear el nombre completo del día
  private readonly ABREV: Record<string, string> = {
    'domingo': 'Dom', 'lunes': 'Lun', 'martes': 'Mar',
    'miércoles': 'Mié', 'miercoles': 'Mié',
    'jueves': 'Jue', 'viernes': 'Vie', 'sábado': 'Sáb', 'sabado': 'Sáb'
  };

  // Indice del dia de la semana (Dom=0, Lun=1, etc.) — usado para calcular la fecha
  private readonly INDICE_DIA: Record<string, number> = {
    'domingo': 0, 'lunes': 1, 'martes': 2,
    'miércoles': 3, 'miercoles': 3,
    'jueves': 4, 'viernes': 5,
    'sábado': 6, 'sabado': 6
  };

  // Devuelve el numero del dia del mes (1-31) que cae el dia indicado en la semana actual.
  // ej. si hoy es martes 28, getFechaDelDia('domingo') devuelve 26
  private getFechaDelDia(nombreDia: string): number {
    const indice = this.INDICE_DIA[nombreDia.toLowerCase().trim()] ?? 0;
    const hoy = new Date();
    const domingo = new Date(hoy);
    domingo.setDate(hoy.getDate() - hoy.getDay()); // retrocedemos al domingo de esta semana
    domingo.setDate(domingo.getDate() + indice);   // avanzamos al dia que toca
    return domingo.getDate();
  }

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Leer nombre del usuario guardado al hacer login
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      try {
        const usuario = JSON.parse(usuarioStr);
        this.nombreEstilista = usuario.nombre || '';
      } catch { this.nombreEstilista = ''; }
    }

    this.cargarHorario();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // Pide al backend el horario del estilista logueado y lo deja listo
  // para pintarse en la card semanal del dashboard.
  cargarHorario(): void {
    // Validacion rapida: si no hay token directamente avisamos
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorHorario    = 'No estás autenticado. Vuelve a iniciar sesión.';
      this.cargandoHorario = false;
      this.cdr.detectChanges();
      return;
    }

    this.cargandoHorario = true;
    this.errorHorario    = '';
    this.sinHorario      = false;
    this.horarioSemanal  = [];
    this.cdr.detectChanges();

    console.log('[Inicio] Pidiendo horario a:', this.apiUrl);

    // timeout(10000) cierra la peticion si el backend no responde en 10s,
    // asi no nos quedamos pegados en "Cargando..." para siempre.
    this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(timeout(10000))
      .subscribe({

        next: (res) => {
          this.cargandoHorario = false;
          console.log('[Inicio] Horario recibido:', res);

          // Caso raro pero por si acaso: la API contesto 200 con array vacio
          if (!res || res.length === 0) {
            this.sinHorario = true;
            this.cdr.detectChanges();
            return;
          }

          // Convertimos cada fila de la BD a la forma que pinta el HTML.
          // Calculamos las horas restando inicio - fin si NO es descanso.
          this.horarioSemanal = res.map(d => {
            const esDescanso = d.es_descanso === 1 || d.es_descanso === true;
            const inicio     = d.hora_inicio ? d.hora_inicio.substring(0, 5) : '';
            const fin        = d.hora_fin    ? d.hora_fin.substring(0, 5)    : '';

            let horas = 0;
            if (!esDescanso && d.hora_inicio && d.hora_fin) {
              const [h1, m1] = d.hora_inicio.split(':').map(Number);
              const [h2, m2] = d.hora_fin.split(':').map(Number);
              const diff = (h2 - h1) + (m2 - m1) / 60;
              horas = Math.round((diff > 0 ? diff : 0) * 10) / 10;
            }

            const nombreDia = (d.dia_semana || '').toLowerCase().trim();

            return {
              // si el dia viene con acento o capitalizado distinto, igual lo abreviamos
              dia:            this.ABREV[nombreDia] ?? d.dia_semana.substring(0, 3),
              nombreCompleto: nombreDia,                       // 'domingo', 'lunes'...
              numeroFecha:    this.getFechaDelDia(nombreDia),  // 26, 27, 28...
              horas,
              inicio,
              fin,
              descanso: esDescanso
            };
          });
          this.cdr.detectChanges();
        },

        // Manejo claro de errores para no quedarnos a ciegas
        error: (err) => {
          this.cargandoHorario = false;
          console.error('[Inicio] Error cargando horario:', err);

          // Timeout (rxjs timeout error)
          if (err?.name === 'TimeoutError') {
            this.errorHorario = 'El servidor no respondió a tiempo. ¿Está el backend corriendo en :3000?';
          } else if (err.status === 0) {
            // status 0 = no llego respuesta (CORS, backend caido, red)
            this.errorHorario = 'No se pudo conectar al backend (¿está encendido en localhost:3000?)';
          } else if (err.status === 404) {
            this.sinHorario = true;
          } else if (err.status === 401) {
            this.errorHorario = 'Tu sesión expiró. Cierra sesión y vuelve a entrar.';
          } else {
            this.errorHorario = err.error?.message || err.error?.error || `Error ${err.status}`;
          }
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
