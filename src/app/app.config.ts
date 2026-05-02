import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MessageService } from 'primeng/api';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { dateConverterInterceptor } from '../http-interceptor';
import { DialogService } from 'primeng/dynamicdialog';
import { DocumentSupportServicesProvider } from './services/chat-core/chat-documents/document-support-services.service';

// ─── Tooltip standard ────────────────────────────────────────────────────────
// Use PrimeNG's pTooltip directive on every icon-only button.
// Pattern:  pTooltip="Description"  tooltipPosition="top"
// Import TooltipModule individually in each component that needs tooltips.
// ─────────────────────────────────────────────────────────────────────────────

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([dateConverterInterceptor])
    ),
    DialogService,
    // MessageService at root so toast notifications work from any component.
    MessageService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    DocumentSupportServicesProvider,
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: false || 'none'
        }
      },
      ripple: true,
    }),
    provideAnimationsAsync()
  ]
};
