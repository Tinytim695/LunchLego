import React, { useState } from 'react';
import { X, Plus, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Kid } from '@/types';
import { generateId } from '@/lib/utils';

interface AddKidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (kid: Kid) => void;
}

const avatarColors = [
  'bg-red-100 text-red-600',
  'bg-blue-100 text-blue-600',
  'bg-green-100 text-green-600',
  'bg-yellow-100 text-yellow-600',
  'bg-purple-100 text-purple-600',
  'bg-pink-100 text-pink-600',
  'bg-indigo-100 text-indigo-600',
  'bg-orange-100 text-orange-600',
];

export function AddKidModal({ isOpen, onClose, onAdd }: AddKidModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: 5,
    allergies: '',
    preferences: '',
    dislikes: '',
    avatarColor: avatarColors[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const kid: Kid = {
      id: generateId(),
      name: formData.name,
      age: formData.age,
      allergies: formData.allergies.split(',').map(item => item.trim()).filter(Boolean),
      preferences: formData.preferences.split(',').map(item => item.trim()).filter(Boolean),
      dislikes: formData.dislikes.split(',').map(item => item.trim()).filter(Boolean),
      avatar: formData.avatarColor,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onAdd(kid);
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      age: 5,
      allergies: '',
      preferences: '',
      dislikes: '',
      avatarColor: avatarColors[0],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Add New Kid</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          
          <Input
            label="Age"
            type="number"
            min="1"
            max="18"
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 5 }))}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Avatar Color</label>
            <div className="grid grid-cols-4 gap-2">
              {avatarColors.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, avatarColor: color }))}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all
                    ${color}
                    ${formData.avatarColor === color ? 'ring-2 ring-primary-500 scale-110' : 'hover:scale-105'}
                  `}
                >
                  <User className="w-6 h-6" />
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Allergies (comma-separated)"
            value={formData.allergies}
            onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
            placeholder="e.g., nuts, dairy, eggs"
          />
          
          <Input
            label="Preferences (comma-separated)"
            value={formData.preferences}
            onChange={(e) => setFormData(prev => ({ ...prev, preferences: e.target.value }))}
            placeholder="e.g., fruits, sandwiches, cheese"
          />
          
          <Input
            label="Dislikes (comma-separated)"
            value={formData.dislikes}
            onChange={(e) => setFormData(prev => ({ ...prev, dislikes: e.target.value }))}
            placeholder="e.g., vegetables, spicy food"
          />

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Add Kid
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}