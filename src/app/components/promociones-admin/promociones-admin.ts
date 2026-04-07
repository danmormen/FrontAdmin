import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Promocion {
  id: number;
  titulo: string;
  descripcion: string;
  descuento: number; // Porcentaje (ej. 50)
  precioOferta: number;
  fechaInicio: string;
  fechaFin: string;
  estado: boolean; // true = Activo, false = Inactivo
}

@Component({
  selector: 'app-promociones-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promociones-admin.html',
  styleUrls: ['./promociones-admin.css']
})
export class PromocionesAdminComponent {
  @Output() backToAdmin = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  promociones: Promocion[] = [
    { id: 1, titulo: 'Manicure + Pedicure', descripcion: '2x1 en servicios de manicure y pedicure', descuento: 50, precioOferta: 225, fechaInicio: '2026-02-28', fechaFin: '2026-03-30', estado: true },
    { id: 2, titulo: 'Tratamiento Facial', descripcion: 'Descuento especial en tratamientos faciales', descuento: 30, precioOferta: 280, fechaInicio: '2026-02-28', fechaFin: '2026-03-30', estado: true },
    { id: 3, titulo: 'Coloración', descripcion: 'Promoción especial en servicios de coloración', descuento: 25, precioOferta: 375, fechaInicio: '2026-03-31', fechaFin: '2026-04-29', estado: false }
  ];

  mostrarModal = false;
  editando = false;
  promoForm: Promocion = this.getNuevaPromo();

  getNuevaPromo(): Promocion {
    return { id: 0, titulo: '', descripcion: '', descuento: 0, precioOferta: 0, fechaInicio: '', fechaFin: '', estado: true };
  }

  abrirModalNuevo() {
    this.editando = false;
    this.promoForm = this.getNuevaPromo();
    this.mostrarModal = true;
  }

  abrirModalEditar(promo: Promocion) {
    this.editando = true;
    this.promoForm = { ...promo };
    this.mostrarModal = true;
  }

  guardarPromo() {
    if (this.editando) {
      const index = this.promociones.findIndex(p => p.id === this.promoForm.id);
      if (index !== -1) this.promociones[index] = this.promoForm;
    } else {
      this.promoForm.id = Date.now();
      this.promociones.push(this.promoForm);
    }
    this.mostrarModal = false;
  }

  eliminarPromo(id: number) {
    if(confirm('¿Seguro que deseas eliminar esta promoción?')) {
      this.promociones = this.promociones.filter(p => p.id !== id);
    }
  }

  cerrarSesion() {
    this.logout.emit();
  }
}