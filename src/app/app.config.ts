import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { routes } from './app.routes';
import { AuthInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ✅ Route provider
    provideRouter(routes),

    // ✅ HTTP client with DI interceptors
    provideHttpClient(withInterceptorsFromDi()),

    // ✅ Register custom AuthInterceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    // ✅ Import Angular modules for standalone components
    importProvidersFrom(
      RouterModule,
      FormsModule,
      ReactiveFormsModule,
      CommonModule
    )
  ]
};
