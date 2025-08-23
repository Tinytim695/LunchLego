import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Kid, Ingredient, LunchBox, AppState } from '@/types';

interface LunchLegoDB extends DBSchema {
  kids: {
    key: string;
    value: Kid;
  };
  ingredients: {
    key: string;
    value: Ingredient;
  };
  lunchBoxes: {
    key: string;
    value: LunchBox;
    indexes: { 'by-kid': string; 'by-date': Date };
  };
  settings: {
    key: string;
    value: any;
  };
}

let db: IDBPDatabase<LunchLegoDB>;

export async function initDB(): Promise<void> {
  db = await openDB<LunchLegoDB>('lunchlego-db', 1, {
    upgrade(db) {
      // Kids store
      db.createObjectStore('kids', { keyPath: 'id' });
      
      // Ingredients store
      db.createObjectStore('ingredients', { keyPath: 'id' });
      
      // LunchBoxes store with indexes
      const lunchBoxStore = db.createObjectStore('lunchBoxes', { keyPath: 'id' });
      lunchBoxStore.createIndex('by-kid', 'kidId');
      lunchBoxStore.createIndex('by-date', 'date');
      
      // Settings store
      db.createObjectStore('settings', { keyPath: 'key' });
    },
  });
}

// Kids operations
export async function saveKid(kid: Kid): Promise<void> {
  await db.put('kids', kid);
}

export async function getKids(): Promise<Kid[]> {
  return await db.getAll('kids');
}

export async function deleteKid(id: string): Promise<void> {
  await db.delete('kids', id);
}

// Ingredients operations
export async function saveIngredient(ingredient: Ingredient): Promise<void> {
  await db.put('ingredients', ingredient);
}

export async function getIngredients(): Promise<Ingredient[]> {
  return await db.getAll('ingredients');
}

export async function deleteIngredient(id: string): Promise<void> {
  await db.delete('ingredients', id);
}

// LunchBox operations
export async function saveLunchBox(lunchBox: LunchBox): Promise<void> {
  await db.put('lunchBoxes', lunchBox);
}

export async function getLunchBoxes(): Promise<LunchBox[]> {
  return await db.getAll('lunchBoxes');
}

export async function getLunchBoxesByKid(kidId: string): Promise<LunchBox[]> {
  return await db.getAllFromIndex('lunchBoxes', 'by-kid', kidId);
}

export async function deleteLunchBox(id: string): Promise<void> {
  await db.delete('lunchBoxes', id);
}

// Settings operations
export async function saveSetting(key: string, value: any): Promise<void> {
  await db.put('settings', { key, value });
}

export async function getSetting(key: string): Promise<any> {
  const result = await db.get('settings', key);
  return result?.value;
}

// Export/Import operations
export async function exportData(): Promise<string> {
  const [kids, ingredients, lunchBoxes] = await Promise.all([
    getKids(),
    getIngredients(),
    getLunchBoxes(),
  ]);
  
  const data = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    kids,
    ingredients,
    lunchBoxes,
  };
  
  return JSON.stringify(data, null, 2);
}

export async function importData(jsonData: string): Promise<void> {
  try {
    const data = JSON.parse(jsonData);
    
    // Clear existing data
    await db.clear('kids');
    await db.clear('ingredients');
    await db.clear('lunchBoxes');
    
    // Import new data
    const tx = db.transaction(['kids', 'ingredients', 'lunchBoxes'], 'readwrite');
    
    for (const kid of data.kids || []) {
      await tx.objectStore('kids').put(kid);
    }
    
    for (const ingredient of data.ingredients || []) {
      await tx.objectStore('ingredients').put(ingredient);
    }
    
    for (const lunchBox of data.lunchBoxes || []) {
      await tx.objectStore('lunchBoxes').put(lunchBox);
    }
    
    await tx.done;
  } catch (error) {
    throw new Error('Invalid data format');
  }
}