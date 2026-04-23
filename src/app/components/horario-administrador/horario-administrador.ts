import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-horarios-administrador',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './horario-administrador.html',
  styleUrls: ['./horario-administrador.css']
})
export class HorariosAdministradorComponent implements OnInit {
  @Output() back = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  private apiUrl = 'http://localhost:3000/api/horarios';
  private usuariosUrl = 'http://localhost:3000/api/usuarios';
  
  listaEstilistas: any[] = [];
  listaEmpleadosSinHorario: any[] = []; 
  private todosLosUsuarios: any[] = []; 
  
  mostrarModal = false;
  editando = false;
  seleccionado: any = { id: null, horarios: [] }; // Inicializado para evitar errores de null

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarHorarios();
    this.preCargarUsuarios();
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // --- CARGAR DATOS ---
  
  cargarHorarios() {
    this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        // Al usar INNER JOIN en el backend, si no hay horarios, 'res' será []
        this.listaEstilistas = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar horarios:', err)
    });
  }

  preCargarUsuarios() {
    this.http.get<any[]>(this.usuariosUrl, { headers: this.getHeaders() }).subscribe({
      next: (usuarios) => {
        this.todosLosUsuarios = usuarios;
      },
      error: (err) => console.error('Error pre-cargando usuarios:', err)
    });
  }

  // --- ACCIONES DE MODAL ---

  abrirModalNuevo() {
    this.editando = false;
    
    // Filtrar: Solo usuarios (estilistas/admin) que NO estén ya en la lista de horarios
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
    this.editando = true;
    // Clonación profunda para no modificar la vista si cancelamos
    this.seleccionado = JSON.parse(JSON.stringify(estilista));
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.seleccionado = { id: null, horarios: [] };
    this.editando = false;
  }

  // --- PERSISTENCIA (GUARDAR Y ELIMINAR) ---

  guardarCambios() {
    // Validar que se haya seleccionado un ID en el dropdown si es nuevo
    if (!this.seleccionado.id || this.seleccionado.id === 'null') {
      alert('Debes seleccionar un empleado de la lista.');
      return;
    }

    const payload = {
      empleado_id: Number(this.seleccionado.id),
      horarios: this.seleccionado.horarios
    };

    this.http.post(`${this.apiUrl}/save`, payload, { headers: this.getHeaders() }).subscribe({
      next: () => {
        alert(this.editando ? 'Horario actualizado' : 'Horario creado con éxito');
        this.cerrarModal();
        this.cargarHorarios();    // Actualiza la lista principal (aparece la tarjeta)
        this.preCargarUsuarios(); // Actualiza los disponibles
      },
      error: (err) => {
        alert('Error al guardar: ' + (err.error?.details || 'Error de servidor'));
      }
    });
  }

  eliminarHorario(empleadoId: number) {
    if (confirm('¿Deseas eliminar el horario? El empleado volverá a estar disponible para asignación.')) {
      this.http.delete(`${this.apiUrl}/${empleadoId}`, { headers: this.getHeaders() }).subscribe({
        next: () => {
          alert('Horario eliminado');
          this.cargarHorarios();    // Al cargar con INNER JOIN, la tarjeta desaparecerá
          this.preCargarUsuarios(); // El empleado vuelve a ser elegible en "Nuevo"
        },
        error: (err) => alert('No se pudo eliminar.')
      });
    }
  }

  // --- UTILIDADES ---

  private crearHorarioVacio() {
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return dias.map(d => ({ 
      dia: d, 
      inicio: '09:00', 
      fin: '18:00', 
      descanso: false 
    }));
  }

  toggleDescanso(dia: any) {
    if (dia.descanso) {
      dia.inicio = null;
      dia.fin = null;
    } else {
      dia.inicio = '09:00';
      dia.fin = '18:00';
    }
  }

  regresar() { this.back.emit(); }
  cerrarSesion() { this.logout.emit(); }
}