import { Task, Appointment, Note } from '../types';

const DB_NAME = 'PrioApp';
const DB_VERSION = 1;
const TASKS_STORE = 'tasks';
const APPOINTMENTS_STORE = 'appointments';
const NOTES_STORE = 'notes';

class StorageService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains(TASKS_STORE)) {
          const taskStore = db.createObjectStore(TASKS_STORE, { keyPath: 'id' });
          taskStore.createIndex('createdAt', 'createdAt');
          taskStore.createIndex('priority', 'priority');
          taskStore.createIndex('completed', 'completed');
        }

        if (!db.objectStoreNames.contains(APPOINTMENTS_STORE)) {
          const appointmentStore = db.createObjectStore(APPOINTMENTS_STORE, { keyPath: 'id' });
          appointmentStore.createIndex('startTime', 'startTime');
          appointmentStore.createIndex('priority', 'priority');
          appointmentStore.createIndex('completed', 'completed');
        }

        if (!db.objectStoreNames.contains(NOTES_STORE)) {
          const noteStore = db.createObjectStore(NOTES_STORE, { keyPath: 'id' });
          noteStore.createIndex('createdAt', 'createdAt');
          noteStore.createIndex('priority', 'priority');
          noteStore.createIndex('category', 'category');
        }
      };
    });
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction([TASKS_STORE], 'readwrite');
    const store = transaction.objectStore(TASKS_STORE);
    
    await store.clear();
    for (const task of tasks) {
      await store.add(task);
    }
  }

  async loadTasks(): Promise<Task[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([TASKS_STORE], 'readonly');
      const store = transaction.objectStore(TASKS_STORE);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveAppointments(appointments: Appointment[]): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction([APPOINTMENTS_STORE], 'readwrite');
    const store = transaction.objectStore(APPOINTMENTS_STORE);
    
    await store.clear();
    for (const appointment of appointments) {
      await store.add(appointment);
    }
  }

  async loadAppointments(): Promise<Appointment[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([APPOINTMENTS_STORE], 'readonly');
      const store = transaction.objectStore(APPOINTMENTS_STORE);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveNotes(notes: Note[]): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction([NOTES_STORE], 'readwrite');
    const store = transaction.objectStore(NOTES_STORE);
    
    await store.clear();
    for (const note of notes) {
      await store.add(note);
    }
  }

  async loadNotes(): Promise<Note[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([NOTES_STORE], 'readonly');
      const store = transaction.objectStore(NOTES_STORE);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }
}

export const storageService = new StorageService();