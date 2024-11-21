import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideStore } from '@ngrx/store';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from './environments/environment';
import { sightingReducer } from './app/store/reducers/sighting.reducer'
import { importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

// @ts-ignore
bootstrapApplication(AppComponent,
  {
    providers: [
      provideStore({sighting: sightingReducer}),
      importProvidersFrom(AngularFireModule.initializeApp(environment.firebase)),
      importProvidersFrom(AngularFirestoreModule),
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),  // Add the reducer here
      provideHttpClient(),
      provideRouter(routes),
      provideHttpClient() // ... other providers
    ],
  });
function provideAnimations(): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
    throw new Error('Function not implemented.');
}

