import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { MisReserva, MisContrato, MisPago } from './mis-propiedades.service';
import { environment } from '../../../environments/environment';

export interface NuevaSolicitud {
  id?: number;
  tipo_operacion: 'COMPRA' | 'ARRIENDO';
  tipo_propiedad:
    | 'casa'
    | 'departamento'
    | 'oficina'
    | 'parcela'
    | 'bodega'
    | 'terreno';
  ciudad: string;
  comuna: string;
  presupuesto_min?: number | null;
  presupuesto_max?: number | null;
  mensaje: string;
  estado?: string;
  created_at?: string;
}

export interface SolicitudClienteResumen {
  id: number;
  tipo_operacion: string;
  tipo_propiedad: string;
  ciudad: string;
  comuna: string;
  presupuesto_min: number | null;
  presupuesto_max: number | null;
  mensaje: string;
  estado: string;
  created_at: string;
}

export interface FiltrosMisReservas {
  estado?: string; 
  desde?: string;  
  hasta?: string; 
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class MisSolicitudesService {
  private apiRoot = environment.apiUrl.replace(/\/$/, '');

  constructor(private http: HttpClient) {}

  getMisReservas(params?: FiltrosMisReservas): Observable<MisReserva[]> {
    let httpParams = new HttpParams();
    const clean = (v: any) => String(v ?? '').trim();

    if (params) {
      if (clean(params.estado)) httpParams = httpParams.set('estado', clean(params.estado));
      if (clean(params.desde))  httpParams = httpParams.set('desde', clean(params.desde));
      if (clean(params.hasta))  httpParams = httpParams.set('hasta', clean(params.hasta));
      if (clean(params.search)) httpParams = httpParams.set('search', clean(params.search));
    }

    return this.http.get<any>(`${this.apiRoot}/reservas/`, { params: httpParams }).pipe(
      map((resp) => {
        const data = Array.isArray(resp) ? resp : resp.results;
        return (data || []) as MisReserva[];
      })
    );
  }

  cancelarReserva(id: number) {
    return this.http.post(`${this.apiRoot}/reservas/${id}/cancelar/`, {});
  }

  // --- Contratos del cliente ---
  getMisContratos(): Observable<MisContrato[]> {
    return this.http.get<any>(`${this.apiRoot}/mis-contratos/`).pipe(
      map((resp) => {
        const data = Array.isArray(resp) ? resp : resp.results;
        return (data || []) as MisContrato[];
      })
    );
  }

  // --- Pagos del cliente ---
  getMisPagos(): Observable<MisPago[]> {
    return this.http.get<any>(`${this.apiRoot}/mis-pagos/`).pipe(
      map((resp) => {
        const data = Array.isArray(resp) ? resp : resp.results;
        return (data || []) as MisPago[];
      })
    );
  }

  // --- Nueva solicitud del cliente ---
  crearSolicitud(data: Partial<NuevaSolicitud>): Observable<NuevaSolicitud> {
    return this.http.post<NuevaSolicitud>(
      `${this.apiRoot}/solicitudes-cliente/`,
      data
    );
  }

  // --- Solicitudes del cliente  ---
  getSolicitudesCliente(params?: { estado?: string; desde?: string; hasta?: string }): Observable<SolicitudClienteResumen[]> {
    let httpParams = new HttpParams();

    const clean = (v: any) => String(v ?? '').trim();

    if (params) {
      if (clean(params.estado)) httpParams = httpParams.set('estado', clean(params.estado));
      if (clean(params.desde))  httpParams = httpParams.set('desde', clean(params.desde)); // YYYY-MM-DD
      if (clean(params.hasta))  httpParams = httpParams.set('hasta', clean(params.hasta)); // YYYY-MM-DD
    }

    return this.http
      .get<any>(`${this.apiRoot}/cliente/mis-solicitudes/`, { params: httpParams })
      .pipe(
        map((resp) => {
          const data = Array.isArray(resp) ? resp : resp.results || resp.data || [];
          return (data || []) as SolicitudClienteResumen[];
        })
      );
   }

}
