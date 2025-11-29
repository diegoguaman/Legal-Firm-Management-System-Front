/**
 * NgRx Reducer for Cases feature
 */
import { createReducer, on } from '@ngrx/store';
import { Case, CaseNationality } from '../../models';
import * as CasesActions from './cases.actions';

/**
 * State interface for Cases feature
 */
export interface CasesState {
  items: Case[];
  nationalities: Record<string, CaseNationality>; // case_id -> nationality
  loading: boolean;
  error: string | null;
  selectedCaseId: string | null;
}

/**
 * Initial state
 */
export const initialState: CasesState = {
  items: [],
  nationalities: {},
  loading: false,
  error: null,
  selectedCaseId: null
};

/**
 * Reducer function
 */
export const casesReducer = createReducer(
  initialState,
  
  // Load cases
  on(CasesActions.loadCases, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(CasesActions.loadCasesSuccess, (state, { cases, nationalities }) => {
    // Convert nationalities array to Record
    const nationalitiesMap: Record<string, CaseNationality> = {};
    nationalities.forEach(nat => {
      nationalitiesMap[nat.case_id] = nat;
    });
    
    return {
      ...state,
      items: cases,
      nationalities: nationalitiesMap,
      loading: false,
      error: null
    };
  }),
  
  on(CasesActions.loadCasesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Add case
  on(CasesActions.addCase, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(CasesActions.addCaseSuccess, (state, { case: newCase, nationality }) => {
    const updatedNationalities = { ...state.nationalities };
    
    if (nationality) {
      updatedNationalities[newCase.id] = nationality;
    }
    
    return {
      ...state,
      items: [...state.items, newCase],
      nationalities: updatedNationalities,
      loading: false,
      error: null
    };
  }),
  
  on(CasesActions.addCaseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update case
  on(CasesActions.updateCase, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(CasesActions.updateCaseSuccess, (state, { case: updatedCase }) => ({
    ...state,
    items: state.items.map(item => 
      item.id === updatedCase.id ? updatedCase : item
    ),
    loading: false,
    error: null
  })),
  
  on(CasesActions.updateCaseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Select case
  on(CasesActions.selectCase, (state, { caseId }) => ({
    ...state,
    selectedCaseId: caseId
  })),
  
  on(CasesActions.clearSelectedCase, (state) => ({
    ...state,
    selectedCaseId: null
  }))
);

