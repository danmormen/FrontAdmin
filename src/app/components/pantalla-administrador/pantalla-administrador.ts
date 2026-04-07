import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pantalla-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pantalla-administrador.html',
  styleUrls: ['./pantalla-administrador.css']
})
export class PantallaAdminComponent {
  @Output() navigate = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();

  navegarA(destino: string) {
    this.navigate.emit(destino);
  }

  cerrarSesion() {
    this.logout.emit();
  }
}