import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  AdminPropiedadesService,
  AdminPropiedadResumen,
  EstadoAprobacion,
} from '../../core/services/admin-propiedades.service';

@Component({
  standalone: true,
  selector: 'app-admin-propiedades-list',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container my-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="mb-0">Propiedades (administrador)</h2>
        <button class="btn btn-primary" [routerLink]="['/admin/propiedades/nueva']">
          Crear nueva propiedad
        </button>
      </div>

      <p class="text-muted mb-3">
        Listado de propiedades registradas en el sistema Manque. Desde aquí el
        administrador puede gestionarlas (aprobar, pausar, revisar datos, etc.).
      </p>

      <div *ngIf="cargando" class="alert alert-info">
        Cargando propiedades...
      </div>
      <div *ngIf="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div *ngIf="!cargando && propiedades.length === 0 && !error" class="alert alert-info">
        No hay propiedades registradas.
      </div>

      <div class="table-responsive" *ngIf="!cargando && propiedades.length > 0">
        <table class="table table-striped align-middle">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Propietario</th>
              <th>Ciudad</th>
              <th>Tipo</th>
              <th class="text-end">Precio</th>
              <th>Estado</th>
              <th>Aprobación</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of propiedades">
              <td>{{ p.id }}</td>
              <td>{{ p.titulo }}</td>
              <td>
                <div class="fw-semibold">
                  {{ p.propietario?.primer_nombre }} {{ p.propietario?.primer_apellido }}
                </div>
                <div class="text-muted small">
                  {{ p.propietario?.rut }} · {{ p.propietario?.email }}
                </div>
              </td>
              <td>{{ p.ciudad }}</td>
              <td>{{ p.tipo | titlecase }}</td>
              <td class="text-end">
                {{ p.precio | currency:'CLP':'symbol-narrow' }}
              </td>
              <td>{{ p.estado | titlecase }}</td>
              <td>
                <span
                  class="badge"
                  [ngClass]="{
                    'bg-warning text-dark': p.estado_aprobacion === 'pendiente',
                    'bg-success': p.estado_aprobacion === 'aprobada',
                    'bg-danger': p.estado_aprobacion === 'rechazada'
                  }"
                >
                  {{ p.estado_aprobacion | titlecase }}
                </span>
              </td>
              <td class="text-end">
                <td class="text-end">
                  <!-- Botones de aprobación -->
                  <button
                    *ngIf="p.estado_aprobacion === 'pendiente'"
                    class="btn btn-sm btn-success me-2"
                    (click)="cambiarAprobacion(p, 'aprobada')"
                  >
                    Aprobar
                  </button>

                  <button
                    *ngIf="p.estado_aprobacion === 'pendiente'"
                    class="btn btn-sm btn-danger me-2"
                    (click)="cambiarAprobacion(p, 'rechazada')"
                  >
                    Rechazar
                  </button>

                  <!-- 🔹 Botón para fotos: siempre visible -->
                  <button
                    class="btn btn-sm btn-outline-primary me-2"
                    [routerLink]="['/propietario/propiedad', p.id, 'fotos']"
                  >
                    {{ p.tiene_fotos ? 'Gestionar fotos' : 'Subir fotos' }}
                  </button>

                  <!-- Ver / editar detalle -->
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    (click)="verDetalle(p.id)"
                  >
                    Ver / editar
                  </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AdminPropiedadesListComponent implements OnInit {
  propiedades: AdminPropiedadResumen[] = [];
  cargando = false;
  error: string | null = null;

  constructor(
    private adminPropsSvc: AdminPropiedadesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando = true;
    this.error = null;

    this.adminPropsSvc.getPropiedades().subscribe({
      next: (data) => {
        this.propiedades = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar las propiedades.';
        this.cargando = false;
      },
    });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/admin/propiedades', id]);
  }

  cambiarAprobacion(
    prop: AdminPropiedadResumen,
    nuevoEstado: EstadoAprobacion
  ): void {
    if (!confirm(`¿Seguro que quieres marcar la propiedad "${prop.titulo}" como ${nuevoEstado}?`)) {
      return;
    }

    this.adminPropsSvc.cambiarEstadoAprobacion(prop.id, nuevoEstado).subscribe({
      next: () => {
        prop.estado_aprobacion = nuevoEstado;
      },
      error: (err) => {
        console.error(err);
        alert('No se pudo actualizar el estado de aprobación.');
      },
    });
  }
}
