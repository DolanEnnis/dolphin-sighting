import { createAction, props } from '@ngrx/store';
// @ts-ignore
import { Sighting } from '../../shared/types/sighting.type.ts';

export const loadSightings = createAction('[Sighting] Load Sightings');
export const loadSightingsSuccess = createAction(
  '[Sighting] Load Sightings Success',
  props<{ sightings: Sighting[] }>()
);
export const loadSightingsFailure = createAction(
  '[Sighting] Load Sightings Failure',
  props<{ error: string }>()
);

// ... actions for addSighting, updateSighting, deleteSighting
