import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Ingredient } from '@/types';
import { Badge } from '../ui/Badge';
import { getCategoryColor } from '@/lib/nutrition';
import { isExpiringSoon, isExpired, formatShortDate } from '@/lib/utils';
import { AlertTriangle, Clock } from 'lucide-react';

interface PantryGridProps {
  ingredients: Ingredient[];
  searchTerm: string;
  selectedCategory: string;
}

interface DraggableIngredientProps {
  ingredient: Ingredient;
}

function DraggableIngredient({ ingredient }: DraggableIngredientProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ingredient.id,
    data: { type: 'ingredient', ingredient },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const isExpiring = ingredient.expirationDate && isExpiringSoon(ingredient.expirationDate);
  const hasExpired = ingredient.expirationDate && isExpired(ingredient.expirationDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        p-4 cursor-grab active:cursor-grabbing rounded-xl border-2 border-dashed transition-all
        bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-sm
        hover:from-blue-50/90 hover:to-purple-50/90 hover:border-blue-300 hover:shadow-md
        active:scale-105 active:rotate-1
        ${isDragging ? 'opacity-50 rotate-3 scale-105' : ''}
        ${hasExpired ? 'border-red-300 from-red-50/90 to-red-100/90' : ''}
        ${isExpiring ? 'border-orange-300 from-orange-50/90 to-orange-100/90' : 'border-slate-200'}
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-slate-900 text-sm">{ingredient.name}</h3>
        {(hasExpired || isExpiring) && (
          <div className="flex items-center">
            {hasExpired ? (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            ) : (
              <Clock className="w-4 h-4 text-orange-500" />
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Badge className={getCategoryColor(ingredient.category)}>
          {ingredient.category}
        </Badge>
        
        <div className="text-xs text-slate-600">
          <p>{ingredient.quantity} {ingredient.unit}</p>
          {ingredient.expirationDate && (
            <p className={hasExpired ? 'text-red-600' : isExpiring ? 'text-orange-600' : ''}>
              Expires: {formatShortDate(ingredient.expirationDate)}
            </p>
          )}
        </div>
        
        <div className="text-xs text-slate-500">
          {ingredient.nutritionInfo.calories} cal • {ingredient.nutritionInfo.protein}g protein
        </div>
      </div>
    </div>
  );
}

export function PantryGrid({ ingredients, searchTerm, selectedCategory }: PantryGridProps) {
  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ingredient.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || ingredient.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (filteredIngredients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No ingredients found</p>
        <p className="text-sm text-slate-400 mt-1">
          Try adjusting your search or category filter
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredIngredients.map(ingredient => (
        <DraggableIngredient key={ingredient.id} ingredient={ingredient} />
      ))}
    </div>
  );
}