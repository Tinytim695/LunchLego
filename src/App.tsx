import React, { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Header } from './components/Header';
import { PantryControls } from './components/pantry/PantryControls';
import { PantryGrid } from './components/pantry/PantryGrid';
import { LunchBoxBuilder } from './components/planner/LunchBoxBuilder';
import { AddIngredientModal } from './components/modals/AddIngredientModal';
import { Card } from './components/ui/Card';
import { useAppState } from './hooks/useAppState';
import { saveIngredient, saveLunchBox } from './lib/storage';
import { calculateNutritionBalance } from './lib/nutrition';
import { generateId } from './lib/utils';
import { sampleKids, sampleIngredients } from './data/sampleData';
import { Ingredient, LunchBox, LunchBoxIngredient } from './types';

function App() {
  const { state, loading, updateIngredients, updateLunchBoxes, setActiveKid, setCurrentDate, setPantryView } = useAppState();
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeDragItem, setActiveDragItem] = useState<Ingredient | null>(null);

  // Initialize with sample data if empty
  React.useEffect(() => {
    if (!loading && state.ingredients.length === 0) {
      // Add sample data
      const initializeData = async () => {
        for (const ingredient of sampleIngredients) {
          await saveIngredient(ingredient);
        }
        updateIngredients(sampleIngredients);
      };
      initializeData();
    }
  }, [loading, state.ingredients.length, updateIngredients]);

  // Get current lunch box
  const currentLunchBox = state.lunchBoxes.find(
    lb => lb.kidId === state.activeKidId && 
    lb.date.toDateString() === state.currentDate.toDateString()
  );

  const handleAddIngredient = useCallback(async (ingredient: Ingredient) => {
    await saveIngredient(ingredient);
    updateIngredients([...state.ingredients, ingredient]);
  }, [state.ingredients, updateIngredients]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const ingredient = event.active.data.current?.ingredient;
    if (ingredient) {
      setActiveDragItem(ingredient);
    }
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    setActiveDragItem(null);
    
    const { active, over } = event;
    if (!over || !active.data.current?.ingredient) return;

    const ingredient = active.data.current.ingredient as Ingredient;
    const compartment = parseInt(over.id.toString().split('-')[1]);
    
    if (!compartment || !state.activeKidId) return;

    // Create or update lunch box
    const existingLunchBox = currentLunchBox;
    const newIngredient: LunchBoxIngredient = {
      ingredientId: ingredient.id,
      quantity: 1,
      compartment,
    };

    let updatedLunchBox: LunchBox;

    if (existingLunchBox) {
      // Add to existing lunch box
      const existingIngredientIndex = existingLunchBox.ingredients.findIndex(
        item => item.ingredientId === ingredient.id && item.compartment === compartment
      );

      let updatedIngredients;
      if (existingIngredientIndex >= 0) {
        // Increase quantity if already exists
        updatedIngredients = [...existingLunchBox.ingredients];
        updatedIngredients[existingIngredientIndex].quantity += 1;
      } else {
        // Add new ingredient
        updatedIngredients = [...existingLunchBox.ingredients, newIngredient];
      }

      updatedLunchBox = {
        ...existingLunchBox,
        ingredients: updatedIngredients,
        nutritionBalance: calculateNutritionBalance(state.ingredients, updatedIngredients),
        updatedAt: new Date(),
      };
    } else {
      // Create new lunch box
      updatedLunchBox = {
        id: generateId(),
        kidId: state.activeKidId,
        date: state.currentDate,
        ingredients: [newIngredient],
        nutritionBalance: calculateNutritionBalance(state.ingredients, [newIngredient]),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    await saveLunchBox(updatedLunchBox);
    
    const updatedLunchBoxes = existingLunchBox
      ? state.lunchBoxes.map(lb => lb.id === updatedLunchBox.id ? updatedLunchBox : lb)
      : [...state.lunchBoxes, updatedLunchBox];
    
    updateLunchBoxes(updatedLunchBoxes);
  }, [state.activeKidId, state.currentDate, state.ingredients, state.lunchBoxes, currentLunchBox, updateLunchBoxes]);

  const handleRemoveIngredient = useCallback(async (compartment: number, ingredientId: string) => {
    if (!currentLunchBox) return;

    const updatedIngredients = currentLunchBox.ingredients.filter(
      item => !(item.compartment === compartment && item.ingredientId === ingredientId)
    );

    const updatedLunchBox = {
      ...currentLunchBox,
      ingredients: updatedIngredients,
      nutritionBalance: calculateNutritionBalance(state.ingredients, updatedIngredients),
      updatedAt: new Date(),
    };

    await saveLunchBox(updatedLunchBox);
    updateLunchBoxes(state.lunchBoxes.map(lb => lb.id === updatedLunchBox.id ? updatedLunchBox : lb));
  }, [currentLunchBox, state.ingredients, state.lunchBoxes, updateLunchBoxes]);

  const handleSurpriseSwap = useCallback(() => {
    // TODO: Implement surprise swap logic
    console.log('Surprise swap!');
  }, []);

  const handleShuffle = useCallback(() => {
    // TODO: Implement 7-day shuffle logic
    console.log('7-day shuffle!');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading LunchLego...</p>
        </div>
      </div>
    );
  }

  const activeKid = state.kids.find(kid => kid.id === state.activeKidId);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        currentDate={state.currentDate}
        activeKid={activeKid}
        onDateChange={setCurrentDate}
        onKidSelect={() => {/* TODO: Implement kid selector */}}
        onSettingsClick={() => {/* TODO: Implement settings */}}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pantry Section */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Smart Pantry</h2>
              <PantryControls
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                viewMode={state.pantryView}
                onViewModeChange={setPantryView}
                onAddIngredient={() => setShowAddModal(true)}
              />
            </Card>

            <Card padding="sm">
              <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <PantryGrid
                  ingredients={state.ingredients}
                  searchTerm={searchTerm}
                  selectedCategory={selectedCategory}
                />
                <DragOverlay>
                  {activeDragItem && (
                    <div className="drag-item p-4 bg-white shadow-lg rotate-3 scale-105">
                      <h3 className="font-medium text-slate-900 text-sm">{activeDragItem.name}</h3>
                      <p className="text-xs text-slate-600">{activeDragItem.category}</p>
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            </Card>
          </div>

          {/* Lunch Box Builder Section */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Lunch Box Builder
                {activeKid && <span className="text-base font-normal text-slate-600 ml-2">for {activeKid.name}</span>}
              </h2>
              
              {!activeKid ? (
                <div className="text-center py-12">
                  <p className="text-slate-500">Please select a kid to start building lunch boxes</p>
                </div>
              ) : (
                <LunchBoxBuilder
                  lunchBox={currentLunchBox}
                  ingredients={state.ingredients}
                  onRemoveIngredient={handleRemoveIngredient}
                  onSurpriseSwap={handleSurpriseSwap}
                  onShuffle={handleShuffle}
                />
              )}
            </Card>
          </div>
        </div>
      </main>

      <AddIngredientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddIngredient}
      />
    </div>
  );
}

export default App;