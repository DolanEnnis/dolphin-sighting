
//import firebase from 'firebase/compat/app';
//import flatpickr from 'flatpickr'; // Or import from 'firebase/app' and other specific modules
//import 'firebase/compat/firestore'; // Import for firestore
//import not needed as using date: any;


export interface Sighting {
  behaviour: string;
  comments?: string;
  date: any;  //as date can change between firestore timestamp and javascript date
  id?: string;
  lat: number;            // 52.57958333333333
  location: string;       // "Long Rock"
  long: number;           // 9.318216666666666
  numbers: string;        // "6"
  observer: string;       // "Brian"
  observerID: string;     // "yeNcVSx6AGNi2IiKWD3tlYI08T13"
  seaState: string;       // "2"
  tide: string;           // "HW -3"
}

export interface SightingFormatted extends Sighting {
  formattedDate: Date;
}
/*
const tidiedData  = {
  date: typeof rawFormValue.date === 'string'
    ? flatpickr.parseDate(rawFormValue.date, "d-m-Y H:i")
    : rawFormValue.date,
  lat: Number(rawFormValue.latitude) + Number(rawFormValue.latmin/60),
  long: Number(rawFormValue.longitude) + Number(rawFormValue.longmin/60),
  location: rawFormValue.location,
  numbers: rawFormValue.dolphinCount,
  seaState: rawFormValue.seaState,
  tide: rawFormValue.tide,
  behaviour: rawFormValue.behaviour,
  comments: rawFormValue.comments,
  observer: currentUser ? currentUser.name : 'Anonymous',
  observerID: currentUser ? currentUser.uid : 'Anonymous',
};*/

