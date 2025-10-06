import { useState, useEffect, useCallback } from 'react';
import { Kid, Ingredient, LunchBox, AppState } from '@/types';
import { initDB, getKids, getIngredients, getLunchBoxes, saveKid, deleteKid as deleteKidFromDB } from '@/lib/storage';

export function useAppState() {
  const [state, setState] = useState<AppState>({
    kids: [],
    ingredients: [],
    lunchBoxes: [],
    currentDate: new Date(),
    pantryView: 'grid',
    theme: 'light',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize database and load data
  useEffect(() => {
    async function loadData() {
      try {
        await initDB();
        const [kids, ingredients, lunchBoxes] = await Promise.all([
          getKids(),
          getIngredients(),
          getLunchBoxes(),
        ]);

        setState(prev => ({
          ...prev,
          kids,
          ingredients,
          lunchBoxes,
          activeKidId: kids.length > 0 ? kids[0].id : undefined,
        }));
      } catch (err) {
        setError('Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const updateKids = useCallback((kids: Kid[]) => {
    setState(prev => ({ ...prev, kids }));
  }, []);

  const addKid = useCallback(async (kid: Kid) => {
    await saveKid(kid);
    setState(prev => ({ ...prev, kids: [...prev.kids, kid] }));
  }, []);

  const deleteKid = useCallback(async (kidId: string) => {
    await deleteKidFromDB(kidId);
    setState(prev => {
      const updatedKids = prev.kids.filter(kid => kid.id !== kidId);
      return {
        ...prev,
        kids: updatedKids,
        activeKidId: prev.activeKidId === kidId 
          ? (updatedKids.length > 0 ? updatedKids[0].id : undefined)
          : prev.activeKidId
      };
    });
  }, []);

  const updateIngredients = useCallback((ingredients: Ingredient[]) => {
    setState(prev => ({ ...prev, ingredients }));
  }, []);

  const updateLunchBoxes = useCallback((lunchBoxes: LunchBox[]) => {
    setState(prev => ({ ...prev, lunchBoxes }));
  }, []);

  const setActiveKid = useCallback((kidId: string) => {
    setState(prev => ({ ...prev, activeKidId: kidId }));
  }, []);

  const setCurrentDate = useCallback((date: Date) => {
    setState(prev => ({ ...prev, currentDate: date }));
  }, []);

  const setPantryView = useCallback((view: 'grid' | 'list') => {
    setState(prev => ({ ...prev, pantryView: view }));
  }, []);

  return {
    state,
    loading,
    error,
    updateKids,
    addKid,
    deleteKid,
    updateIngredients,
    updateLunchBoxes,
    setActiveKid,
    setCurrentDate,
    setPantryView,
  };
}