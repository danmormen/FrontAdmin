import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estilista-horario', 
  standalone: true,
  imports: [CommonModule],
  templateUrl: './horario-estilista.html',
  styleUrls: ['./horario-estilista.css']
})
export class EstilistaHorarioComponent implements OnInit {
  // Eventos para comunicarse con el componente padre (App)
  @Output() back = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  // diseño de tarjetas
  horarioSemanal = [
    { nombre: 'Lunes', horas: '09:00 - 18:00', totalHoras: 9, estaActivo: true },
    { nombre: 'Martes', horas: '09:00 - 18:00', totalHoras: 9, estaActivo: true },
    { nombre: 'Miércoles', horas: '09:00 - 18:00', totalHoras: 9, estaActivo: true },
    { nombre: 'Jueves', horas: '09:00 - 18:00', totalHoras: 9, estaActivo: true },
    { nombre: 'Viernes', horas: '09:00 - 20:00', totalHoras: 11, estaActivo: true },
    { nombre: 'Sábado', horas: '10:00 - 21:00', totalHoras: 11, estaActivo: true },
    { nombre: 'Domingo', horas: 'Día de descanso', totalHoras: 0, estaActivo: false }
  ];

  // Variables calculadas para el resumen inferior
  diasLaborables = 0;
  horasSemanalesTotal = 0;
  diasDescansoCount = 0;

  ngOnInit(): void {
    this.calcularResumenSemanal();
  }

  calcularResumenSemanal(): void {
    this.horasSemanalesTotal = this.horarioSemanal.reduce((acc, dia) => acc + dia.totalHoras, 0);
    this.diasLaborables = this.horarioSemanal.filter(dia => dia.estaActivo).length;
    this.diasDescansoCount = this.horarioSemanal.filter(dia => !dia.estaActivo).length;
  }

  // Navegación de regreso al panel principal del estilista
  regresar(): void {
    this.back.emit();
  }

  // Cierre de sesión
  cerrarSesion(): void {
    this.logout.emit();
  }
}