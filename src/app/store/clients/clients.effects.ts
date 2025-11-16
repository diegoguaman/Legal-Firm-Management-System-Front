/**
 * NgRx Effects for Clients feature
 * Effects handle side effects (HTTP calls, localStorage, etc.)
 * They listen to actions and can dispatch new actions
 */
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, delay, tap } from 'rxjs/operators';
import { ClientsService } from '../../core/services/clients.service';
import * as ClientsActions from './clients.actions';

@Injectable()
export class ClientsEffects {
  private actions$ = inject(Actions);
  private clientsService = inject(ClientsService);

  /**
   * Effect that loads clients when loadClients action is dispatched
   * Uses switchMap to cancel previous request if a new one comes in
   */
  loadClients$ = createEffect(() =>
    this.actions$.pipe(
      // Listen only to loadClients action
      ofType(ClientsActions.loadClients),
      // Cancel previous request if new one comes
      switchMap(() =>
        this.clientsService.getClients().pipe(
          // On success, dispatch loadClientsSuccess
          map((clients) => ClientsActions.loadClientsSuccess({ clients })),
          // On error, dispatch loadClientsFailure
          catchError((error) =>
            of(ClientsActions.loadClientsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Effect that adds a client when addClient action is dispatched
   */
  addClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.addClient),
      switchMap(({ client }) =>
        this.clientsService.addClient(client).pipe(
          map((newClient) => ClientsActions.addClientSuccess({ client: newClient })),
          catchError((error) =>
            of(ClientsActions.addClientFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Effect that updates a client when updateClient action is dispatched
   */
  updateClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.updateClient),
      switchMap(({ client }) =>
        this.clientsService.updateClient(client).pipe(
          map((updatedClient) => ClientsActions.updateClientSuccess({ client: updatedClient })),
          catchError((error) =>
            of(ClientsActions.updateClientFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Effect that deletes a client when deleteClient action is dispatched
   */
  deleteClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientsActions.deleteClient),
      switchMap(({ clientId }) =>
        this.clientsService.deleteClient(clientId).pipe(
          map(() => ClientsActions.deleteClientSuccess({ clientId })),
          catchError((error) =>
            of(ClientsActions.deleteClientFailure({ error: error.message }))
          )
        )
      )
    )
  );
}

