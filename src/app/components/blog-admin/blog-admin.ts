import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Publicacion {
  id: number;
  titulo: string;
  categoria: string;
  descripcionBreve: string;
  contenidoCompleto: string;
  urlImagen: string;
  autor: string;
  fecha: string;
  tiempoLectura: string;
}

@Component({
  selector: 'app-blog-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-admin.html',
  styleUrls: ['./blog-admin.css']
})
export class BlogAdminComponent {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();

  publicaciones: Publicacion[] = [
    {
      id: 1,
      titulo: 'Tendencias en Nail Art para esta Temporada',
      categoria: 'Manicure',
      descripcionBreve: 'Descubre los diseños más populares y modernos en arte de uñas.',
      contenidoCompleto: 'El nail art se ha convertido en una forma de expresión personal...',
      urlImagen: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=400',
      autor: 'Carolina Hernández',
      fecha: '2026-03-19',
      tiempoLectura: '3 min'
    },
    {
      id: 2,
      titulo: 'Cuidado y Mantenimiento del Manicure Francés',
      categoria: 'Manicure',
      descripcionBreve: 'El manicure francés clásico nunca pasa de moda.',
      contenidoCompleto: 'Aprende cómo mantener tus uñas impecables por más tiempo...',
      urlImagen: 'https://images.unsplash.com/photo-1634734341285-d850a99679ec?q=80&w=400',
      autor: 'María González',
      fecha: '2026-03-17',
      tiempoLectura: '5 min'
    }
  ];

  mostrarModal = false;
  editando = false;
  postForm: Publicacion = this.getNuevoPost();

  getNuevoPost(): Publicacion {
    return {
      id: 0, titulo: '', categoria: 'Manicure', descripcionBreve: '',
      contenidoCompleto: '', urlImagen: '', autor: '', fecha: '', tiempoLectura: ''
    };
  }

  abrirModalNuevo() {
    this.editando = false;
    this.postForm = this.getNuevoPost();
    this.mostrarModal = true;
  }

  abrirModalEditar(post: Publicacion) {
    this.editando = true;
    this.postForm = { ...post };
    this.mostrarModal = true;
  }

  guardarPost() {
    if (this.editando) {
      const index = this.publicaciones.findIndex(p => p.id === this.postForm.id);
      if (index !== -1) this.publicaciones[index] = this.postForm;
    } else {
      this.postForm.id = Date.now();
      this.publicaciones.push(this.postForm);
    }
    this.mostrarModal = false;
  }

  eliminarPost(id: number) {
    if(confirm('¿Estás seguro de eliminar esta publicación?')) {
      this.publicaciones = this.publicaciones.filter(p => p.id !== id);
    }
  }

  volverAlPanel() {
    this.navigate.emit('admin');
  }

  cerrarSesion() {
    this.logout.emit();
  }
}