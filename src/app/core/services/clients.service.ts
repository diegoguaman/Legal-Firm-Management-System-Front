/**
 * Clients Service
 * Handles HTTP calls and business logic for clients
 * Currently uses mock data, will be replaced with real API calls later
 */
import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Client } from '../../models';
import { MOCK_CLIENTS } from '../../data/mock-data';

@Injectable({
  providedIn: 'root' // Singleton service available app-wide
})
export class ClientsService {
  /**
   * Get all clients
   * Simulates API call with delay
   */
  getClients(): Observable<Client[]> {
    // Simulate network delay
    return of([...MOCK_CLIENTS]).pipe(delay(500));
  }

  /**
   * Get a client by ID
   */
  getClientById(id: string): Observable<Client | null> {
    const client = MOCK_CLIENTS.find(c => c.id === id);
    return of(client || null).pipe(delay(300));
  }

  /**
   * Add a new client
   */
  addClient(client: Client): Observable<Client> {
    // In real implementation, this would be a POST request
    const newClient: Client = {
      ...client,
      id: this.generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return of(newClient).pipe(delay(300));
  }

  /**
   * Update an existing client
   */
  updateClient(client: Client): Observable<Client> {
    // In real implementation, this would be a PUT request
    const updatedClient: Client = {
      ...client,
      updated_at: new Date().toISOString()
    };
    return of(updatedClient).pipe(delay(300));
  }

  /**
   * Delete a client (soft delete)
   */
  deleteClient(clientId: string): Observable<void> {
    // In real implementation, this would be a DELETE request
    return of(void 0).pipe(delay(300));
  }

  /**
   * Generate a simple ID (for mock data)
   * In production, IDs come from the backend
   */
  private generateId(): string {
    return `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

