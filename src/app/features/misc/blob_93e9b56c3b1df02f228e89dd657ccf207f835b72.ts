import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { PropiedadService, Propiedad } from '../../core/services/propiedad.service';

@Component({
  standalone: true,
  selector: 'app-catalogo',
  imports: [CommonModule, RouterLink, FormsModule], // ✅ Y ESTO
  templateUrl: './catalogo.html',
})
export class Catalogo implements OnInit {
  propiedades: Propiedad[] = [];
  cargando = false;
  error?: string;

  filtros = {
    ciudad: '',
    tipo: '',
    estado: '',
    precio_min: '',
    precio_max: '',
  };

  constructor(private propSrv: PropiedadService) {}

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.cargando = true;
    this.error = undefined;

    this.propSrv.listarCatalogo(this.filtros).subscribe({
      next: (data) => {
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

  limpiar(): void {
    this.filtros = {
      ciudad: '',
      tipo: '',
      estado: '',
      precio_min: '',
      precio_max: '',
    };
    this.buscar();
  }
}
