/**
 * Application State Interface
 * Defines the shape of the entire application state
 */
import { ClientsState } from './clients/clients.reducer';
import { CasesState } from './cases/cases.reducer';

/**
 * Root state interface
 * Each feature has its own slice of state
 */
export interface AppState {
  clients: ClientsState;
  cases: CasesState;
  // Future features will be added here:
  // deadlines: DeadlinesState;
}

