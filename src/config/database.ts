import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { firebaseConfig } from './firebase.config';

export const firebaseApp = initializeApp(firebaseConfig);
export const database = getDatabase(firebaseApp);

export const initializeDatabase = async () => {
    try {
        console.log('Firebase bağlantısı başarılı');
        return database;
    } catch (error) {
        console.error('Firebase bağlantı hatası:', error);
        throw error;
    }
}