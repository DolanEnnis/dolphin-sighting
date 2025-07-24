import { Injectable, inject } from '@angular/core';
import { catchError, Observable, map } from 'rxjs';
import { Sighting } from '../types/sighting.type';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  //docData,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from '@angular/fire/firestore';

// Define the SightingFormatted interface
interface SightingFormatted extends Sighting {
  formattedDate: Date;
}

interface SortOptions {
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root', // Important: Keep this
})
export class SightingService {
  private firestore: Firestore = inject(Firestore); // Inject Firestore

  constructor() {}

  convertToSightingFormatted(sighting: Sighting): SightingFormatted {
    let date: Date;
    if (sighting.date instanceof Timestamp) {
      date = sighting.date.toDate();
    } else if (typeof sighting.date === 'string') {
      date = new Date(sighting.date);
    } else if (sighting.date instanceof Date) {
      date = sighting.date;
    } else {
      date = new Date(); // Default date
    }
    return { ...sighting, formattedDate: date };
  }

  getAllSightings(options: SortOptions): Observable<SightingFormatted[]> {
    const sightingsCollection = collection(this.firestore, 'sightings');
    const q = query(
      sightingsCollection,
      // Use the sortDirection from the options object to make the method flexible.
      orderBy(options.sortField, options.sortDirection)
    );
    return collectionData(q, { idField: 'id' }).pipe(
      catchError((error) => {
        console.error('Error fetching sightings:', error);
        return [];
      }),
      map((sightings) =>
        (sightings as Sighting[]).map((sighting) => this.convertToSightingFormatted(sighting))
      )
    ) as Observable<SightingFormatted[]>;
  }
/*
These two methods not required at moment!
  getItem(id: string): Observable<Sighting> {
    const sightingDoc = doc(this.firestore, `sightings/${id}`);
    return docData(sightingDoc) as Observable<Sighting>;
  }

  update(sighting: Sighting, id: string): Promise<void> {
    const sightingDoc = doc(this.firestore, `sightings/${id}`);
    return setDoc(sightingDoc, sighting);
  }*/
  create(sighting: Sighting): Promise<void> {
    const sightingsCollection = collection(this.firestore, 'sightings');
    return setDoc(doc(sightingsCollection), sighting);
  }



  delete(id: string): Promise<void> {
    const sightingDoc = doc(this.firestore, `sightings/${id}`);
    return deleteDoc(sightingDoc);
  }
}
