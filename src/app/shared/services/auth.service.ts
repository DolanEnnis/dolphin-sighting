//22 Nov 24 implemented with https://www.google.com/search?q=angular+standalone+firebase+auth&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:aa233234,vid:586O934xrhQ,st:0

import {inject, Injectable, signal} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile, user
} from '@angular/fire/auth'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {


  signOut,
  getAuth,
  User as FirebaseAuthUser
} from 'firebase/auth';
import { Observable, from, of } from 'rxjs';
import { UserInterface } from '../types/userInterface';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth)
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<UserInterface | null | undefined>(undefined);

  register(
    email: string,
    username: string,
    password: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) =>
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
      password).then(() => {
    });
    return from(promise);
  }

  logout(): Observable <void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
}

}
