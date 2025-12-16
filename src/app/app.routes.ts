import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'catalogo' },

  {
    path: 'catalogo',
    loadComponent: () =>
      import('./features/catalogo/catalogo.component').then(
        (m) => m.Catalogo
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./features/auth/registro').then((m) => m.Registro),
  },
  {
    path: 'propiedad/:id',
    loadComponent: () =>
      import('./features/propiedad-detalle/propiedad-detalle.component').then(
        (m) => m.PropiedadDetalleComponent
      ),
  },

  // --------- Rutas por rol ---------

  // ADMIN
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin-dashboard').then(
        (m) => m.AdminDashboard
      ),
    // canActivate: [roleGuard],
    // data: { roles: ['ADMIN'] },
  },
  {
    path: 'admin/propiedades',
    loadComponent: () =>
      import('./features/admin/admin-propiedades-list').then(
        (m) => m.AdminPropiedadesListComponent
      ),
    // canActivate: [roleGuard],
    // data: { roles: ['ADMIN'] },
  },
  {
    path: 'admin/propiedades/nueva',
    loadComponent: () =>
      import('./features/admin/admin-propiedad-form').then(
        (m) => m.AdminPropiedadFormComponent
      ),
    // canActivate: [roleGuard],
    // data: { roles: ['ADMIN'] },
  },
  {
    path: 'admin/propiedades/:id',
    loadComponent: () =>
      import('./features/admin/admin-propiedad-form').then(
        (m) => m.AdminPropiedadFormComponent
      ),
    // canActivate: [roleGuard],
    // data: { roles: ['ADMIN'] },
  },
  {
    path: 'admin/solicitudes',
    loadComponent: () =>
      import('./features/admin/admin-solicitudes').then(
        (m) => m.AdminSolicitudesComponent
      ),
    // canActivate: [roleGuard],
    // data: { roles: ['ADMIN'] },
  },
  {
  path: 'admin/propietarios',
  loadComponent: () =>
    import('./features/admin/admin-propietarios').then(
      (m) => m.AdminPropietariosComponent
    ),
 },
  
  {
    path: 'admin/propietarios/:id',
    loadComponent: () =>
      import('./features/admin/admin-propietario-form').then(
        (m) => m.AdminPropietarioFormComponent
      ),
  },
  // PROPIETARIO
  {
    path: 'perfil',
    loadComponent: () =>
      import('./features/auth/perfil').then((m) => m.PerfilComponent),
    canActivate: [authGuard],
  },
  {
    path: 'mis-propiedades',
    loadComponent: () =>
      import('./features/propietario/mis-propiedades').then(
        (m) => m.MisPropiedades
      ),
    canActivate: [roleGuard],
    data: { roles: ['PROPIETARIO'] },
  },
  {
    path: 'propietario/nueva-propiedad',
    loadComponent: () =>
      import('./features/propietario/nueva-propiedad').then(
        (m) => m.NuevaPropiedadComponent
      ),
    canActivate: [roleGuard],
    data: { roles: ['PROPIETARIO'] },
  },
  {
    path: 'propietario/editar-propiedad/:id',
    loadComponent: () =>
      import('./features/propietario/editar-propiedad').then(
        (m) => m.EditarPropiedadComponent
      ),
    canActivate: [roleGuard],
    data: { roles: ['PROPIETARIO'] },
  },
  {
    path: 'propietario/propiedad/:id/fotos',
    loadComponent: () =>
      import('./features/propietario/gestionar-fotos').then(
        (m) => m.GestionarFotosComponent
      ),
    canActivate: [roleGuard],
    data: { roles: ['PROPIETARIO', 'ADMIN'] },
  },
  {
    path: 'propiedades/:id/historial',
    loadComponent: () =>
      import('./features/propietario/historial-propiedad').then(
        (m) => m.HistorialPropiedadComponent
      ),
    canActivate: [roleGuard],
    data: { roles: ['PROPIETARIO', 'ADMIN'] },
  },

  // CLIENTE
  {
    path: 'mis-solicitudes',
    loadComponent: () =>
      import('./features/cliente/mis-solicitudes').then(
        (m) => m.MisSolicitudes
      ),
    canActivate: [roleGuard],
    data: { roles: ['CLIENTE', 'ADMIN'] },
  },

  // Wildcard
  { path: '**', redirectTo: 'catalogo' },
];
