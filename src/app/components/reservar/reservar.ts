import { Component, EventEmitter, Output, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ClientNavbarComponent } from '../client-navbar/client-navbar';

@Component({
  selector: 'app-reservar',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientNavbarComponent],
  templateUrl: './reservar.html',
  styleUrl: './reservar.css'
})
export class ReservarComponent implements OnInit {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout   = new EventEmitter<void>();

  @Input() servicioFijo: string = '';
  @Input() esPromo:      boolean = false;
  @Input() datosEdicion: any    = null;

  private apiUrl = 'http://localhost:3000/api';

  servicios:  any[] = [];
  estilistas: any[] = [];

  horarios = [
    '09:00','09:30','10:00','10:30','11:00','11:30',
    '12:00','12:30','13:00','13:30','14:00','14:30',
    '15:00','15:30','16:00','16:30','17:00','17:30',
    '18:00','18:30','19:00','19:30'
  ];

  fechaMinima: string;
  fechaMaxima: string;

  nuevaCita = { servicio_id:'', estilista_id:'', fecha:'', hora:'', notas:'' };

  textoPromoActual     = '';
  porcentajePromoActual = '';

  cargando          = true;
  cargandoEstilistas = false;
  enviando          = false;
  error             = '';
  avisoEstilistas   = '';

  private spinnerTimer: any;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    const hoy = new Date();
    this.fechaMinima = hoy.toISOString().split('T')[0];
    // Último día del mes siguiente
    const ultimoDiaMesSig = new Date(hoy.getFullYear(), hoy.getMonth() + 2, 0);
    this.fechaMaxima = ultimoDiaMesSig.toISOString().split('T')[0];
    this.nuevaCita.fecha = this.fechaMinima;
  }

  ngOnInit() {
    this.cargarServicios();
    if (this.datosEdicion) {
      this.nuevaCita = {
        servicio_id:  String(this.datosEdicion.servicio_id  || ''),
        estilista_id: String(this.datosEdicion.estilista_id || ''),
        fecha:        this.datosEdicion.fecha || this.fechaMinima,
        hora:         this.datosEdicion.hora  || '',
        notas:        this.datosEdicion.notas || ''
      };
      // Si venimos de edición, cargar los estilistas de esa fecha
      if (this.nuevaCita.fecha) this.cargarEstilistasDisponibles(this.nuevaCita.fecha);
    } else {
      // Carga inicial con la fecha mínima
      this.cargarEstilistasDisponibles(this.nuevaCita.fecha);
    }
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Content-Type':'application/json', 'Authorization':'Bearer ' + token });
  }

  // ── 1. Carga catálogo de servicios ────────────────────────────────
  cargarServicios() {
    this.cargando = true;
    this.http.get<any[]>(this.apiUrl + '/servicios').subscribe({
      next: (data) => {
        this.servicios = data.filter(s => s.activo === 1 || s.activo === true);
        if (this.servicioFijo) {
          const found = this.servicios.find(s => s.nombre.toLowerCase() === this.servicioFijo.toLowerCase());
          if (found) this.nuevaCita.servicio_id = String(found.id);
        }
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error    = 'No se pudieron cargar los servicios. Verifica que el servidor esté activo.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── 2. Carga estilistas disponibles para la fecha elegida ─────────
  cargarEstilistasDisponibles(fecha: string) {
    if (!fecha) return;

    // Resetear estado sin mostrar spinner todavía
    clearTimeout(this.spinnerTimer);
    this.cargandoEstilistas = false;
    this.avisoEstilistas    = '';
    this.estilistas         = [];
    this.nuevaCita.estilista_id = '';
    this.nuevaCita.hora = '';

    // Solo mostrar spinner si la petición tarda más de 400ms
    this.spinnerTimer = setTimeout(() => {
      this.cargandoEstilistas = true;
      this.cdr.detectChanges();
    }, 400);

    this.http.get<any[]>(this.apiUrl + '/citas/estilistas-disponibles?fecha=' + fecha).subscribe({
      next: (data) => {
        clearTimeout(this.spinnerTimer);
        this.estilistas         = data;
        this.cargandoEstilistas = false;
        if (data.length === 0) {
          this.avisoEstilistas = 'No hay estilistas disponibles para este día. Elige otra fecha.';
        }
        this.cdr.detectChanges();
      },
      error: () => {
        clearTimeout(this.spinnerTimer);
        this.cargandoEstilistas = false;
        this.avisoEstilistas    = 'No se pudieron cargar los estilistas.';
        this.cdr.detectChanges();
      }
    });
  }

  // Llamado cuando cambia la fecha en el formulario
  onFechaChange() {
    this.nuevaCita.hora = '';
    this.cargarEstilistasDisponibles(this.nuevaCita.fecha);
  }

  // ── Getters de servicio seleccionado ─────────────────────────────
  get precioServicio(): number | null {
    const s = this.servicios.find(x => String(x.id) === String(this.nuevaCita.servicio_id));
    return s ? parseFloat(s.precio) : null;
  }

  // ── Confirmar reserva ─────────────────────────────────────────────
  confirmarReserva() {
    this.error = '';
    if (!this.nuevaCita.servicio_id || !this.nuevaCita.estilista_id ||
        !this.nuevaCita.fecha       || !this.nuevaCita.hora) {
      this.error = 'Por favor completa todos los campos obligatorios.';
      return;
    }

    this.enviando = true;
    const payload = {
      servicio_id:  parseInt(this.nuevaCita.servicio_id),
      estilista_id: parseInt(this.nuevaCita.estilista_id),
      fecha:        this.nuevaCita.fecha,
      hora:         this.nuevaCita.hora,
      notas:        this.nuevaCita.notas || null
    };

    this.http.post<any>(this.apiUrl + '/citas', payload, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        this.enviando = false;
        alert('¡Cita agendada con éxito!\n\nServicio: ' + res.servicio + '\nTotal: Q' + res.precio_total + '\n\nRecibirás un correo de confirmación. Recuerda confirmar tu cita en "Mis Citas".');
        this.navigate.emit('ver-cita');
      },
      error: (err) => {
        this.enviando = false;
        this.error    = err.error?.error || 'Error al agendar la cita. Intenta de nuevo.';
      }
    });
  }

  regresar() { this.navigate.emit('home'); }

  private readonly MAPA: Record<string,string> = {
    inicio:'home', reservar:'reservar', ver:'ver-cita',
    servicios:'servicios', promociones:'promociones',
    recompensas:'recompensas', resenas:'resenas', perfil:'perfil'
  };
  onNavigate(section: string) { this.navigate.emit(this.MAPA[section] ?? section); }
  cerrarSesion()               { this.logout.emit(); }
}
