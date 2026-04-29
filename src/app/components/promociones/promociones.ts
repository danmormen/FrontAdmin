import { Component, EventEmitter, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ClientNavbarComponent } from '../client-navbar/client-navbar';

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [CommonModule, ClientNavbarComponent],
  templateUrl: './promociones.html',
  styleUrl: './promociones.css'
})
export class PromocionesComponent implements OnInit {
  @Output() navigate         = new EventEmitter<string>();
  @Output() seleccionarPromo = new EventEmitter<string>();
  @Output() logout           = new EventEmitter<void>();

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

  private readonly MAPA: Record<string,string> = {
    inicio:'home', reservar:'reservar', ver:'ver-cita',
    servicios:'servicios', promociones:'promociones',
    recompensas:'recompensas', resenas:'resenas', perfil:'perfil'
  };

  onNavigate(section: string) { this.navigate.emit(this.MAPA[section] ?? section); }
  cerrarSesion()              { this.logout.emit(); }
  irAReservar(nombre: string) { this.seleccionarPromo.emit(nombre); }
}