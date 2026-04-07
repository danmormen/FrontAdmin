import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

type HomeSection =
  | 'perfil'
  | 'servicios'
  | 'reservar'
  | 'promociones'
  | 'ver'
  | 'recompensas'
  | 'resenas'
  | 'blog';

type HomeIcon =
  | 'perfil'
  | 'servicios'
  | 'reservar'
  | 'promociones'
  | 'ver'
  | 'recompensas'
  | 'resenas'
  | 'blog';

interface HomeCard {
  title: string;
  description: string;
  section: HomeSection;
  icon: HomeIcon;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  @Output() navigate = new EventEmitter<HomeSection>();
  @Output() logout = new EventEmitter<void>();

  cards: HomeCard[] = [
    {
      title: 'Perfil',
      description: 'Administra tu información personal',
      section: 'perfil',
      icon: 'perfil'
    },
    {
      title: 'Servicios',
      description: 'Conoce todos nuestros servicios',
      section: 'servicios',
      icon: 'servicios'
    },
    {
      title: 'Reservar Cita',
      description: 'Agenda tu próxima visita',
      section: 'reservar',
      icon: 'reservar'
    },
    {
      title: 'Promociones',
      description: 'Descubre nuestras ofertas especiales',
      section: 'promociones',
      icon: 'promociones'
    },
    {
      title: 'Ver Citas',
      description: 'Consulta tus citas programadas',
      section: 'ver',
      icon: 'ver'
    },
    {
      title: 'Recompensas',
      description: 'Revisa tus puntos y beneficios',
      section: 'recompensas',
      icon: 'recompensas'
    },
    {
      title: 'Reseñas',
      description: 'Comparte tu experiencia',
      section: 'resenas',
      icon: 'resenas'
    },
    {
      title: 'Blog',
      description: 'Consejos y tendencias de belleza',
      section: 'blog',
      icon: 'blog'
    }
  ];

  // Método para navegar a las secciones (Perfil, Blog, etc.)
  goTo(section: HomeSection): void {
    this.navigate.emit(section);
  }

  // Método para cerrar sesión y volver al Login
  cerrarSesion(): void {
    console.log('Cerrando sesión desde Home...');
    this.logout.emit();
  }
}