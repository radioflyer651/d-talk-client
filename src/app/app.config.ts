import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import Material from '@primeng/themes/material';
import Lara from '@primeng/themes/lara';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { dateConverterInterceptor } from '../http-interceptor';
import { DialogService } from 'primeng/dynamicdialog';
import { DocumentSupportServicesProvider } from './services/chat-core/chat-documents/document-support-services.service';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([dateConverterInterceptor])
    ),
    DialogService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    DocumentSupportServicesProvider,
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: false || 'none'
        }
      }
    }),
    provideAnimationsAsync()
  ]
};
