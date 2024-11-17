import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SightingState } from '../reducers/sighting.reducer';

export const selectSightingState = createFeatureSelector<SightingState>('sighting');

export const selectSightings = createSelector(
  selectSightingState,
  (state) => state.sightings
);

export const selectLoading = createSelector(
  selectSightingState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectSightingState,
  (state) => state.error
);
