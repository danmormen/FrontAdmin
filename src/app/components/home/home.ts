import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

type HomeSection =
  | 'perfil' | 'servicios' | 'reservar' | 'promociones'
  | 'ver' | 'recompensas' | 'resenas';

interface ServicioPopular {
  nombre:      string;
  popularidad: number;
  precio:      number;
  duracion:    string;
  esNuevo?:    boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  @Output() navigate = new EventEmitter<HomeSection>();
  @Output() logout   = new EventEmitter<void>();

  nombreUsuario = 'Cliente';

  // Citas reales del backend
  proximasCitas: any[] = [];
  cargandoCitas = true;

  // Puntos (mock por ahora)
  puntos                  = 0;
  puntosProximaRecompensa = 500;

  serviciosPopulares: ServicioPopular[] = [
    { nombre: 'Manicure Gel',                  popularidad: 98, precio: 450,  duracion: '60 min'                  },
    { nombre: 'Tratamiento Facial Hidratante', popularidad: 95, precio: 800,  duracion: '90 min',  esNuevo: true  },
    { nombre: 'Pestañas Extensiones',          popularidad: 92, precio: 650,  duracion: '120 min', esNuevo: true  },
    { nombre: 'Balayage Completo',             popularidad: 89, precio: 1200, duracion: '180 min'                 }
  ];

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const partes = (user.nombre || '').split(' ');
        this.nombreUsuario = partes[0] || 'Cliente';
      } catch { /* ignorar */ }
    }
    this.cargarCitas();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  cargarCitas() {
    this.cargandoCitas = true;
    this.http.get<any[]>(this.apiUrl + '/citas/mis-citas', { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Solo citas futuras que no estén canceladas
        this.proximasCitas = data
          .filter(c => {
            if (c.estado === 'cancelada' || c.estado === 'completada') return false;
            const soloFecha = c.fecha.includes('T') ? c.fecha.split('T')[0] : c.fecha;
            const [y, m, d] = soloFecha.split('-').map(Number);
            const fechaCita = new Date(y, m - 1, d);
            return fechaCita >= hoy;
          })
          .sort((a, b) => {
            const fa = a.fecha.split('T')[0] + 'T' + a.hora;
            const fb = b.fecha.split('T')[0] + 'T' + b.hora;
            return fa.localeCompare(fb);
          })
          .slice(0, 4); // máximo 4 en el home

        this.cargandoCitas = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.proximasCitas = [];
        this.cargandoCitas = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatearFecha(fechaStr: string): string {
    if (!fechaStr) return '';
    const soloFecha = fechaStr.includes('T') ? fechaStr.split('T')[0] : fechaStr;
    const [y, m, d] = soloFecha.split('-').map(Number);
    const fecha = new Date(y, m - 1, d);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long'
    }).replace(/^\w/, c => c.toUpperCase());
  }

  formatearHora(hora: string): string {
    if (!hora) return '';
    const [hh, mm] = hora.split(':').map(Number);
    const ampm = hh >= 12 ? 'PM' : 'AM';
    const h12  = hh % 12 || 12;
    return `${h12}:${String(mm).padStart(2, '0')} ${ampm}`;
  }

  get porcentajeProgreso(): number {
    const meta = this.puntos + this.puntosProximaRecompensa;
    if (meta <= 0) return 0;
    return Math.min(100, Math.round((this.puntos / meta) * 100));
  }

  estadoLabel(estado: string): string {
    const map: Record<string, string> = {
      pendiente:  'Pendiente',
      confirmada: 'Confirmada',
      completada: 'Completada',
      cancelada:  'Cancelada'
    };
    return map[estado] ?? estado;
  }

  goTo(section: HomeSection): void { this.navigate.emit(section); }

  cerrarSesion(): void {
    this.logout.emit();
  }
}
