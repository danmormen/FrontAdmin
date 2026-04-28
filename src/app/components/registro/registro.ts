import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; 

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  @Output() onNavigate = new EventEmitter<string>();

  nombre:          string  = '';
  apellido:        string  = '';
  email:           string  = '';
  pass:            string  = '';
  fechaNacimiento: string  = '';
  mostrarPass:     boolean = false; // toggle del ojito

  constructor(private http: HttpClient) {}

  validarSoloNumeros(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

 
  formatearFecha(event: any) {
    let input = event.target.value.replace(/\D/g, ''); 
    let formatted = '';

    if (input.length > 0) {
      formatted = input.substring(0, 2); // Día
      if (input.length > 2) {
        formatted += '/' + input.substring(2, 4); // Mes
        if (input.length > 4) {
          formatted += '/' + input.substring(4, 8); // Año
        }
      }
    }
    this.fechaNacimiento = formatted;
  }

  registrar() {
    // Validar que la fecha esté completa
    if (this.fechaNacimiento.length < 10) {
      alert('Por favor, ingresa la fecha completa (DD/MM/AAAA)');
      return;
    }

    const [dia, mes, anio] = this.fechaNacimiento.split('/').map(Number);

    // Validaciones de lógica de calendario
    if (dia < 1 || dia > 31) { alert('Día inválido (01-31)'); return; }
    if (mes < 1 || mes > 12) { alert('Mes inválido (01-12)'); return; }

    // Validación de mayoría de edad 
    if (anio > 2008) {
      alert('Debes ser mayor de 18 años para registrarte.');
      return;
    }
    if (anio < 1920) {
      alert('Por favor, ingresa un año de nacimiento realista.');
      return;
    }

    // Validar campos vacíos
    if (this.nombre && this.apellido && this.email && this.pass) {
      
      // 3. Preparamos el payload mapeando tus variables locales a lo que espera el backend
      const datosRegistro = {
        nombre: this.nombre,
        apellido: this.apellido,
        email: this.email,
        password: this.pass, // ¡Atención aquí! Mapeamos 'pass' a 'password'
        fechaNacimiento: this.fechaNacimiento
      };

      // 4. Enviamos la petición POST al backend
      this.http.post('http://localhost:3000/api/auth/registro', datosRegistro)
        .subscribe({
          next: (respuesta: any) => {
            console.log('Registro exitoso desde Angular:', respuesta);
            
            // Opcional: Guardar el token si decides loguear al usuario inmediatamente
            if(respuesta.token) {
              localStorage.setItem('token', respuesta.token);
            }

            alert('¡Cuenta creada con éxito!');
            this.onNavigate.emit('login');
          },
          error: (errorRes) => {
            console.error('Error de registro:', errorRes);
            
            // Manejamos los mensajes de error que vengan de express-validator o la BD
            if (errorRes.error && errorRes.error.errores) {
              const mensajes = errorRes.error.errores.map((e: any) => e.msg).join('\n');
              alert('Revisa tus datos:\n' + mensajes);
            } else if (errorRes.error && errorRes.error.message) {
              alert('Error: ' + errorRes.error.message);
            } else {
              alert('Ocurrió un error de conexión con el servidor. Verifica que el backend esté corriendo.');
            }
          }
        });

    } else {
      alert('Por favor, completa todos los campos.');
    }
  }

  irALogin() {
    this.onNavigate.emit('login');
  }
}