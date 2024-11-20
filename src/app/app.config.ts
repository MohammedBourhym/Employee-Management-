import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'; // Import provideAnimations
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { authInterceptor } from './auth-interceptor.interceptor';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [

    CookieService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch(),withInterceptors([authInterceptor])),
    provideAnimations() // Add provideAnimations for Angular animations
  ]
};
