import { createReducer, on } from '@ngrx/store';
// @ts-ignore
import { Sighting } from "../../shared/types/sighting.type.ts";
import * as SightingActions from '../actions/sighting.actions';

export interface SightingState {
  sightings: Sighting[];
  loading: boolean;
  error: string | null;
}

export const initialState: SightingState = {
  sightings: [],
  loading: false,
  error: null,
};

export const sightingReducer = createReducer(
  initialState,
  on(SightingActions.loadSightings, (state) => ({ ...state, loading: true })),
  on(SightingActions.loadSightingsSuccess, (state, { sightings }) => ({
    ...state,
    sightings,
    loading: false,
    error: null,
  })),
  on(SightingActions.loadSightingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  // ... other actions for adding, updating, deleting sightings
);
