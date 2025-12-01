import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

// Tipo local solo para este componente
interface RegistroPayload {
  nombre: string;
  email: string;
  password: string;
}

@Component({
  standalone: true,
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss'],
})
export class Registro {
  form: RegistroPayload = {
    nombre: '',
    email: '',
    password: '',
  };

  loading = false;
  errorMsg: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  registrar(): void {
    this.errorMsg = null;

    // Validaciones básicas en el front
    if (!this.form.email || !this.form.password) {
      this.errorMsg = 'El correo y la contraseña son obligatorios.';
      return;
    }

    if (this.form.password.length < 6) {
      this.errorMsg = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.loading = true;
    console.log('Enviando registro desde front:', this.form);

    this.auth.registrar(this.form).subscribe({
      next: (resp: any) => {
        this.loading = false;
        console.log('Respuesta registro:', resp);
        alert(
          resp?.detail ??
            'Cuenta creada correctamente. Ahora puedes iniciar sesión.'
        );
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error en registro:', err);
        this.errorMsg =
          err.error?.detail ??
          'Ocurrió un error al registrar el usuario. Intenta nuevamente.';
      },
    });
  }
}
