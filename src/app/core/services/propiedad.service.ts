import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface PropiedadFoto {
  id: number;
  url: string;
  orden: number;
  principal: boolean;
}

export interface Propiedad {
  id: number;
  titulo: string;
  descripcion: string;
  direccion: string;
  ciudad: string;
  tipo: string;
  dormitorios: number;
  baos: number;
  metros2: number;
  precio: number;
  estado: string;
  // fotos que vienen del backend
  fotos?: PropiedadFoto[];
}

@Injectable({
  providedIn: 'root',
})
export class PropiedadService {
  private apiRoot = 'http://127.0.0.1:8000';
  private baseUrl = `${this.apiRoot}/api`;

  constructor(private http: HttpClient) {}

  // ---- Helpers ----
  private mapearFoto(raw: any): PropiedadFoto {
    const path = raw.url || raw.foto || '';
    const fullUrl =
      path && !String(path).startsWith('http')
        ? `${this.apiRoot}${path}`
        : path;

    return {
      id: raw.id,
      url: fullUrl,
      orden: raw.orden ?? 0,
      principal: !!raw.principal,
    };
  }

  private mapearPropiedad(raw: any): Propiedad {
    const fotos = (raw.fotos || []).map((f: any) => this.mapearFoto(f));
    return {
      ...raw,
      fotos,
    } as Propiedad;
  }

  // --- Catálogo público ---
  listarCatalogo(): Observable<Propiedad[]> {
    return this.http
      .get<any>(`${this.baseUrl}/catalogo/propiedades/`)
      .pipe(
        map((resp) => {
          const data = Array.isArray(resp) ? resp : resp.results || [];
          return (data || []).map((p: any) => this.mapearPropiedad(p));
        })
      );
  }

  // --- Detalle de una propiedad ---
  detalle(id: number): Observable<Propiedad> {
    return this.http
      .get<any>(`${this.baseUrl}/propiedades/${id}/`)
      .pipe(map((raw) => this.mapearPropiedad(raw)));
  }



  // --- Crear reserva ---  
  crearReserva(
  propiedadId: number,
  payload: { monto_reserva: number; notas?: string }
  ) {
    return this.http.post<any>(`${this.baseUrl}/reservas/`, {
      propiedad_id: propiedadId,  // <- OJO: ahora propiedad_id
      monto_reserva: payload.monto_reserva,
      notas: payload.notas || '',
    });
  }
    // --- Propiedades para admin ---
  getAdminPropiedades() {
    return this.http
      .get<any>(`${this.baseUrl}/admin/propiedades/`)
      .pipe(
        map((resp) => {
          const data = Array.isArray(resp) ? resp : resp.results || [];
          return (data || []).map((p: any) => this.mapearPropiedad(p));
        })
      );
  }
}