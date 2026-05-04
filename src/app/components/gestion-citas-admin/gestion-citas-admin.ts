import { Component, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar';

@Component({
  selector: 'app-gestion-citas-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbarComponent],
  templateUrl: './gestion-citas-admin.html',
  styleUrls: ['./gestion-citas-admin.css']
})
export class GestionCitasAdminComponent implements OnInit {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout   = new EventEmitter<void>();

  private apiUrl = 'http://localhost:3000/api';

  citas:    any[] = [];
  cargando  = true;
  error     = '';

  filtroBusqueda = '';
  filtroEstado   = '';
  filtroFecha    = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.cargarCitas(); }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: 'Bearer ' + token });
  }

  cargarCitas() {
    this.cargando = true;
    this.error    = '';
    let url = this.apiUrl + '/citas?';
    if (this.filtroFecha)  url += 'fecha='  + this.filtroFecha  + '&';
    if (this.filtroEstado) url += 'estado=' + this.filtroEstado + '&';

    this.http.get<any[]>(url, { headers: this.getHeaders() }).subscribe({
      next: (data) => { this.citas = data; this.cargando = false; this.cdr.detectChanges(); },
      error: () => { this.error = 'No se pudieron cargar las citas.'; this.cargando = false; this.cdr.detectChanges(); }
    });
  }

  get citasFiltradas(): any[] {
    if (!this.filtroBusqueda) return this.citas;
    const q = this.filtroBusqueda.toLowerCase();
    return this.citas.filter(c =>
      c.cliente_nombre?.toLowerCase().includes(q) ||
      c.servicios?.toLowerCase().includes(q) ||
      c.estilista_nombre?.toLowerCase().includes(q)
    );
  }

  cambiarEstado(cita: any, nuevoEstado: string) {
    this.http.patch(
      `${this.apiUrl}/citas/${cita.id}/estado`,
      { estado: nuevoEstado },
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => { cita.estado = nuevoEstado; this.cdr.detectChanges(); },
      error: (err) => alert('Error al cambiar estado: ' + (err.error?.error || 'Intenta de nuevo'))
    });
  }

  formatearFecha(fechaStr: string): string {
    if (!fechaStr) return '';
    const solo = fechaStr.includes('T') ? fechaStr.split('T')[0] : fechaStr;
    const [y, m, d] = solo.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-ES', {
      weekday: 'short', day: 'numeric', month: 'short'
    }).replace(/^\w/, c => c.toUpperCase());
  }

  formatearHora(hora: string): string {
    if (!hora) return '';
    const [hh, mm] = hora.split(':').map(Number);
    const ampm = hh >= 12 ? 'PM' : 'AM';
    return `${hh % 12 || 12}:${String(mm).padStart(2,'0')} ${ampm}`;
  }

  onFiltroChange() { this.cargarCitas(); }
  limpiarFiltros() { this.filtroEstado = ''; this.filtroFecha = ''; this.filtroBusqueda = ''; this.cargarCitas(); }
  onNavigate(dest: string) { this.navigate.emit(dest); }
  cerrarSesion()           { this.logout.emit(); }
}
