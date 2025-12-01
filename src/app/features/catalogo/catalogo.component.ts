import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropiedadService, Propiedad } from '../../core/services/propiedad.service';

@Component({
  standalone: true,
  selector: 'app-catalogo',
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogo.html',
})
export class Catalogo implements OnInit {
  propiedades: Propiedad[] = [];
  cargando = false;
  error?: string;

  constructor(private propSrv: PropiedadService) {}

  ngOnInit(): void {
    this.cargando = true;
    this.propSrv.listarCatalogo().subscribe({
      next: (data) => {
        console.log('Datos recibidos del backend:', data);
        this.propiedades = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar propiedades', err);
        this.error = 'No fue posible cargar las propiedades.';
        this.cargando = false;
      },
    });
  }
}
