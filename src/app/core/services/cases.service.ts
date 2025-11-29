/**
 * Cases Service
 * Handles HTTP calls and business logic for cases
 * Currently uses mock data, will be replaced with real API calls later
 */
import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import { Case, CaseNationality } from '../../models';
import { MOCK_CASES, MOCK_CASE_NATIONALITIES } from '../../data/mock-data';

interface CasesResponse {
  cases: Case[];
  nationalities: CaseNationality[];
}

@Injectable({
  providedIn: 'root'
})
export class CasesService {
  /**
   * Get all cases with their nationalities
   */
  getCases(): Observable<CasesResponse> {
    return of({
      cases: [...MOCK_CASES],
      nationalities: [...MOCK_CASE_NATIONALITIES]
    }).pipe(delay(500));
  }

  /**
   * Get cases by client ID
   */
  getCasesByClient(clientId: string): Observable<CasesResponse> {
    const clientCases = MOCK_CASES.filter(c => c.client_id === clientId);
    const caseIds = clientCases.map(c => c.id);
    const nationalities = MOCK_CASE_NATIONALITIES.filter(n => 
      caseIds.includes(n.case_id)
    );
    
    return of({
      cases: clientCases,
      nationalities
    }).pipe(delay(300));
  }

  /**
   * Get a case by ID
   */
  getCaseById(id: string): Observable<Case | null> {
    const caseItem = MOCK_CASES.find(c => c.id === id);
    return of(caseItem || null).pipe(delay(300));
  }

  /**
   * Get nationality by case ID
   */
  getCaseNationality(caseId: string): Observable<CaseNationality | null> {
    const nationality = MOCK_CASE_NATIONALITIES.find(n => n.case_id === caseId);
    return of(nationality || null).pipe(delay(200));
  }

  /**
   * Add a new case
   */
  addCase(caseData: Case): Observable<Case> {
    const newCase: Case = {
      ...caseData,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return of(newCase).pipe(delay(300));
  }

  /**
   * Add case with nationality data
   */
  addCaseWithNationality(
    caseData: Case,
    nationality?: CaseNationality
  ): Observable<{ case: Case; nationality?: CaseNationality }> {
    const newCase: Case = {
      ...caseData,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let newNationality: CaseNationality | undefined;
    if (nationality && caseData.matter === 'EXTRANJERIA') {
      newNationality = {
        ...nationality,
        case_id: newCase.id
      };
    }

    return of({
      case: newCase,
      nationality: newNationality
    }).pipe(delay(400));
  }

  /**
   * Update an existing case
   */
  updateCase(caseData: Case): Observable<Case> {
    const updatedCase: Case = {
      ...caseData,
      updated_at: new Date().toISOString()
    };
    return of(updatedCase).pipe(delay(300));
  }

  /**
   * Generate a simple ID (for mock data)
   */
  private generateId(): string {
    return `case-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

