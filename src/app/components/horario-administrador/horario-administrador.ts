import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar';

@Component({
  selector: 'app-horarios-administrador',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbarComponent],
  templateUrl: './horario-administrador.html',
  styleUrls: ['./horario-administrador.css']
})
export class HorariosAdministradorComponent implements OnInit {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout   = new EventEmitter<void>();

  private apiUrl      = 'http://localhost:3000/api/horarios';
  private usuariosUrl = 'http://localhost:3000/api/usuarios';

  listaEstilistas:          any[] = [];
  listaEmpleadosSinHorario: any[] = [];
  private todosLosUsuarios: any[] = [];

  mostrarModal = false;
  editando     = false;
  seleccionado: any = { id: null, horarios: [] };

  // ── Navegación de semana ──────────────────────────────────────────
  semanaOffset = 0; // 0 = semana actual, -1 = semana anterior, etc.
  diasDeSemana: { nombre: string; fecha: Date; etiqueta: string }[] = [];

  // Orden domingo a sábado
  private ORDEN_DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.calcularSemana();
    this.cargarHorarios();
    this.preCargarUsuarios();
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // ── Calcula las fechas de la semana actual + offset ───────────────
  calcularSemana() {
    const hoy    = new Date();
    // Ajusta al domingo de la semana actual
    const dia    = hoy.getDay(); // 0=Dom, 1=Lun, etc.
    const domingo = new Date(hoy);
    domingo.setDate(hoy.getDate() - dia + (this.semanaOffset * 7));

    this.diasDeSemana = this.ORDEN_DIAS.map((nombre, i) => {
      const fecha = new Date(domingo);
      fecha.setDate(domingo.getDate() + i);
      return {
        nombre,
        fecha,
        etiqueta: fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
      };
    });

    this.cdr.detectChanges();
  }

  // ── Título de la semana — ej. "3 - 9 Mayo 2026" ──────────────────
  get tituloSemana(): string {
    if (this.diasDeSemana.length === 0) return '';
    const inicio = this.diasDeSemana[0].fecha;
    const fin    = this.diasDeSemana[6].fecha;
    const mes    = fin.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    return `${inicio.getDate()} - ${fin.getDate()} ${mes.charAt(0).toUpperCase() + mes.slice(1)}`;
  }

  // ── Verifica si la semana mostrada es la actual ───────────────────
  get esSemanaActual(): boolean {
    return this.semanaOffset === 0;
  }

  semanaAnterior() {
    this.semanaOffset--;
    this.calcularSemana();
  }

  semanaSiguiente() {
    this.semanaOffset++;
    this.calcularSemana();
  }

  volverSemanaActual() {
    this.semanaOffset = 0;
    this.calcularSemana();
  }

  // ── Obtiene la fecha de un día específico para mostrarlo en la card ─
  getFechaDia(nombreDia: string): string {
    const dia = this.diasDeSemana.find(d => d.nombre === nombreDia);
    return dia ? dia.etiqueta : '';
  }

  // ── Carga horarios del backend ────────────────────────────────────
  cargarHorarios() {
    this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        // Reordena los horarios de cada estilista de Dom a Sáb
        this.listaEstilistas = res.map(estilista => ({
          ...estilista,
          horarios: this.reordenarHorarios(estilista.horarios)
        }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar horarios:', err)
    });
  }

  // ── Reordena los días de un estilista de Dom a Sáb ───────────────
  private reordenarHorarios(horarios: any[]): any[] {
    return this.ORDEN_DIAS.map(dia =>
      horarios.find(h => h.dia === dia) || { dia, inicio: null, fin: null, descanso: true }
    );
  }

  preCargarUsuarios() {
    this.http.get<any[]>(this.usuariosUrl, { headers: this.getHeaders() }).subscribe({
      next: (usuarios) => { this.todosLosUsuarios = usuarios; },
      error: (err) => console.error('Error pre-cargando usuarios:', err)
    });
  }

  // ── Modal nuevo horario ───────────────────────────────────────────
  abrirModalNuevo() {
    this.editando = false;
    const idsConHorario = this.listaEstilistas.map(e => e.id);
    this.listaEmpleadosSinHorario = this.todosLosUsuarios.filter(u =>
      (u.rol === 'estilista' || u.rol === 'admin') && !idsConHorario.includes(u.id)
    );
    this.seleccionado = {
      id: null,
      nombre: '',
      horarios: this.crearHorarioVacio()
    };
    this.mostrarModal = true;
  }

  editarHorario(estilista: any) {
    this.editando    = true;
    this.seleccionado = JSON.parse(JSON.stringify(estilista));
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.seleccionado = { id: null, horarios: [] };
    this.editando     = false;
  }

  // ── Guarda el horario en el backend ──────────────────────────────
  guardarCambios() {
    if (!this.seleccionado.id || this.seleccionado.id === 'null') {
      alert('Debes seleccionar un empleado de la lista.');
      return;
    }

    const payload = {
      empleado_id: Number(this.seleccionado.id),
      horarios:    this.seleccionado.horarios
    };

    this.http.post(`${this.apiUrl}/save`, payload, { headers: this.getHeaders() }).subscribe({
      next: () => {
        alert(this.editando ? 'Horario actualizado' : 'Horario creado con éxito');
        this.cerrarModal();
        this.cargarHorarios();
        this.preCargarUsuarios();
      },
      error: (err) => alert('Error al guardar: ' + (err.error?.details || 'Error de servidor'))
    });
  }

  eliminarHorario(empleadoId: number) {
    if (confirm('¿Deseas eliminar el horario? El empleado volverá a estar disponible.')) {
      this.http.delete(`${this.apiUrl}/${empleadoId}`, { headers: this.getHeaders() }).subscribe({
        next: () => {
          alert('Horario eliminado');
          this.cargarHorarios();
          this.preCargarUsuarios();
        },
        error: () => alert('No se pudo eliminar.')
      });
    }
  }

  // ── Crea horario vacío de Dom a Sáb ──────────────────────────────
  private crearHorarioVacio() {
    return this.ORDEN_DIAS.map(d => ({
      dia:      d,
      inicio:   d === 'Domingo' ? null : '09:00',
      fin:      d === 'Domingo' ? null : '18:00',
      descanso: d === 'Domingo' // Domingo en descanso por defecto
    }));
  }

  toggleDescanso(dia: any) {
    if (dia.descanso) {
      dia.inicio = null;
      dia.fin    = null;
    } else {
      dia.inicio = '09:00';
      dia.fin    = '18:00';
    }
  }

  onNavigate(dest: string) { this.navigate.emit(dest); }
  cerrarSesion()           { this.logout.emit(); }
}