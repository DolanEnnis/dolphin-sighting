import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
// @ts-ignore
import { SightingService } from '../../shared/services/sighting.service.ts';
import * as SightingActions from '../actions/sighting.actions';

@Injectable()
export class SightingEffects {
  loadSightings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SightingActions.loadSightings),
      switchMap(() =>
        this.sightingService.getSightings().pipe(
          // @ts-ignore
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
