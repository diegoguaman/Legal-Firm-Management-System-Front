/**
 * NgRx Actions for Cases feature
 */
import { createAction, props } from '@ngrx/store';
import { Case, CaseNationality } from '../../models';

/**
 * Load all cases
 */
export const loadCases = createAction('[Cases] Load Cases');

/**
 * Cases loaded successfully
 */
export const loadCasesSuccess = createAction(
  '[Cases] Load Cases Success',
  props<{ cases: Case[]; nationalities: CaseNationality[] }>()
);

/**
 * Failed to load cases
 */
export const loadCasesFailure = createAction(
  '[Cases] Load Cases Failure',
  props<{ error: string }>()
);

/**
 * Load cases by client ID
 */
export const loadCasesByClient = createAction(
  '[Cases] Load Cases By Client',
  props<{ clientId: string }>()
);

/**
 * Add a new case
 */
export const addCase = createAction(
  '[Cases] Add Case',
  props<{ case: Case }>()
);

/**
 * Add case with nationality data
 */
export const addCaseWithNationality = createAction(
  '[Cases] Add Case With Nationality',
  props<{ case: Case; nationality?: CaseNationality }>()
);

/**
 * Case added successfully
 */
export const addCaseSuccess = createAction(
  '[Cases] Add Case Success',
  props<{ case: Case; nationality?: CaseNationality }>()
);

/**
 * Failed to add case
 */
export const addCaseFailure = createAction(
  '[Cases] Add Case Failure',
  props<{ error: string }>()
);

/**
 * Update an existing case
 */
export const updateCase = createAction(
  '[Cases] Update Case',
  props<{ case: Case }>()
);

/**
 * Case updated successfully
 */
export const updateCaseSuccess = createAction(
  '[Cases] Update Case Success',
  props<{ case: Case }>()
);

/**
 * Failed to update case
 */
export const updateCaseFailure = createAction(
  '[Cases] Update Case Failure',
  props<{ error: string }>()
);

/**
 * Select a case (for detail view)
 */
export const selectCase = createAction(
  '[Cases] Select Case',
  props<{ caseId: string }>()
);

/**
 * Clear selected case
 */
export const clearSelectedCase = createAction('[Cases] Clear Selected Case');

