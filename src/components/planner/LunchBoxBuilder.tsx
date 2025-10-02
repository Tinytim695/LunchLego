import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { LunchBox, Ingredient, LunchBoxIngredient } from '@/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { getCategoryColor, getNutritionColor, getOverallNutritionColor } from '@/lib/nutrition';
import { Trash2, Shuffle, Sparkles } from 'lucide-react';

interface LunchBoxBuilderProps {
  lunchBox?: LunchBox;
  ingredients: Ingredient[];
  onRemoveIngredient: (compartment: number, ingredientId: string) => void;
  onSurpriseSwap: () => void;
  onShuffle: () => void;
}

interface CompartmentProps {
  compartment: number;
  items: LunchBoxIngredient[];
  ingredients: Ingredient[];
  onRemoveIngredient: (compartment: number, ingredientId: string) => void;
}

function Compartment({ compartment, items, ingredients, onRemoveIngredient }: CompartmentProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `compartment-${compartment}`,
    data: { compartment },
  });

  const compartmentItems = items.filter(item => item.compartment === compartment);

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[120px] p-4 rounded-xl border-2 border-dashed transition-all
        bg-gradient-to-br from-white/70 to-slate-50/70 backdrop-blur-sm
        ${isOver ? 'border-purple-400 from-purple-50/80 to-pink-50/80 shadow-lg scale-105' : 'border-slate-300/50'}
      `}
    >
      <h3 className="text-sm font-medium text-slate-700 mb-3">
        Compartment {compartment}
      </h3>
      
      <div className="space-y-2">
        {compartmentItems.map(item => {
          const ingredient = ingredients.find(i => i.id === item.ingredientId);
          if (!ingredient) return null;

          return (
            <div
              key={`${item.ingredientId}-${compartment}`}
              className="flex items-center justify-between p-3 bg-white/90 backdrop-blur-sm rounded-lg border border-white/30 shadow-sm"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-900">
                    {ingredient.name}
                  </span>
                  <Badge className={getCategoryColor(ingredient.category)}>
                    {ingredient.category}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  {item.quantity} serving{item.quantity !== 1 ? 's' : ''} • {ingredient.nutritionInfo.calories * item.quantity} cal
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveIngredient(compartment, item.ingredientId)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
        
        {compartmentItems.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">
            Drag ingredients here
          </p>
        )}
      </div>
    </div>
  );
}

export function LunchBoxBuilder({ 
  lunchBox, 
  ingredients, 
  onRemoveIngredient, 
  onSurpriseSwap, 
  onShuffle 
}: LunchBoxBuilderProps) {
  const compartments = [1, 2, 3, 4];

  return (
    <div className="space-y-6">
      {/* Nutrition Balance */}
      {lunchBox && (
        <div className="bg-gradient-to-r from-green-50/90 to-emerald-50/90 backdrop-blur-sm rounded-xl border border-green-200/50 p-4 shadow-lg">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Nutrition Balance</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="text-center">
              <Badge className={getNutritionColor(lunchBox.nutritionBalance.protein)}>
                Protein: {lunchBox.nutritionBalance.protein}
              </Badge>
            </div>
            <div className="text-center">
              <Badge className={getNutritionColor(lunchBox.nutritionBalance.carbs)}>
                Carbs: {lunchBox.nutritionBalance.carbs}
              </Badge>
            </div>
            <div className="text-center">
              <Badge className={getNutritionColor(lunchBox.nutritionBalance.vegetables)}>
                Veggies: {lunchBox.nutritionBalance.vegetables}
              </Badge>
            </div>
            <div className="text-center">
              <Badge className={getNutritionColor(lunchBox.nutritionBalance.fruits)}>
                Fruits: {lunchBox.nutritionBalance.fruits}
              </Badge>
            </div>
            <div className="text-center">
              <Badge className={getOverallNutritionColor(lunchBox.nutritionBalance.overall)}>
                Overall: {lunchBox.nutritionBalance.overall}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        <Button variant="outline" onClick={onSurpriseSwap}>
          <Sparkles className="w-4 h-4 mr-2" />
          Surprise Swap
        </Button>
        <Button variant="outline" onClick={onShuffle}>
          <Shuffle className="w-4 h-4 mr-2" />
          7-Day Shuffle
        </Button>
      </div>

      {/* Compartments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {compartments.map(compartment => (
          <Compartment
            key={compartment}
            compartment={compartment}
            items={lunchBox?.ingredients || []}
            ingredients={ingredients}
            onRemoveIngredient={onRemoveIngredient}
          />
        ))}
      </div>
    </div>
  );
}