import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  console.log('ROLE GUARD URL:', state.url);
  console.log('TOKEN:', auth.getToken());
  console.log('PAYLOAD:', auth.getPayload());
  console.log('ROLE:', (auth.getPayload()?.rol || '').toString().toUpperCase());
  console.log('ALLOWED:', route.data?.['roles']);

  const token = auth.getToken();
  const payload = auth.getPayload();

  // No logueado
  if (!token || !payload || !auth.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { next: state.url } });
    return false;
  }

  const userRole = (payload.rol || '').toString().toUpperCase();
  const allowed: string[] = (route.data?.['roles'] || []).map((r: string) =>
    r.toUpperCase()
  );

  // Si no hay roles definidos, deja pasar
  if (allowed.length === 0) return true;

  // Admin entra a todo
  if (userRole === 'ADMIN') return true;

  // Rol exacto
  if (allowed.includes(userRole)) return true;

  router.navigate(['/catalogo']);
  return false;
};
