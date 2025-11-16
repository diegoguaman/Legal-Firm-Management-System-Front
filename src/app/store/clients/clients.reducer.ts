/**
 * NgRx Reducer for Clients feature
 * Reducers are pure functions that define how state changes in response to actions
 * IMPORTANT: Reducers must be pure (no side effects) and immutable
 */
import { createReducer, on } from '@ngrx/store';
import { Client } from '../../models';
import * as ClientsActions from './clients.actions';

/**
 * State interface for Clients feature
 */
export interface ClientsState {
  items: Client[];
  loading: boolean;
  error: string | null;
  selectedClientId: string | null;
}

/**
 * Initial state
 */
export const initialState: ClientsState = {
  items: [],
  loading: false,
  error: null,
  selectedClientId: null
};

/**
 * Reducer function
 * Uses createReducer for type safety and less boilerplate
 */
export const clientsReducer = createReducer(
  initialState,
  
  // Load clients
  on(ClientsActions.loadClients, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ClientsActions.loadClientsSuccess, (state, { clients }) => ({
    ...state,
    items: clients,
    loading: false,
    error: null
  })),
  
  on(ClientsActions.loadClientsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Add client
  on(ClientsActions.addClient, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ClientsActions.addClientSuccess, (state, { client }) => ({
    ...state,
    items: [...state.items, client], // Immutable: create new array
    loading: false,
    error: null
  })),
  
  on(ClientsActions.addClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update client
  on(ClientsActions.updateClient, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ClientsActions.updateClientSuccess, (state, { client }) => ({
    ...state,
    items: state.items.map(item => 
      item.id === client.id ? client : item
    ), // Immutable: create new array with updated item
    loading: false,
    error: null
  })),
  
  on(ClientsActions.updateClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete client
  on(ClientsActions.deleteClient, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ClientsActions.deleteClientSuccess, (state, { clientId }) => ({
    ...state,
    items: state.items.filter(item => item.id !== clientId), // Immutable: create new array
    loading: false,
    error: null,
    selectedClientId: state.selectedClientId === clientId ? null : state.selectedClientId
  })),
  
  on(ClientsActions.deleteClientFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Select client
  on(ClientsActions.selectClient, (state, { clientId }) => ({
    ...state,
    selectedClientId: clientId
  })),
  
  on(ClientsActions.clearSelectedClient, (state) => ({
    ...state,
    selectedClientId: null
  }))
);

