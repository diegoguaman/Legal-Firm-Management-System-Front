/**
 * Application State Interface
 * Defines the shape of the entire application state
 */
import { ClientsState } from './clients/clients.reducer';

/**
 * Root state interface
 * Each feature has its own slice of state
 */
export interface AppState {
  clients: ClientsState;
  // Future features will be added here:
  // cases: CasesState;
  // deadlines: DeadlinesState;
}

