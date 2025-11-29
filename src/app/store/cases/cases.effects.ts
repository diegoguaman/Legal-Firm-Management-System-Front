/**
 * NgRx Effects for Cases feature
 */
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { CasesService } from '../../core/services/cases.service';
import * as CasesActions from './cases.actions';

@Injectable()
export class CasesEffects {
  private actions$ = inject(Actions);
  private casesService = inject(CasesService);

  /**
   * Load all cases
   */
  loadCases$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CasesActions.loadCases),
      switchMap(() =>
        this.casesService.getCases().pipe(
          map(({ cases, nationalities }) =>
            CasesActions.loadCasesSuccess({ cases, nationalities })
          ),
          catchError((error) =>
            of(CasesActions.loadCasesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Load cases by client
   */
  loadCasesByClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CasesActions.loadCasesByClient),
      switchMap(({ clientId }) =>
        this.casesService.getCasesByClient(clientId).pipe(
          map(({ cases, nationalities }) =>
            CasesActions.loadCasesSuccess({ cases, nationalities })
          ),
          catchError((error) =>
            of(CasesActions.loadCasesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Add case with nationality
   */
  addCaseWithNationality$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CasesActions.addCaseWithNationality),
      switchMap(({ case: caseData, nationality }) =>
        this.casesService.addCaseWithNationality(caseData, nationality).pipe(
          map(({ case: newCase, nationality: newNationality }) =>
            CasesActions.addCaseSuccess({ case: newCase, nationality: newNationality })
          ),
          catchError((error) =>
            of(CasesActions.addCaseFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Add case (without nationality)
   */
  addCase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CasesActions.addCase),
      switchMap(({ case: caseData }) =>
        this.casesService.addCase(caseData).pipe(
          map((newCase) =>
            CasesActions.addCaseSuccess({ case: newCase })
          ),
          catchError((error) =>
            of(CasesActions.addCaseFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Update case
   */
  updateCase$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CasesActions.updateCase),
      switchMap(({ case: caseData }) =>
        this.casesService.updateCase(caseData).pipe(
          map((updatedCase) =>
            CasesActions.updateCaseSuccess({ case: updatedCase })
          ),
          catchError((error) =>
            of(CasesActions.updateCaseFailure({ error: error.message }))
          )
        )
      )
    )
  );
}

