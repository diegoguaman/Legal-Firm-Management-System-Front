/**
 * Case List Component
 * Displays a table of all cases with filtering
 */
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Case } from '../../../models';
import { AppState } from '../../../store/app.state';
import { loadCases, selectCase } from '../../../store/cases/cases.actions';
import {
  selectAllCases,
  selectCasesLoading,
  selectCasesError
} from '../../../store/cases/cases.selectors';
import { selectAllClients } from '../../../store/clients/clients.selectors';

@Component({
  selector: 'app-case-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './case-list.component.html',
  styleUrl: './case-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseListComponent implements OnInit {
  private store = inject(Store<AppState>);

  // Observables from store
  cases$: Observable<Case[]> = this.store.select(selectAllCases);
  clients$ = this.store.select(selectAllClients);
  loading$: Observable<boolean> = this.store.select(selectCasesLoading);
  error$: Observable<string | null> = this.store.select(selectCasesError);

  // Table configuration
  displayedColumns: string[] = ['case_number', 'client', 'matter', 'status', 'opened_at', 'actions'];
  
  // Filters
  filterValue: string = '';
  selectedMatter: string = 'ALL';
  selectedStatus: string = 'ALL';
  selectedClientId: string = 'ALL';

  // Matter and status options
  matterOptions = [
    { value: 'ALL', label: 'Todos' },
    { value: 'CIVIL', label: 'Civil' },
    { value: 'LABORAL', label: 'Laboral' },
    { value: 'FAMILIAR', label: 'Familiar' },
    { value: 'EXTRANJERIA', label: 'Extranjería' },
    { value: 'TRAFICO', label: 'Tráfico' },
    { value: 'PENAL', label: 'Penal' }
  ];

  statusOptions = [
    { value: 'ALL', label: 'Todos' },
    { value: 'ABIERTO', label: 'Abierto' },
    { value: 'EN_TRAMITACION', label: 'En Trámite' },
    { value: 'RECLAMACION_PREVIA', label: 'Reclamación Previa' },
    { value: 'JUDICIALIZADO', label: 'Judicializado' },
    { value: 'CERRADO', label: 'Cerrado' }
  ];

  ngOnInit(): void {
    // Load cases and clients when component initializes
    this.store.dispatch(loadCases());
  }

  /**
   * Apply text filter
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue.trim().toLowerCase();
  }

  /**
   * Navigate to case detail
   */
  viewCase(caseId: string): void {
    this.store.dispatch(selectCase({ caseId }));
  }

  /**
   * Get client name by ID
   */
  getClientName(clientId: string, clients: any[]): string {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.first_name} ${client.last_name}` : 'N/A';
  }

  /**
   * Filter cases
   */
  filterCases(cases: Case[], clients: any[]): Case[] {
    let filtered = [...cases];

    // Filter by text
    if (this.filterValue) {
      filtered = filtered.filter(caseItem => {
        const clientName = this.getClientName(caseItem.client_id, clients).toLowerCase();
        return (
          caseItem.case_number.toLowerCase().includes(this.filterValue) ||
          clientName.includes(this.filterValue) ||
          caseItem.matter.toLowerCase().includes(this.filterValue)
        );
      });
    }

    // Filter by matter
    if (this.selectedMatter !== 'ALL') {
      filtered = filtered.filter(caseItem => caseItem.matter === this.selectedMatter);
    }

    // Filter by status
    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(caseItem => caseItem.status === this.selectedStatus);
    }

    // Filter by client
    if (this.selectedClientId !== 'ALL') {
      filtered = filtered.filter(caseItem => caseItem.client_id === this.selectedClientId);
    }

    return filtered;
  }
}

