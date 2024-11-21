import { createReducer, on } from '@ngrx/store';
import { UserInterface } from '../../shared/types/userInterface';
import * as AuthActions from '../actions/auth.actions';

export interface AuthState {
  user: UserInterface | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,

};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.signIn, (state) => ({ ...state, loading: true })),
  on(AuthActions.signInSuccess, (state,
                                 { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),
  on(AuthActions.signInFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  // ... other actions for signUp, signOut
);
