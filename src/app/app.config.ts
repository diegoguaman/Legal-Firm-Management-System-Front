import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { clientsReducer } from './store/clients/clients.reducer';
import { ClientsEffects } from './store/clients/clients.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // NgRx Store configuration
    provideStore({
      clients: clientsReducer
      // Future features will be added here:
      // cases: casesReducer,
      // deadlines: deadlinesReducer
    }),
    // NgRx Effects configuration
    provideEffects([ClientsEffects]),
    // Store DevTools (only in development)
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode in production
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, // If set to true, will include stack trace for every dispatched action
      traceLimit: 75 // Maximum stack trace frames to be stored (in case trace option was provided as true)
    })
  ]
};
