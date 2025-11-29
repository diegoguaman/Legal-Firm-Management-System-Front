/**
 * Case Detail Component
 * Displays detailed information about a case
 */
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Case, CaseNationality } from '../../../models';
import { AppState } from '../../../store/app.state';
import { loadCases, selectCase } from '../../../store/cases/cases.actions';
import { selectCaseById, selectCaseNationality } from '../../../store/cases/cases.selectors';
import { selectClientById } from '../../../store/clients/clients.selectors';

@Component({
  selector: 'app-case-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    DatePipe
  ],
  templateUrl: './case-detail.component.html',
  styleUrl: './case-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(Store<AppState>);

  caseId: string | null = null;
  case$: Observable<Case | null> = new Observable();
  nationality$: Observable<CaseNationality | null> = new Observable();
  client$: Observable<any> = new Observable();

  ngOnInit(): void {
    this.caseId = this.route.snapshot.paramMap.get('id');
    
    if (this.caseId) {
      this.store.dispatch(loadCases());
      this.store.dispatch(selectCase({ caseId: this.caseId }));
      
      this.case$ = this.store.select(selectCaseById(this.caseId));
      this.nationality$ = this.store.select(selectCaseNationality(this.caseId));
      
      // Get client info
      this.case$.pipe(take(1)).subscribe(caseItem => {
        if (caseItem) {
          this.client$ = this.store.select(selectClientById(caseItem.client_id));
        }
      });
    }
  }

  /**
   * Navigate to edit case
   */
  editCase(): void {
    if (this.caseId) {
      this.router.navigate(['/cases', this.caseId, 'edit']);
    }
  }

  /**
   * Navigate back to list
   */
  goBack(): void {
    this.router.navigate(['/cases']);
  }

  /**
   * Check if case is EXTRANJERIA
   */
  isExtranjeria(caseItem: Case | null): boolean {
    return caseItem?.matter === 'EXTRANJERIA';
  }
}

