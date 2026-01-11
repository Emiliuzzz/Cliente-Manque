import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import localeEsCl from '@angular/common/locales/es-CL';
import { registerLocaleData } from '@angular/common';

import { routes } from './app.routes';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

const authInterceptor = (req: any, next: any) => {
  const token = localStorage.getItem('token');
  if (token) req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  return next(req);
};

registerLocaleData(localeEsCl);

export const appConfig: ApplicationConfig = {
  providers: [ {provide: LOCALE_ID, useValue: 'es-CL' },
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};

