import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideStore } from '@ngrx/store';
import { environment } from './environments/environment';
import { sightingReducer } from './app/store/reducers/sighting.reducer';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import {AuthGuard} from './app/auth.guard'; // Import FIREBASE_OPTIONS


bootstrapApplication(AppComponent, {
  providers: [
    provideStore({ sighting: sightingReducer }),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase }, // Provide Firebase config
    provideFirebaseApp(() => {
      const app = initializeApp(environment.firebase);
      return app; // Return the app instance
    }),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    AuthGuard,
  ],
}).catch(err => console.error("Bootstrap Error:", err)); // Add error logging here

