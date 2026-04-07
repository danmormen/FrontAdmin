import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Recompensa {
  id: number;
  titulo: string;
  puntos: number;
  descripcion: string;
}

interface HistorialItem {
  actividad: string;
  fecha: string;
  puntos: number;
  tipo: 'suma' | 'resta';
}

@Component({
  selector: 'app-recompensas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recompensas.html',
  styleUrl: './recompensas.css'
})
export class RecompensasComponent implements OnInit {
  @Output() backToHome = new EventEmitter<void>();

  // Saldo inicial de puntos
  puntosDisponibles: number = 450;

  // Lista de recompensas basada en tu imagen
  recompensas: Recompensa[] = [
    { 
      id: 1, 
      titulo: 'Descuento 10%', 
      puntos: 200, 
      descripcion: '10% de descuento en tu próxima visita' 
    },
    { 
      id: 2, 
      titulo: 'Descuento 15%', 
      puntos: 400, 
      descripcion: '15% de descuento en tu próxima visita' 
    },
    { 
      id: 3, 
      titulo: 'Descuento 20%', 
      puntos: 600, 
      descripcion: '20% de descuento en tu próxima visita' 
    },
    { 
      id: 4, 
      titulo: 'Manicure Gratis', 
      puntos: 1000, 
      descripcion: 'Manicure de cortesía' 
    }
  ];

  // Historial de movimientos
  historial: HistorialItem[] = [
    { 
      actividad: 'Visita - Corte de cabello', 
      fecha: '14 de marzo de 2026', 
      puntos: 280, 
      tipo: 'suma' 
    },
    { 
      actividad: 'Visita - Manicure', 
      fecha: '9 de marzo de 2026', 
      puntos: 200, 
      tipo: 'suma' 
    },
    { 
      actividad: 'Canjeado - Descuento 10%', 
      fecha: '28 de febrero de 2026', 
      puntos: 200, 
      tipo: 'resta' 
    }
  ];

  constructor() {}

  ngOnInit(): void {
    // Aquí podrías cargar los puntos desde un servicio en el futuro
  }

  /**
   * Lógica para canjear puntos
   */
  canjear(recompensa: Recompensa): void {
    if (this.puntosDisponibles >= recompensa.puntos) {
      const mensaje = `¿Deseas canjear ${recompensa.puntos} puntos por "${recompensa.titulo}"?\n\n` +
                      `Recuerda: El cupón debe ser validado por el personal del salón al momento de tu pago.`;
      
      if (confirm(mensaje)) {
        // 1. Restar puntos
        this.puntosDisponibles -= recompensa.puntos;

        // 2. Generar un código de validación aleatorio
        const codigoValidacion = Math.random().toString(36).substring(2, 7).toUpperCase();

        // 3. Agregar al historial (al inicio de la lista)
        const hoy = new Date();
        const fechaFormateada = hoy.toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });

        this.historial.unshift({
          actividad: `Canjeado - ${recompensa.titulo}`,
          fecha: fechaFormateada,
          puntos: recompensa.puntos,
          tipo: 'resta'
        });

        // 4. Mostrar cupón al usuario
        alert(`¡Canje Exitoso!\n\nTu código es: ${codigoValidacion}\nPresenta esta pantalla en recepción.`);
      }
    } else {
      alert('Lo sentimos, no tienes suficientes puntos para esta recompensa.');
    }
  }

  /**
   * Navegación hacia atrás
   */
  regresar(): void {
    this.backToHome.emit();
  }
}