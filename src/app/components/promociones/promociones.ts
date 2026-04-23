import { Component, EventEmitter, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promociones.html',
  styleUrl: './promociones.css'
})
export class PromocionesComponent implements OnInit {
  @Output() backToHome = new EventEmitter<void>();
  @Output() seleccionarPromo = new EventEmitter<string>();

  promociones: any[] = [];
  cargando = true;

  private apiUrl = 'http://localhost:3000/api/promociones';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef // ← Igual que en el admin
  ) {}

  ngOnInit() {
    this.cargarPromociones();
  }

  cargarPromociones() {
    this.cargando = true;
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.promociones = data.filter(p => p.activo === 1);
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

  regresar() {
    this.backToHome.emit();
  }

  irAReservar(nombreServicio: string) {
    this.seleccionarPromo.emit(nombreServicio);
  }
}