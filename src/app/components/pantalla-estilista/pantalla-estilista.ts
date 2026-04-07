import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pantalla-estilista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pantalla-estilista.html',
  styleUrls: ['./pantalla-estilista.css']
})
export class PantallaEstilistaComponent {
  @Output() logout = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<string>();

  cerrarSesion() {
    this.logout.emit();
  }

  

  navegarA(modulo: string) {
    this.navigate.emit(modulo);
  }
}