import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ✅ Provide routes
    provideRouter(routes),

    // ✅ Provide HTTP with DI interceptors
    provideHttpClient(withInterceptorsFromDi()),

    // ✅ Register custom HTTP interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    // ✅ Import modules required for standalone components
    importProvidersFrom(
      RouterModule,
      FormsModule,
      ReactiveFormsModule,
      CommonModule
    )
  ]
};
