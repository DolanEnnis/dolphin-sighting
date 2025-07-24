import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { SightingService } from '../../shared/services/sighting.service';
import * as SightingActions from '../actions/sighting.actions';

@Injectable()
export class SightingEffects {
  loadSightings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SightingActions.loadSightings),
      switchMap(() =>
        // FIX: Provide the required 'options' argument to the service call.
        // A common default is to sort by date in descending order.
        this.sightingService.getAllSightings({ sortField: 'date', sortDirection: 'desc' }).pipe(
          map((sightings) => SightingActions.loadSightingsSuccess({ sightings })),
          catchError((error) => of(SightingActions.loadSightingsFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private sightingService: SightingService
  ) {}
}
