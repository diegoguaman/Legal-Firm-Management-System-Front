/**
 * NgRx Selectors for Clients feature
 * Selectors extract data from the store efficiently
 * They are memoized (cached) for better performance
 */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientsState } from './clients.reducer';
import { Client } from '../../models';

/**
 * Feature selector - selects the clients feature state
 */
export const selectClientsState = createFeatureSelector<ClientsState>('clients');

/**
 * Select all clients
 */
export const selectAllClients = createSelector(
  selectClientsState,
  (state: ClientsState) => state.items
);

/**
 * Select loading state
 */
export const selectClientsLoading = createSelector(
  selectClientsState,
  (state: ClientsState) => state.loading
);

/**
 * Select error state
 */
export const selectClientsError = createSelector(
  selectClientsState,
  (state: ClientsState) => state.error
);

/**
 * Select selected client ID
 */
export const selectSelectedClientId = createSelector(
  selectClientsState,
  (state: ClientsState) => state.selectedClientId
);

/**
 * Select selected client (full object)
 * Combines multiple selectors
 */
export const selectSelectedClient = createSelector(
  selectAllClients,
  selectSelectedClientId,
  (clients: Client[], selectedId: string | null) => {
    if (!selectedId) {
      return null;
    }
    return clients.find(client => client.id === selectedId) || null;
  }
);

/**
 * Select client by ID (parameterized selector)
 * Returns a function that can be called with an ID
 */
export const selectClientById = (clientId: string) =>
  createSelector(
    selectAllClients,
    (clients: Client[]) => clients.find(client => client.id === clientId) || null
  );

/**
 * Select clients count
 */
export const selectClientsCount = createSelector(
  selectAllClients,
  (clients: Client[]) => clients.length
);

/**
 * Select clients by type
 */
export const selectClientsByType = (clientType: 'FISICO' | 'JURIDICO') =>
  createSelector(
    selectAllClients,
    (clients: Client[]) => clients.filter(client => client.client_type === clientType)
  );

