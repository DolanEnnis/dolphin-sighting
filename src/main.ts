import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideStore } from '@ngrx/store';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from './environment/environment';

// @ts-ignore
import { sightingReducer } from './store/reducers/sighting.reducer';
import { importProvidersFrom } from '@angular/core';

// @ts-ignore
bootstrapApplication(AppComponent,
  {
    providers: [
      provideStore({sighting: sightingReducer}),
      importProvidersFrom(AngularFireModule.initializeApp(environment.firebase)),
      importProvidersFrom(AngularFirestoreModule),  // Add the reducer here
      // ... other providers
    ],
  });
