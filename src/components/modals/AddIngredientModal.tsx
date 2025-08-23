import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Ingredient, IngredientCategory } from '@/types';
import { generateId } from '@/lib/utils';

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (ingredient: Ingredient) => void;
}

const categories: { value: IngredientCategory; label: string }[] = [
  { value: 'protein', label: 'Protein' },
  { value: 'grain', label: 'Grains' },
  { value: 'vegetable', label: 'Vegetables' },
  { value: 'fruit', label: 'Fruits' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'snack', label: 'Snacks' },
  { value: 'drink', label: 'Drinks' },
  { value: 'condiment', label: 'Condiments' },
];

export function AddIngredientModal({ isOpen, onClose, onAdd }: AddIngredientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'protein' as IngredientCategory,
    quantity: 1,
    unit: 'serving',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    expirationDate: '',
    tags: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ingredient: Ingredient = {
      id: generateId(),
      name: formData.name,
      category: formData.category,
      quantity: formData.quantity,
      unit: formData.unit,
      nutritionInfo: {
        calories: formData.calories,
        protein: formData.protein,
        carbs: formData.carbs,
        fat: formData.fat,
        fiber: formData.fiber,
        sugar: formData.sugar,
        sodium: formData.sodium,
        vitamins: [],
      },
      expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : undefined,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onAdd(ingredient);
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      category: 'protein',
      quantity: 1,
      unit: 'serving',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      expirationDate: '',
      tags: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Add New Ingredient</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as IngredientCategory }))}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                required
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              min="0"
              step="0.1"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
              required
            />
            
            <Input
              label="Unit"
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
              placeholder="e.g., serving, cup, piece"
              required
            />
          </div>

          <Input
            label="Expiration Date (optional)"
            type="date"
            value={formData.expirationDate}
            onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
          />

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-slate-900 mb-3">Nutrition Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Calories"
                type="number"
                min="0"
                value={formData.calories}
                onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
              />
              
              <Input
                label="Protein (g)"
                type="number"
                min="0"
                step="0.1"
                value={formData.protein}
                onChange={(e) => setFormData(prev => ({ ...prev, protein: parseFloat(e.target.value) || 0 }))}
              />
              
              <Input
                label="Carbs (g)"
                type="number"
                min="0"
                step="0.1"
                value={formData.carbs}
                onChange={(e) => setFormData(prev => ({ ...prev, carbs: parseFloat(e.target.value) || 0 }))}
              />
              
              <Input
                label="Fat (g)"
                type="number"
                min="0"
                step="0.1"
                value={formData.fat}
                onChange={(e) => setFormData(prev => ({ ...prev, fat: parseFloat(e.target.value) || 0 }))}
              />
              
              <Input
                label="Fiber (g)"
                type="number"
                min="0"
                step="0.1"
                value={formData.fiber}
                onChange={(e) => setFormData(prev => ({ ...prev, fiber: parseFloat(e.target.value) || 0 }))}
              />
              
              <Input
                label="Sugar (g)"
                type="number"
                min="0"
                step="0.1"
                value={formData.sugar}
                onChange={(e) => setFormData(prev => ({ ...prev, sugar: parseFloat(e.target.value) || 0 }))}
              />
              
              <Input
                label="Sodium (mg)"
                type="number"
                min="0"
                value={formData.sodium}
                onChange={(e) => setFormData(prev => ({ ...prev, sodium: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <Input
            label="Tags (comma-separated)"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="e.g., healthy, quick, kid-friendly"
          />

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Add Ingredient
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}