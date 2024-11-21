import { createAction, props } from '@ngrx/store';
import { UserInterface } from '../../shared/types/userInterface';

export const signIn = createAction(
  '[Auth] Sign In',
  props<{ email: string; password: string }>()
);
export const signInSuccess = createAction(
  '[Auth] Sign In Success',
  props<{ user: UserInterface }>()
);
export const signInFailure = createAction(
  '[Auth] Sign In Failure',
  props<{ error: string }>()
);

// ... actions for signUp, signOut
