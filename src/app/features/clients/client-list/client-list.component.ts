/**
 * Client List Component
 * Displays a table of all clients with filtering and actions
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { Client } from '../../../models';
import { AppState } from '../../../store/app.state';
import { loadClients, selectClient, deleteClient } from '../../../store/clients/clients.actions';
import {
  selectAllClients,
  selectClientsLoading,
  selectClientsError
} from '../../../store/clients/clients.selectors';

@Component({
  selector: 'app-client-list',
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
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientListComponent implements OnInit {
  private store = inject(Store<AppState>);

  // Observables from store
  clients$: Observable<Client[]> = this.store.select(selectAllClients);
  loading$: Observable<boolean> = this.store.select(selectClientsLoading);
  error$: Observable<string | null> = this.store.select(selectClientsError);

  // Table configuration
  displayedColumns: string[] = ['first_name', 'last_name', 'client_type', 'nationality', 'actions'];
  
  // Filter
  filterValue: string = '';

  ngOnInit(): void {
    // Load clients when component initializes
    this.store.dispatch(loadClients());
  }

  /**
   * Apply filter to table
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue.trim().toLowerCase();
  }

  /**
   * Navigate to edit client
   */
  editClient(clientId: string): void {
    this.store.dispatch(selectClient({ clientId }));
    // Navigation handled by routerLink in template
  }

  /**
   * Delete a client
   */
  deleteClient(clientId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      this.store.dispatch(deleteClient({ clientId }));
    }
  }

  /**
   * Filter function for table
   */
  filterClients(clients: Client[]): Client[] {
    if (!this.filterValue) {
      return clients;
    }
    return clients.filter(client =>
      client.first_name.toLowerCase().includes(this.filterValue) ||
      client.last_name.toLowerCase().includes(this.filterValue) ||
      client.nationality?.toLowerCase().includes(this.filterValue) ||
      client.client_type.toLowerCase().includes(this.filterValue)
    );
  }
}

