/**
 * NgRx Actions for Clients feature
 * Actions describe events that happened in the application
 */
import { createAction, props } from '@ngrx/store';
import { Client } from '../../models';

/**
 * Load all clients
 */
export const loadClients = createAction('[Clients] Load Clients');

/**
 * Clients loaded successfully
 */
export const loadClientsSuccess = createAction(
  '[Clients] Load Clients Success',
  props<{ clients: Client[] }>()
);

/**
 * Failed to load clients
 */
export const loadClientsFailure = createAction(
  '[Clients] Load Clients Failure',
  props<{ error: string }>()
);

/**
 * Add a new client
 */
export const addClient = createAction(
  '[Clients] Add Client',
  props<{ client: Client }>()
);

/**
 * Client added successfully
 */
export const addClientSuccess = createAction(
  '[Clients] Add Client Success',
  props<{ client: Client }>()
);

/**
 * Failed to add client
 */
export const addClientFailure = createAction(
  '[Clients] Add Client Failure',
  props<{ error: string }>()
);

/**
 * Update an existing client
 */
export const updateClient = createAction(
  '[Clients] Update Client',
  props<{ client: Client }>()
);

/**
 * Client updated successfully
 */
export const updateClientSuccess = createAction(
  '[Clients] Update Client Success',
  props<{ client: Client }>()
);

/**
 * Failed to update client
 */
export const updateClientFailure = createAction(
  '[Clients] Update Client Failure',
  props<{ error: string }>()
);

/**
 * Delete a client (soft delete)
 */
export const deleteClient = createAction(
  '[Clients] Delete Client',
  props<{ clientId: string }>()
);

/**
 * Client deleted successfully
 */
export const deleteClientSuccess = createAction(
  '[Clients] Delete Client Success',
  props<{ clientId: string }>()
);

/**
 * Failed to delete client
 */
export const deleteClientFailure = createAction(
  '[Clients] Delete Client Failure',
  props<{ error: string }>()
);

/**
 * Select a client (for detail view)
 */
export const selectClient = createAction(
  '[Clients] Select Client',
  props<{ clientId: string }>()
);

/**
 * Clear selected client
 */
export const clearSelectedClient = createAction('[Clients] Clear Selected Client');

