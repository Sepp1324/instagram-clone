import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { seedDatabase } from '../seed';

const config = {
  apiKey: 'AIzaSyDa8kFPAGUx1DH_7-ixZEdKXwJakSKfwAk',
  authDomain: 'instagram-ae1e7.firebaseapp.com',
  projectId: 'instagram-ae1e7',
  storageBucket: 'instagram-ae1e7.appspot.com',
  messagingSenderId: '808455691114',
  appId: '1:808455691114:web:05e5f176f39dd53ca6a313'
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;

// Call seed-file once
// seedDatabase(firebase);

export { firebase, FieldValue };
