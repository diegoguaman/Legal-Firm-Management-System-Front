/**
 * Barrel export for store
 * Makes imports cleaner: import { selectAllClients } from '@store'
 */
export * from './app.state';
export * from './clients/clients.actions';
export * from './clients/clients.reducer';
export * from './clients/clients.selectors';
export * from './clients/clients.effects';

