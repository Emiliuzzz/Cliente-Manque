import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  AdminReservasService,
  AdminReserva,
} from '../../core/services/admin-reservas.service';

type FiltroEstado =
  | 'TODAS'
  | 'pendiente'
  | 'confirmada'
  | 'expirada'
  | 'cancelada';

@Component({
  standalone: true,
  selector: 'app-admin-reservas',
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container my-4">
      <!-- Título + botones -->
      <div
        class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2"
      >
        <div>
          <h2 class="mb-1">Reservas de clientes</h2>
          <p class="text-muted mb-0">
            Desde esta pantalla el administrador puede revisar las reservas
            realizadas por los clientes.
          </p>
        </div>

        <div class="d-flex gap-2">
          <button
            *ngIf="returnTo"
            type="button"
            class="btn btn-outline-secondary btn-sm"
            (click)="volverAReportes()"
          >
            ← Volver a reportes
          </button>

          <button
            type="button"
            class="btn btn-outline-dark btn-sm"
            (click)="irPanel()"
          >
            Panel admin
          </button>
        </div>
      </div>

      <!-- Mensajes de estado -->
      <div *ngIf="cargando" class="alert alert-info">Cargando reservas...</div>
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

      <!-- Filtros estado -->
      <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
        <span class="me-2 fw-semibold">Filtrar por estado:</span>

        <button
          type="button"
          class="btn btn-sm"
          [ngClass]="{
            'btn-primary': filtroEstado === 'TODAS',
            'btn-outline-primary': filtroEstado !== 'TODAS'
          }"
          (click)="cambiarFiltro('TODAS')"
        >
          Todas
        </button>

        <button
          type="button"
          class="btn btn-sm"
          [ngClass]="{
            'btn-warning': filtroEstado === 'pendiente',
            'btn-outline-warning': filtroEstado !== 'pendiente'
          }"
          (click)="cambiarFiltro('pendiente')"
        >
          Pendientes
        </button>

        <button
          type="button"
          class="btn btn-sm"
          [ngClass]="{
            'btn-success': filtroEstado === 'confirmada',
            'btn-outline-success': filtroEstado !== 'confirmada'
          }"
          (click)="cambiarFiltro('confirmada')"
        >
          Confirmadas
        </button>

        <button
          type="button"
          class="btn btn-sm"
          [ngClass]="{
            'btn-dark': filtroEstado === 'expirada',
            'btn-outline-dark': filtroEstado !== 'expirada'
          }"
          (click)="cambiarFiltro('expirada')"
        >
          Expiradas
        </button>

        <button
          type="button"
          class="btn btn-sm"
          [ngClass]="{
            'btn-secondary': filtroEstado === 'cancelada',
            'btn-outline-secondary': filtroEstado !== 'cancelada'
          }"
          (click)="cambiarFiltro('cancelada')"
        >
          Canceladas
        </button>
      </div>

      <!-- Rango fechas + búsqueda -->
      <div class="d-flex flex-wrap align-items-end gap-2 mb-3">
        <div style="max-width: 180px;">
          <label class="form-label small mb-1">Desde</label>
          <input
            class="form-control form-control-sm"
            type="date"
            [(ngModel)]="desde"
            (change)="aplicarQueryParams()"
          />
        </div>

        <div style="max-width: 180px;">
          <label class="form-label small mb-1">Hasta</label>
          <input
            class="form-control form-control-sm"
            type="date"
            [(ngModel)]="hasta"
            (change)="aplicarQueryParams()"
          />
        </div>

        <div class="ms-auto d-flex gap-2 align-items-center">
          <input
            class="form-control form-control-sm"
            style="max-width: 260px;"
            placeholder="Buscar (cliente, email, propiedad...)"
            [(ngModel)]="search"
            (keyup.enter)="aplicarQueryParams()"
          />
          <button
            class="btn btn-sm btn-outline-dark"
            (click)="aplicarQueryParams()"
            [disabled]="cargando"
          >
            Buscar
          </button>
          <button
            class="btn btn-sm btn-outline-secondary"
            (click)="limpiarFiltros()"
            [disabled]="cargando"
          >
            Limpiar
          </button>
        </div>
      </div>

      <!-- Tabla -->
      <div class="table-responsive" *ngIf="!cargando && reservas.length">
        <table class="table table-hover align-middle">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Propiedad</th>
              <th>Monto reserva</th>
              <th>Estado</th>
              <th>Creada</th>
              <th>Vence</th>
            </tr>
          </thead>

          <tbody>
            <tr
              *ngFor="let r of reservas"
              style="cursor:pointer"
              (click)="verDetalle(r.id)"
            >
              <td>
                <div class="fw-semibold">
                  {{ r.interesado?.nombre_completo || '—' }}
                </div>
                <div class="small text-muted">{{ r.interesado?.rut || '' }}</div>
                <div class="small text-muted">{{ r.interesado?.email || '' }}</div>
              </td>

              <td>
                <div class="fw-semibold">{{ r.propiedad?.titulo || '—' }}</div>
                <div class="small text-muted" *ngIf="r.propiedad?.codigo">
                  Cód: {{ r.propiedad?.codigo }}
                </div>
              </td>

              <td>
                <span>
                  {{ r.monto_reserva | currency:'CLP':'symbol-narrow':'1.0-0' }}
                </span>
              </td>

              <td>
                <span
                  class="badge"
                  [ngClass]="badgeClase(r.estado)"
                >
                  {{ etiquetaReserva(r.estado) }}
                </span>
              </td>

              <td class="small">{{ r.fecha | date:'short' }}</td>
              <td class="small">
                {{ r.expires_at ? (r.expires_at | date:'short') : '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!cargando && !reservas.length && !error" class="alert alert-light">
        No se encontraron reservas para el filtro seleccionado.
      </div>
    </div>
  `,
})
export class AdminReservasComponent implements OnInit {
  reservas: AdminReserva[] = [];
  cargando = false;
  error: string | null = null;

  filtroEstado: FiltroEstado = 'TODAS';

  desde = '';
  hasta = '';
  search = '';
  propiedadId = '';
  returnTo: string | null = null;

  constructor(
    private svc: AdminReservasService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((qp) => {
      this.returnTo = (qp['returnTo'] || '').trim() || null;

      const estadoQP = (qp['estado'] || '').trim().toLowerCase();
      const permitidos = ['pendiente', 'confirmada', 'expirada', 'cancelada'];

      this.filtroEstado = (permitidos.includes(estadoQP)
        ? (estadoQP as FiltroEstado)
        : 'TODAS');

      this.desde = (qp['desde'] || '').trim();
      this.hasta = (qp['hasta'] || '').trim();
      this.search = (qp['search'] || '').trim();
      this.propiedadId = (qp['propiedad_id'] || '').trim();

      this.cargar();
    });
  }

  cambiarFiltro(estado: FiltroEstado): void {
    if (this.filtroEstado === estado) return;
    this.filtroEstado = estado;
    this.aplicarQueryParams();
  }

  aplicarQueryParams(): void {
    const qp: any = {
      estado: this.filtroEstado !== 'TODAS' ? this.filtroEstado : undefined,
      desde: this.desde || undefined,
      hasta: this.hasta || undefined,
      search: this.search?.trim() || undefined,
      propiedad_id: this.propiedadId?.trim() || undefined,
      returnTo: this.returnTo || undefined,
    };

    Object.keys(qp).forEach((k) => (qp[k] == null ? delete qp[k] : null));

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: qp,
    });
  }

  limpiarFiltros(): void {
    this.filtroEstado = 'TODAS';
    this.desde = '';
    this.hasta = '';
    this.search = '';
    this.propiedadId = '';
    this.aplicarQueryParams();
  }

  private cargar(): void {
    this.cargando = true;
    this.error = null;

    this.svc
      .listar(
        this.filtroEstado,
        {
          desde: this.desde,
          hasta: this.hasta,
          search: this.search,
          propiedad_id: this.propiedadId,
        }
      )
      .subscribe({
        next: (lista) => {
          this.reservas = Array.isArray(lista) ? lista : [];
          this.cargando = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'No se pudieron cargar las reservas.';
          this.cargando = false;
        },
      });
  }

  etiquetaReserva(e: string): string {
    if (e === 'pendiente') return 'Pendiente';
    if (e === 'confirmada') return 'Confirmada';
    if (e === 'cancelada') return 'Cancelada';
    if (e === 'expirada') return 'Expirada';
    return e || '—';
  }

  badgeClase(estado: string): string {
    if (estado === 'pendiente') return 'text-bg-warning';
    if (estado === 'confirmada') return 'text-bg-success';
    if (estado === 'cancelada') return 'text-bg-secondary';
    if (estado === 'expirada') return 'text-bg-dark';
    return 'text-bg-light text-dark border';
  }

  verDetalle(id: number): void {
    const qp: any = {};
    if (this.returnTo) qp.returnTo = this.returnTo;

    this.router.navigate(['/admin/reservas', id], { queryParams: qp });
  }

  volverAReportes(): void {
    if (this.returnTo) this.router.navigateByUrl(this.returnTo);
    else this.router.navigate(['/admin/reportes']);
  }

  irPanel(): void {
    this.router.navigate(['/admin']);
  }
}
