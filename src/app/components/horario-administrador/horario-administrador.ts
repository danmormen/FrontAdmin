import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-horarios-administrador',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  // 👇 AQUÍ ESTÁ LA CORRECCIÓN: Nombres en singular sin la "s"
  templateUrl: './horario-administrador.html',
  styleUrls: ['./horario-administrador.css']
})
export class HorariosAdministradorComponent {
  @Output() back = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  mostrarModal = false;
  editando = false;
  seleccionado: any = null;

  // Datos basados en tu diseño de gestión de horarios
  listaEstilistas = [
    {
      id: 1,
      nombre: 'Ana Martínez',
      email: 'ana@ponteguapa.com',
      diasLaborables: 6,
      horasSemanales: 58,
      diasDescanso: 1,
      horario: [
        { nombre: 'Lunes', inicio: '09:00', fin: '18:00', activo: true },
        { nombre: 'Martes', inicio: '09:00', fin: '18:00', activo: true },
        { nombre: 'Miércoles', inicio: '09:00', fin: '18:00', activo: true },
        { nombre: 'Jueves', inicio: '09:00', fin: '18:00', activo: true },
        { nombre: 'Viernes', inicio: '09:00', fin: '20:00', activo: true },
        { nombre: 'Sábado', inicio: '10:00', fin: '21:00', activo: true },
        { nombre: 'Domingo', inicio: '00:00', fin: '00:00', activo: false },
      ]
    },
    {
      id: 2,
      nombre: 'Carmen López',
      email: 'carmen@ponteguapa.com',
      diasLaborables: 6,
      horasSemanales: 55,
      diasDescanso: 1,
      horario: [
        { nombre: 'Lunes', inicio: '10:00', fin: '19:00', activo: true },
        { nombre: 'Martes', inicio: '10:00', fin: '19:00', activo: true },
        { nombre: 'Miércoles', inicio: '10:00', fin: '19:00', activo: true },
        { nombre: 'Jueves', inicio: '10:00', fin: '19:00', activo: true },
        { nombre: 'Viernes', inicio: '10:00', fin: '20:00', activo: true },
        { nombre: 'Sábado', inicio: '09:00', fin: '18:00', activo: true },
        { nombre: 'Domingo', inicio: '00:00', fin: '00:00', activo: false },
      ]
    }
  ];

  regresar() { this.back.emit(); }
  cerrarSesion() { this.logout.emit(); }

  abrirModal() {
    this.editando = false;
    this.seleccionado = {
      nombre: '',
      horario: this.crearHorarioVacio()
    };
    this.mostrarModal = true;
  }

  editarHorario(estilista: any) {
    this.editando = true;
    this.seleccionado = JSON.parse(JSON.stringify(estilista)); 
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.seleccionado = null;
  }

  guardarCambios() {
    console.log('Datos actualizados:', this.seleccionado);
    this.cerrarModal();
  }

  private crearHorarioVacio() {
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return dias.map(d => ({ nombre: d, inicio: '09:00', fin: '18:00', activo: true }));
  }
}