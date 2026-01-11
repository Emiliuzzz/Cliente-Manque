import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminPropietario {
  id: number;
  primer_nombre: string;
  segundo_nombre: string | null;
  primer_apellido: string;
  segundo_apellido: string | null;
  rut: string;
  telefono: string;
  email: string;
}

export type EstadoAprobacion = 'pendiente' | 'aprobada' | 'rechazada' | 'pausada';

export interface AdminPropiedadResumen {
  id: number;
  titulo: string;
  ciudad: string;
  tipo: string;
  precio: number;
  estado: string;
  estado_aprobacion: EstadoAprobacion;
  tiene_fotos: boolean;
  fecha_registro?: string; // si tu backend lo entrega
  propietario: {
    primer_nombre: string;
    primer_apellido: string;
    rut: string;
    email: string;
    telefono?: string;
  };
}

export interface NuevaPropiedadAdmin {
  propietario_id: number;
  titulo: string;
  direccion: string;
  ciudad: string;
  descripcion?: string;
  tipo: string;
  dormitorios: number;
  baos: number;
  metros2: number;
  precio: number;
  estado?: string;
  estado_aprobacion?: EstadoAprobacion;
  orientacion?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminPropiedadesService {
  private apiRoot = environment.apiUrl.replace(/\/+$/, '');
  private apiAdminRoot = `${this.apiRoot}/admin`;

  constructor(private http: HttpClient) {}

  // LISTAR 
  listar(): Observable<AdminPropiedadResumen[]> {
    return this.http.get<any>(`${this.apiAdminRoot}/propiedades/`).pipe(
      map((resp) => {
        const data = Array.isArray(resp) ? resp : resp.results || resp.data || [];
        return (data || []) as AdminPropiedadResumen[];
      })
    );
  }

  // CREAR
  crearPropiedad(data: NuevaPropiedadAdmin): Observable<any> {
    return this.http.post<any>(`${this.apiAdminRoot}/propiedades/`, data);
  }

  // DETALLE
  getPropiedad(id: number): Observable<NuevaPropiedadAdmin & { id: number }> {
    return this.http.get<NuevaPropiedadAdmin & { id: number }>(
      `${this.apiAdminRoot}/propiedades/${id}/`
    );
  }

  // ACTUALIZAR COMPLETA
  actualizarPropiedad(id: number, data: Partial<NuevaPropiedadAdmin>): Observable<any> {
    return this.http.put<any>(`${this.apiAdminRoot}/propiedades/${id}/`, data);
  }

  // CAMBIAR SOLO ESTADO_APROBACION
  cambiarEstadoAprobacion(id: number, estado_aprobacion: EstadoAprobacion): Observable<any> {
    return this.http.patch<any>(`${this.apiAdminRoot}/propiedades/${id}/`, { estado_aprobacion });
  }
  // HISTORIAL DE CAMBIOS
  getHistorial(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiRoot}/propiedades/${id}/historial/`);
  }

}
