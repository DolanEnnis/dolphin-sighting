/*
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, of, switchMap, tap } from 'rxjs';
import
{ AuthService } from '../../shared/services/auth.service';
import
  * as AuthActions from '../actions/auth.actions';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signIn),

      switchMap(({
                   email, password }) =>
        from(this.authService.signIn(email, password)).pipe( // Wrap the Promise with 'from'
          map((user) => {
            return AuthActions.signInSuccess({user});
          }),
          catchError((error) => of(AuthActions.signInFailure({ error })))
        )
      )
    )
  );

  // ... other effects for signUp, signOut

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
*/
