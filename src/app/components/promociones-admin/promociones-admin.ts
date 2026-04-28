import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar';

@Component({
  selector: 'app-promociones-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbarComponent],
  templateUrl: './promociones-admin.html',
  styleUrls: ['./promociones-admin.css']
})
export class PromocionesAdminComponent implements OnInit {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout   = new EventEmitter<void>();

  promociones: any[] = [];
  mostrarModal = false;
  editando = false;
  guardando = false;
  cargando = true; // ← Estado de carga para feedback visual
  promoForm: any = this.getNuevaPromo();

  private apiUrl = 'http://localhost:3000/api/promociones';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef // ← Inyectamos el detector
  ) {}

  ngOnInit() {
    this.cargarPromociones();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  cargarPromociones() {
    this.cargando = true;
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.promociones = data;
        this.cargando = false;
        this.cdr.detectChanges(); // ← Fuerza actualización de la vista
      },
      error: (err) => {
        console.error('Error al cargar promociones:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  getNuevaPromo() {
    return {
      id: 0,
      titulo: '',
      descripcion: '',
      codigo: '',
      tipo_descuento: 'porcentaje',
      valor_descuento: 0,
      fecha_inicio: '',
      fecha_fin: '',
      limite_usos: null,
      activo: 1
    };
  }

  abrirModalNuevo() {
    this.editando = false;
    this.guardando = false;
    this.promoForm = this.getNuevaPromo();
    this.mostrarModal = true;
  }

  abrirModalEditar(promo: any) {
    this.editando = true;
    this.guardando = false;
    this.promoForm = {
      ...promo,
      fecha_inicio: promo.fecha_inicio ? promo.fecha_inicio.split('T')[0] : '',
      fecha_fin: promo.fecha_fin ? promo.fecha_fin.split('T')[0] : ''
    };
    this.mostrarModal = true;
  }

  guardarPromo() {
    if (this.guardando) return;

    if (!this.promoForm.titulo?.trim()) {
      return alert('El título es obligatorio.');
    }
    if (!this.promoForm.codigo?.trim()) {
      return alert('El código de cupón es obligatorio.');
    }
    if (!this.promoForm.valor_descuento || this.promoForm.valor_descuento <= 0) {
      return alert('El descuento debe ser mayor a 0.');
    }
    if (this.promoForm.valor_descuento > 100) {
      return alert('El descuento no puede ser mayor a 100%.');
    }
    if (!this.promoForm.fecha_inicio || !this.promoForm.fecha_fin) {
      return alert('Las fechas de inicio y fin son obligatorias.');
    }

    const inicio = new Date(this.promoForm.fecha_inicio);
    const fin    = new Date(this.promoForm.fecha_fin);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      return alert('Una o ambas fechas no son válidas.');
    }
    if (fin < inicio) {
      return alert('La fecha de fin no puede ser anterior a la fecha de inicio.');
    }

    const payload = {
      ...this.promoForm,
      codigo:          this.promoForm.codigo.trim().toUpperCase(),
      valor_descuento: Math.round(Number(this.promoForm.valor_descuento)),
      limite_usos:     this.promoForm.limite_usos ? Number(this.promoForm.limite_usos) : null,
      activo:          Number(this.promoForm.activo)
    };

    const headers  = this.getAuthHeaders();
    this.guardando = true;

    if (this.editando) {
      this.http.put(`${this.apiUrl}/${payload.id}`, payload, { headers }).subscribe({
        next: () => {
          this.mostrarModal = false;
          this.promoForm    = this.getNuevaPromo();
          this.guardando    = false;
          this.cargarPromociones();
        },
        error: (err) => {
          this.guardando = false;
          alert('Error al actualizar: ' + (err.error?.error || err.message));
        }
      });
    } else {
      this.http.post(this.apiUrl, payload, { headers }).subscribe({
        next: () => {
          this.mostrarModal = false;
          this.promoForm    = this.getNuevaPromo();
          this.guardando    = false;
          this.cargarPromociones();
        },
        error: (err) => {
          this.guardando = false;
          alert('Error al crear: ' + (err.error?.error || err.message));
        }
      });
    }
  }

  eliminarPromo(id: number) {
    if (confirm('¿Seguro que deseas eliminar esta promoción?')) {
      const headers = this.getAuthHeaders();
      this.http.delete(`${this.apiUrl}/${id}`, { headers }).subscribe({
        next: () => this.cargarPromociones(),
        error: (err) => alert('Error al eliminar: ' + (err.error?.error || err.message))
      });
    }
  }

  onNavigate(dest: string) { this.navigate.emit(dest); }
  cerrarSesion()           { this.logout.emit(); }
}