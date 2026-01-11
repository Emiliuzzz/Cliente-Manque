import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Contrato {
  id: number;
  tipo: 'venta' | 'arriendo';
  tipo_display?: string;
  fecha_firma: string;
  vigente: boolean;
  precio_pactado: number;
  propiedad?: { id: number; titulo: string; precio: number; ciudad: string; tipo: string };
  comprador_arrendatario?: { id: number; nombre_completo: string; rut: string };
  total_pagos?: number;
  saldo?: number;
  archivo_pdf_url?: string | null;
}

type ApiList<T> = T[] | { results: T[] };

@Injectable({ providedIn: 'root' })
export class ContratoService {
  private baseUrl = 'http://127.0.0.1:8000';
  constructor(private http: HttpClient) {}

  listar(): Observable<Contrato[]> {
    return this.http.get<ApiList<Contrato>>(`${this.baseUrl}/api/contratos/`).pipe(
      map((resp: any) => Array.isArray(resp) ? resp : (resp?.results ?? []))
    );
  }
}
