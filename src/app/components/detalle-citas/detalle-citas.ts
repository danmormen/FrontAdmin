import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DetalleCita {
  id: number;
  cliente: string;
  servicio: string;
  fecha: string;
  hora: string;
  duracion: string;
  precio: number;
  notas: string;
  estado: 'Completada';
}

@Component({
  selector: 'app-detalle-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-citas.html',
  styleUrls: ['./detalle-citas.css']
})
export class DetalleCitasComponent {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();

  searchQuery: string = '';

  
  historialCitas: DetalleCita[] = [
    {
      id: 1,
      cliente: 'María González',
      servicio: 'Corte de cabello',
      fecha: '23/3/2026',
      hora: '09:00',
      duracion: '45 min',
      precio: 280,
      notas: 'Cliente prefiere corte tipo bob',
      estado: 'Completada'
    },
    {
      id: 2,
      cliente: 'Ana Martínez',
      servicio: 'Coloración',
      fecha: '23/3/2026',
      hora: '10:00',
      duracion: '120 min',
      precio: 500,
      notas: 'Color rubio miel, tono 8.3',
      estado: 'Completada'
    },
    {
      id: 3,
      cliente: 'Laura Rodríguez',
      servicio: 'Manicure',
      fecha: '22/3/2026',
      hora: '14:00',
      duracion: '45 min',
      precio: 150,
      notas: 'Esmalte en gel, diseño minimalista',
      estado: 'Completada'
    }
  ];

  onBack() { this.navigate.emit('estilista'); }
  onLogout() { this.logout.emit(); }
}