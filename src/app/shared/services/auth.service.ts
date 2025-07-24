import {Injectable, inject, Signal} from '@angular/core';
import {
  Auth,
  user,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential // <-- Import UserCredential
} from '@angular/fire/auth';
import {from, Observable, map} from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {UserInterface} from '../types/userInterface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth)
  readonly user$ = user(this.firebaseAuth);

  public readonly currentUserSig: Signal<UserInterface | null> = toSignal(
    this.user$.pipe(
      // Explicitly type the 'user' parameter to prevent inference failure.
      map((user: User | null): UserInterface | null => {
        if (!user) {
          return null;
        }
        return {
          email: user.email!,
          username: user.displayName ?? undefined,
        };
      })
    ),
    { initialValue: null }
  );

  register(
    email: string,
    username: string,
    password: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response: UserCredential) => // <--  Explicitly type the 'response' parameter.
      updateProfile(response.user, {displayName: username}),
    );
    return from(promise);
  }

  login(
    email: string,
    password: string
  ): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    );
    return from(promise).pipe(map(() => undefined));
  }

  logout(): Observable <void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  getCurrentUser(): User | null {
    return this.firebaseAuth.currentUser;
  }
}
