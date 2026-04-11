import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Cliente
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

// Admin
import { PantallaAdminComponent } from './components/pantalla-administrador/pantalla-administrador';
import { EmpleadosAdminComponent } from './components/empleados-admin/empleados-admin';
import { ServiciosAdminComponent } from './components/servicios-admin/servicios-admin';
import { GestionCitasAdminComponent } from './components/gestion-citas-admin/gestion-citas-admin';
import { PromocionesAdminComponent } from './components/promociones-admin/promociones-admin';
import { BlogAdminComponent } from './components/blog-admin/blog-admin';
import { NotificacionesAdminComponent } from './components/notificaciones-admin/notificaciones-admin';
import { RecompensasAdminComponent } from './components/recompensa-admin/recompensa-admin';

// Estilista
import { PantallaEstilistaComponent } from './components/pantalla-estilista/pantalla-estilista';
import { CitasEstilistaComponent } from './components/citas-estilista/citas-estilista';
import { DetalleCitasComponent } from './components/detalle-citas/detalle-citas';
import { ResenasEstilistaComponent } from './components/resenas-estilista/resenas-estilista';
import { NotificacionEstilistaComponent } from './components/notificacion-estilista/notificacion-estilista';
import { PerfilEstilistaComponent } from './components/perfil-estilista/perfil-estilista';
import { EstilistaHorarioComponent } from './components/horario-estilista/horario-estilista';
import { HorariosAdministradorComponent } from './components/horario-administrador/horario-administrador';

// Autenticación / Seguridad (NUEVO)
import { CambioContrasenaComponent } from './components/cambio-contrasena/cambio-contrasena';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena'; // <-- NUEVO


type VistaActual =
  | 'login'
  | 'registro'
  | 'home'
  | 'perfil'
  | 'servicios'
  | 'reservar'
  | 'promociones'
  | 'ver-cita'
  | 'recompensas'
  | 'resenas'
  | 'blog'
  | 'admin'
  | 'empleados-admin'
  | 'gestion-citas-admin'
  | 'notificaciones-admin'
  | 'promociones-admin'
  | 'servicios-admin'
  | 'blog-admin'
  | 'estilista'
  | 'citas-estilista'
  | 'detalle-citas'
  | 'resenas-estilista'
  | 'notificacion-estilista'
  | 'perfil-estilista'
  | 'horarios-administrador'
  | 'recompensa-admin'
  | 'horario-estilista'
  | 'cambio-password'
  | 'recuperar-password'; // <-- NUEVA VISTA AGREGADA

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    RegistroComponent,
    HomeComponent,
    PerfilComponent,
    ServiciosComponent,
    ReservarComponent,
    PromocionesComponent,
    VerCitaComponent,
    RecompensasComponent,
    ResenasComponent,
    BlogComponent,
    PantallaAdminComponent,
    PantallaEstilistaComponent,
    EmpleadosAdminComponent,
    ServiciosAdminComponent,
    GestionCitasAdminComponent,
    PromocionesAdminComponent,
    BlogAdminComponent,
    NotificacionesAdminComponent,
    CitasEstilistaComponent,
    DetalleCitasComponent,
    ResenasEstilistaComponent,
    NotificacionEstilistaComponent,
    PerfilEstilistaComponent,
    EstilistaHorarioComponent,
    HorariosAdministradorComponent,
    RecompensasAdminComponent,
    CambioContrasenaComponent,
    RecuperarContrasenaComponent // <-- NUEVO COMPONENTE AGREGADO
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  vistaActual: VistaActual = 'login';

  servicioPreseleccionado = '';
  esPromocion = false;
  citaAEditar: any = null;

  // Navegación general
  onNavigate(section: string): void {
    const mapa: Record<string, VistaActual> = {
      login: 'login',
      registro: 'registro',
      home: 'home',
      perfil: 'perfil',
      servicios: 'servicios',
      reservar: 'reservar',
      promociones: 'promociones',
      ver: 'ver-cita',
      'ver-cita': 'ver-cita',
      recompensas: 'recompensas',
      resenas: 'resenas',
      blog: 'blog',

      admin: 'admin',
      'empleados-admin': 'empleados-admin',
      'gestion-citas-admin': 'gestion-citas-admin',
      'notificaciones-admin': 'notificaciones-admin',
      'promociones-admin': 'promociones-admin',
      'servicios-admin': 'servicios-admin',
      'recompensas-admin': 'recompensa-admin',
      'recomensa-admin': 'recompensa-admin',
      'horarios-administrador': 'horarios-administrador',
      'horario-administrador': 'horarios-administrador',
      'blog-admin': 'blog-admin',

      estilista: 'estilista',
      'citas-estilista': 'citas-estilista',
      'detalle-citas': 'detalle-citas',
      'resenas-estilista': 'resenas-estilista',
      'notificacion-estilista': 'notificacion-estilista',
      'notificaciones-estilista': 'notificacion-estilista',
      'perfil-estilista': 'perfil-estilista',
      'horario-estilista': 'horario-estilista',
      
      'cambio-password': 'cambio-password',
      'recuperar-password': 'recuperar-password' // <-- NUEVA RUTA AGREGADA
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

  // ==========================================
  // LÓGICA DE AUTENTICACIÓN Y SEGURIDAD
  // ==========================================

  goToRegister(): void {
    this.vistaActual = 'registro';
  }

  goToLogin(): void {
    this.vistaActual = 'login';
    this.resetReserva();
  }

  onLogout(): void {
    this.vistaActual = 'login';
    this.resetReserva();
  }

  // Se dispara cuando el login detecta que el estilista usa la clave por defecto
  irACambioPasswordObligatorio(): void {
    this.vistaActual = 'cambio-password';
  }

  // Se dispara cuando el estilista cambia su clave con éxito
  completarCambioPassword(): void {
    this.vistaActual = 'estilista'; // Lo enviamos a su panel principal
  }

  // ==========================================
  // LÓGICA DE RESERVAS
  // ==========================================

  onServiceSelected(servicio: string, dePromo: boolean = false): void {
    this.servicioPreseleccionado = servicio;
    this.esPromocion = dePromo;
    this.citaAEditar = null;
    this.vistaActual = 'reservar';
  }

  onModificarCita(cita: any): void {
    this.citaAEditar = cita;
    this.servicioPreseleccionado = cita?.servicio ?? '';
    this.esPromocion = false;
    this.vistaActual = 'reservar';
  }

  private resetReserva(): void {
    this.servicioPreseleccionado = '';
    this.esPromocion = false;
    this.citaAEditar = null;
  }
}