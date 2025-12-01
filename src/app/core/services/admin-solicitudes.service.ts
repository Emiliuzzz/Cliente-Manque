import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminInteresadoResumido {
  id: number;
  nombre_completo: string;
  rut: string;
  email: string;
  telefono: string;
}

export interface AdminSolicitudCliente {
  id: number;
  tipo_operacion: 'COMPRA' | 'ARRIENDO' | string;
  tipo_propiedad: 'casa' | 'departamento' | 'oficina' | 'parcela' | 'bodega' | 'terreno' | string;
  ciudad: string;
  comuna: string;
  presupuesto_min: number | null;
  presupuesto_max: number | null;
  mensaje: string;
  estado: string;
  created_at: string;
  interesado: AdminInteresadoResumido | null;
}

@Injectable({ providedIn: 'root' })
export class AdminSolicitudesService {
  private apiRoot = environment.apiUrl.replace(/\/+$/, '');
  private apiAdminRoot = `${this.apiRoot}/admin`;

  constructor(private http: HttpClient) {}

  // LISTAR solicitudes
  listar(): Observable<AdminSolicitudCliente[]> {
    return this.http
      .get<any>(`${this.apiAdminRoot}/solicitudes-cliente/`)
      .pipe(
        map((resp) => {
          const data = Array.isArray(resp)
            ? resp
            : resp.results || resp.data || [];
          return (data || []) as AdminSolicitudCliente[];
        })
      );
  }

  // OBTENER detalle 
  getDetalle(id: number): Observable<AdminSolicitudCliente> {
    return this.http.get<AdminSolicitudCliente>(
      `${this.apiAdminRoot}/solicitudes-cliente/${id}/`
    );
  }

  // CAMBIAR estado de la solicitud 
  cambiarEstado(id: number, estado: string): Observable<AdminSolicitudCliente> {
    return this.http.patch<AdminSolicitudCliente>(
      `${this.apiAdminRoot}/solicitudes-cliente/${id}/`,
      { estado }
    );
  }
}
