/**
 * NgRx Selectors for Cases feature
 */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CasesState } from './cases.reducer';
import { Case, CaseNationality } from '../../models';

/**
 * Feature selector
 */
export const selectCasesState = createFeatureSelector<CasesState>('cases');

/**
 * Select all cases
 */
export const selectAllCases = createSelector(
  selectCasesState,
  (state: CasesState) => state.items
);

/**
 * Select loading state
 */
export const selectCasesLoading = createSelector(
  selectCasesState,
  (state: CasesState) => state.loading
);

/**
 * Select error state
 */
export const selectCasesError = createSelector(
  selectCasesState,
  (state: CasesState) => state.error
);

/**
 * Select selected case ID
 */
export const selectSelectedCaseId = createSelector(
  selectCasesState,
  (state: CasesState) => state.selectedCaseId
);

/**
 * Select cases by client ID
 */
export const selectCasesByClient = (clientId: string) =>
  createSelector(
    selectAllCases,
    (cases: Case[]) => cases.filter(caseItem => caseItem.client_id === clientId)
  );

/**
 * Select case by ID
 */
export const selectCaseById = (caseId: string) =>
  createSelector(
    selectAllCases,
    (cases: Case[]) => cases.find(caseItem => caseItem.id === caseId) || null
  );

/**
 * Select selected case (full object)
 */
export const selectSelectedCase = createSelector(
  selectAllCases,
  selectSelectedCaseId,
  (cases: Case[], selectedId: string | null) => {
    if (!selectedId) {
      return null;
    }
    return cases.find(caseItem => caseItem.id === selectedId) || null;
  }
);

/**
 * Select nationality by case ID
 */
export const selectCaseNationality = (caseId: string) =>
  createSelector(
    selectCasesState,
    (state: CasesState) => state.nationalities[caseId] || null
  );

/**
 * Select cases count
 */
export const selectCasesCount = createSelector(
  selectAllCases,
  (cases: Case[]) => cases.length
);

/**
 * Select cases by matter type
 */
export const selectCasesByMatter = (matter: Case['matter']) =>
  createSelector(
    selectAllCases,
    (cases: Case[]) => cases.filter(caseItem => caseItem.matter === matter)
  );

