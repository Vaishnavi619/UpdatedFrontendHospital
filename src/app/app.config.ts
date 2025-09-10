import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { routes } from './app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthInterceptor } from './auth.interceptor';

// ✅ Import NgChartsModule
import { NgChartsModule } from 'ng2-charts';

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

    // ✅ Import necessary Angular modules and ng2-charts
    importProvidersFrom(
      RouterModule,
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      HttpClientModule,
      NgChartsModule          // ✅ This line enables chart support!
    )
  ]
};
