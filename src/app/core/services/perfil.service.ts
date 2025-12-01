import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



export interface PropietarioPerfil {
  id: number;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  rut: string;
  telefono: string;
  email: string;
}

export interface ClientePerfil {
  id: number;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  rut: string;
  telefono: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private apiRoot = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getPerfilPropietario(): Observable<PropietarioPerfil> {
    return this.http.get<PropietarioPerfil>(
      `${this.apiRoot}/mi-perfil/propietario/`
    );
  }

  actualizarPerfilPropietario(
    data: Partial<PropietarioPerfil>
  ): Observable<PropietarioPerfil> {
    return this.http.put<PropietarioPerfil>(
      `${this.apiRoot}/mi-perfil/propietario/`,
      data
    );
  }


  getPerfilCliente(): Observable<ClientePerfil> {
  return this.http.get<ClientePerfil>(
    `${this.apiRoot}/mi-perfil/cliente/`
  );
  }

  actualizarPerfilCliente(
    data: Partial<ClientePerfil>
  ): Observable<ClientePerfil> {
    return this.http.put<ClientePerfil>(
      `${this.apiRoot}/mi-perfil/cliente/`,
      data
    );
  }

}
