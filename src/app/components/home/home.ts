import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';

// Secciones a las que el cliente puede entrar desde el home
type HomeSection =
  | 'perfil'
  | 'servicios'
  | 'reservar'
  | 'promociones'
  | 'ver'
  | 'recompensas'
  | 'resenas';

// === Tipos para los datos del dashboard (mock por ahora) ===
interface ProximaCita {
  servicio:  string;
  estilista: string;
  fecha:     string;
  hora:      string;
  duracion:  string;
}

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
  // El padre (app) escucha estos eventos y se encarga de la navegacion real
  @Output() navigate = new EventEmitter<HomeSection>();
  @Output() logout   = new EventEmitter<void>();

  // Nombre del usuario, se rellena desde localStorage en ngOnInit
  nombreUsuario = 'Cliente';

  // === Datos del dashboard (TODO: conectar con la API real) ===
  puntos                  = 850;
  puntosProximaRecompensa = 150;

  proximasCitas: ProximaCita[] = [
    {
      servicio:  'Manicure & Pedicure',
      estilista: 'María González',
      fecha:     'viernes, 1 de mayo de 2026',
      hora:      '14:30',
      duracion:  '90 min'
    },
    {
      servicio:  'Corte y Brushing',
      estilista: 'Ana Martínez',
      fecha:     'jueves, 7 de mayo de 2026',
      hora:      '10:00',
      duracion:  '60 min'
    }
  ];

  serviciosPopulares: ServicioPopular[] = [
    { nombre: 'Manicure Gel',                  popularidad: 98, precio: 450,  duracion: '60 min'                  },
    { nombre: 'Tratamiento Facial Hidratante', popularidad: 95, precio: 800,  duracion: '90 min',  esNuevo: true  },
    { nombre: 'Pestañas Extensiones',          popularidad: 92, precio: 650,  duracion: '120 min', esNuevo: true  },
    { nombre: 'Balayage Completo',             popularidad: 89, precio: 1200, duracion: '180 min'                 }
  ];

  ngOnInit(): void {
    // Tomamos el primer nombre del usuario logueado para el saludo
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const partes = (user.nombre || '').split(' ');
        this.nombreUsuario = partes[0] || 'Cliente';
      } catch {
        // si el JSON esta corrupto, dejamos el default
      }
    }
  }

  // Porcentaje de progreso para la barra de "proxima recompensa"
  get porcentajeProgreso(): number {
    const meta = this.puntos + this.puntosProximaRecompensa;
    if (meta <= 0) return 0;
    return Math.min(100, Math.round((this.puntos / meta) * 100));
  }

  goTo(section: HomeSection): void {
    this.navigate.emit(section);
  }

  cerrarSesion(): void {
    // TODO: quitar el log cuando ya este probado
    console.log('Cerrando sesión desde Home...');
    this.logout.emit();
  }
}
