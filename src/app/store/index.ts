/**
 * Barrel export for store
 * Makes imports cleaner: import { selectAllClients } from '@store'
 */
export * from './app.state';
export * from './clients/clients.actions';
export { clientsReducer } from './clients/clients.reducer';
export type { ClientsState } from './clients/clients.reducer';
export * from './clients/clients.selectors';
export * from './clients/clients.effects';
export * from './cases/cases.actions';
export { casesReducer } from './cases/cases.reducer';
export type { CasesState } from './cases/cases.reducer';
export * from './cases/cases.selectors';
export * from './cases/cases.effects';

