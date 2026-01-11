import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  fotos?: PropiedadFoto[];
}

export interface CatalogoFiltros {
  ciudad?: string;
  tipo?: string;
  estado?: string;
  precio_min?: string | number;
  precio_max?: string | number;
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
    return { ...raw, fotos } as Propiedad;
  }

  // --- Catálogo público (con filtros) ---
  listarCatalogo(filtros?: CatalogoFiltros): Observable<Propiedad[]> {
    let params = new HttpParams();

    const clean = (v: any) => String(v ?? '').trim();

    if (filtros) {
      if (clean(filtros.ciudad)) params = params.set('ciudad', clean(filtros.ciudad));
      if (clean(filtros.tipo)) params = params.set('tipo', clean(filtros.tipo));
      if (clean(filtros.estado)) params = params.set('estado', clean(filtros.estado));
      if (clean(filtros.precio_min)) params = params.set('precio_min', clean(filtros.precio_min));
      if (clean(filtros.precio_max)) params = params.set('precio_max', clean(filtros.precio_max));
    }

    return this.http
      .get<any>(`${this.baseUrl}/catalogo/propiedades/`, { params })
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
      propiedad_id: propiedadId,
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
