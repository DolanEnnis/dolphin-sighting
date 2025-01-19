import { Injectable, inject } from '@angular/core';
import {catchError, Observable} from 'rxjs';
import { Sighting } from '../types/sighting.type';
import { Firestore, collection, collectionData, doc, docData, setDoc, deleteDoc, query, orderBy  } from '@angular/fire/firestore';

interface SortOptions {
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root' // Important: Keep this
})
export class SightingService {
  private firestore: Firestore = inject(Firestore); // Inject Firestore

  constructor() { }
/*
  getAllSightings(): Observable<Sighting[]> {
    const sightingsCollection = collection(this.firestore, 'sightings');
    return collectionData(sightingsCollection, { idField: 'id' }) as Observable<Sighting[]>;
  }
  */



  getAllSightings(options: SortOptions): Observable<Sighting[]> {
    const sightingsCollection = collection(this.firestore, 'sightings');
    const q = query(sightingsCollection, orderBy(options.sortField, options.sortDirection));
    return collectionData(q, { idField: 'id' }).pipe(
      catchError(error => {
        console.error('Error fetching sightings:', error);
        return [];
      })
    ) as Observable<Sighting[]>;
  }

  getItem(id: string): Observable<Sighting> {
    const sightingDoc = doc(this.firestore, `sightings/${id}`);
    return docData(sightingDoc) as Observable<Sighting>;
  }
  create(sighting: Sighting): Promise<void>{
    const sightingsCollection = collection(this.firestore, 'sightings');
    return setDoc(doc(sightingsCollection), sighting);
  }
  update(sighting: Sighting, id: string): Promise<void>{
    const sightingDoc = doc(this.firestore, `sightings/${id}`);
    return setDoc(sightingDoc, sighting);
  }
  delete(id: string): Promise<void>{
    const sightingDoc = doc(this.firestore, `sightings/${id}`);
    return deleteDoc(sightingDoc)
  }
}
