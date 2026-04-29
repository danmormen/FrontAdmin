import { Component, EventEmitter, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ClientNavbarComponent } from '../client-navbar/client-navbar';

@Component({
  selector: 'app-ver-cita',
  standalone: true,
  imports: [CommonModule, ClientNavbarComponent],
  templateUrl: './ver-cita.html',
  styleUrl: './ver-cita.css'
})
export class VerCitaComponent implements OnInit {
  @Output() navigate  = new EventEmitter<string>();
  @Output() modificar = new EventEmitter<any>();
  @Output() logout    = new EventEmitter<void>();

  private apiUrl = 'http://localhost:3000/api/citas';

  listaCitas: any[] = [];
  cargando  = true;
  error     = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarCitas();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }

  cargarCitas() {
    this.cargando = true;
    this.http.get<any[]>(this.apiUrl + '/mis-citas', { headers: this.getHeaders() }).subscribe({
      next: (data) => {
        this.listaCitas = data;
        this.cargando   = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar citas:', err);
        this.error    = 'No se pudieron cargar tus citas.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  onModificar(cita: any) { this.modificar.emit(cita); }

  onCancelar(cita: any) {
    if (!confirm('¿Estás seguro de cancelar tu cita de ' + cita.servicios + '?')) return;
    this.http.delete(this.apiUrl + '/' + cita.id, { headers: this.getHeaders() }).subscribe({
      next: () => { cita.estado = 'cancelada'; this.cdr.detectChanges(); },
      error: (err) => alert(err.error?.error || 'No se pudo cancelar la cita.')
    });
  }

  formatearFecha(fechaStr: string): string {
    if (!fechaStr) return '';
    const soloFecha = fechaStr.includes("T") ? fechaStr.split("T")[0] : fechaStr;
    const [y, m, d] = soloFecha.split("-").map(Number);
    const fecha = new Date(y, m - 1, d);
    return fecha.toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
                .replace(/^\w/, c => c.toUpperCase());
  }

  formatearHora(horaStr: string): string {
    if (!horaStr) return '';
    const [h, m] = horaStr.split(':');
    const hora   = parseInt(h);
    const ampm   = hora >= 12 ? 'PM' : 'AM';
    const h12    = hora % 12 || 12;
    return h12 + ':' + m + ' ' + ampm;
  }

  estadoClass(estado: string): string {
    const mapa: Record<string,string> = {
      confirmada:'tag-green', completada:'tag-blue',
      pendiente:'tag-yellow', cancelada:'tag-red'
    };
    return mapa[estado] ?? 'tag-yellow';
  }

  private readonly MAPA: Record<string,string> = {
    inicio:'home', reservar:'reservar', ver:'ver-cita',
    servicios:'servicios', promociones:'promociones',
    recompensas:'recompensas', resenas:'resenas', perfil:'perfil'
  };
  onNavigate(section: string) { this.navigate.emit(this.MAPA[section] ?? section); }
  cerrarSesion()               { this.logout.emit(); }
}
