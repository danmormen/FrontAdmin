import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// ── Componentes Cliente ────────────────────────────────────────────
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';
import { HomeComponent } from './components/home/home';
import { PerfilComponent } from './components/perfil/perfil';
import { ServiciosComponent } from './components/servicios/servicios';
import { ReservarComponent } from './components/reservar/reservar';
import { PromocionesComponent } from './components/promociones/promociones';
import { VerCitaComponent } from './components/ver-cita/ver-cita';
import { RecompensasComponent } from './components/recompensas/recompensas';
import { ResenasComponent } from './components/resenas/resenas';
import { BlogComponent } from './components/blog/blog';

// ── Componentes Admin ──────────────────────────────────────────────
import { PantallaAdminComponent } from './components/pantalla-administrador/pantalla-administrador';
import { EmpleadosAdminComponent } from './components/empleados-admin/empleados-admin';
import { ServiciosAdminComponent } from './components/servicios-admin/servicios-admin';
import { GestionCitasAdminComponent } from './components/gestion-citas-admin/gestion-citas-admin';
import { PromocionesAdminComponent } from './components/promociones-admin/promociones-admin';
import { BlogAdminComponent } from './components/blog-admin/blog-admin';
import { NotificacionesAdminComponent } from './components/notificaciones-admin/notificaciones-admin';
import { RecompensasAdminComponent } from './components/recompensa-admin/recompensa-admin';

// ── Componentes Estilista ──────────────────────────────────────────
import { PantallaEstilistaComponent } from './components/pantalla-estilista/pantalla-estilista';
import { CitasEstilistaComponent } from './components/citas-estilista/citas-estilista';
import { DetalleCitasComponent } from './components/detalle-citas/detalle-citas';
import { ResenasEstilistaComponent } from './components/resenas-estilista/resenas-estilista';
import { NotificacionEstilistaComponent } from './components/notificacion-estilista/notificacion-estilista';
import { PerfilEstilistaComponent } from './components/perfil-estilista/perfil-estilista';
import { EstilistaHorarioComponent } from './components/horario-estilista/horario-estilista';
import { HorariosAdministradorComponent } from './components/horario-administrador/horario-administrador';

// ── Componentes de Autenticación y Seguridad ──────────────────────
import { CambioContrasenaComponent } from './components/cambio-contrasena/cambio-contrasena';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena';

// ── Tipo con todas las vistas posibles de la app ──────────────────
type VistaActual =
  | 'login' | 'registro' | 'home' | 'perfil' | 'servicios'
  | 'reservar' | 'promociones' | 'ver-cita' | 'recompensas'
  | 'resenas' | 'blog'
  | 'admin' | 'empleados-admin' | 'gestion-citas-admin'
  | 'notificaciones-admin' | 'promociones-admin' | 'servicios-admin'
  | 'blog-admin' | 'recompensa-admin' | 'horarios-administrador'
  | 'estilista' | 'citas-estilista' | 'detalle-citas'
  | 'resenas-estilista' | 'notificacion-estilista' | 'perfil-estilista'
  | 'horario-estilista'
  | 'cambio-password' | 'recuperar-password';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent, RegistroComponent, HomeComponent, PerfilComponent,
    ServiciosComponent, ReservarComponent, PromocionesComponent,
    VerCitaComponent, RecompensasComponent, ResenasComponent, BlogComponent,
    PantallaAdminComponent, PantallaEstilistaComponent, EmpleadosAdminComponent,
    ServiciosAdminComponent, GestionCitasAdminComponent, PromocionesAdminComponent,
    BlogAdminComponent, NotificacionesAdminComponent, CitasEstilistaComponent,
    DetalleCitasComponent, ResenasEstilistaComponent, NotificacionEstilistaComponent,
    PerfilEstilistaComponent, EstilistaHorarioComponent, HorariosAdministradorComponent,
    RecompensasAdminComponent, CambioContrasenaComponent, RecuperarContrasenaComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  vistaActual: VistaActual = 'login';

  // Variables para el flujo de reservas
  servicioPreseleccionado = '';
  esPromocion             = false;
  citaAEditar: any        = null;

  // ══════════════════════════════════════════════════════════════════
  // NAVEGACIÓN GENERAL
  // Mapa de strings a vistas — usado por todos los componentes
  // que emiten eventos de navegación
  // ══════════════════════════════════════════════════════════════════
  onNavigate(section: string): void {
    const mapa: Record<string, VistaActual> = {
      login: 'login', registro: 'registro', home: 'home',
      perfil: 'perfil', servicios: 'servicios', reservar: 'reservar',
      promociones: 'promociones', ver: 'ver-cita', 'ver-cita': 'ver-cita',
      recompensas: 'recompensas', resenas: 'resenas', blog: 'blog',

      admin: 'admin',
      'empleados-admin':      'empleados-admin',
      'gestion-citas-admin':  'gestion-citas-admin',
      'notificaciones-admin': 'notificaciones-admin',
      'promociones-admin':    'promociones-admin',
      'servicios-admin':      'servicios-admin',
      'recompensas-admin':    'recompensa-admin',
      'recomensa-admin':      'recompensa-admin',
      'horarios-administrador': 'horarios-administrador',
      'horario-administrador':  'horarios-administrador',
      'blog-admin': 'blog-admin',

      estilista:                'estilista',
      'citas-estilista':        'citas-estilista',
      'detalle-citas':          'detalle-citas',
      'resenas-estilista':      'resenas-estilista',
      'notificacion-estilista': 'notificacion-estilista',
      'notificaciones-estilista': 'notificacion-estilista',
      'perfil-estilista':       'perfil-estilista',
      'horario-estilista':      'horario-estilista',

      'cambio-password':    'cambio-password',
      'recuperar-password': 'recuperar-password'
    };

    const destino = mapa[section];
    if (!destino) {
      console.warn('Vista no reconocida:', section);
      return;
    }

    this.vistaActual = destino;

    if (destino !== 'reservar') {
      this.resetReserva();
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // AUTENTICACIÓN Y SEGURIDAD
  // ══════════════════════════════════════════════════════════════════

  goToRegister(): void {
    this.vistaActual = 'registro';
  }

  goToLogin(): void {
    this.vistaActual = 'login';
    this.resetReserva();
  }

  onLogout(): void {
    // Limpia el localStorage al cerrar sesión
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.vistaActual = 'login';
    this.resetReserva();
  }

  // Se dispara cuando el login detecta requiere_cambio = 1
  // Aplica tanto para estilistas como para clientes con contraseña temporal
  irACambioPasswordObligatorio(): void {
    this.vistaActual = 'cambio-password';
  }

  // Se dispara cuando el usuario cambia su contraseña con éxito
  // Lee el rol del localStorage para saber a dónde redirigir
  completarCambioPassword(): void {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      const user = JSON.parse(userStr);
      const rol  = user.rol;

      if (rol === 'estilista') {
        this.vistaActual = 'estilista'; // ← Estilista va a su panel
      } else if (rol === 'admin') {
        this.vistaActual = 'admin';     // ← Admin va a su panel
      } else {
        this.vistaActual = 'home';      // ← Cliente va al home
      }
    } else {
      // Si no hay datos en localStorage, mandamos al login
      this.vistaActual = 'login';
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // LÓGICA DE RESERVAS
  // ══════════════════════════════════════════════════════════════════

  // Se dispara cuando el cliente selecciona un servicio o promoción
  onServiceSelected(servicio: string, dePromo: boolean = false): void {
    this.servicioPreseleccionado = servicio;
    this.esPromocion             = dePromo;
    this.citaAEditar             = null;
    this.vistaActual             = 'reservar';
  }

  // Se dispara cuando el cliente quiere modificar una cita existente
  onModificarCita(cita: any): void {
    this.citaAEditar             = cita;
    this.servicioPreseleccionado = cita?.servicio ?? '';
    this.esPromocion             = false;
    this.vistaActual             = 'reservar';
  }

  private resetReserva(): void {
    this.servicioPreseleccionado = '';
    this.esPromocion             = false;
    this.citaAEditar             = null;
  }
}