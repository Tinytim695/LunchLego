import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/Button';
import { Kid } from '@/types';

interface KidSelectorProps {
  kids: Kid[];
  activeKidId?: string;
  onKidSelect: (kidId: string) => void;
  onAddKid: () => void;
}

export function KidSelector({ kids, activeKidId, onKidSelect, onAddKid }: KidSelectorProps) {
  if (kids.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">
            👶
          </div>
          <p className="text-slate-600">No kids added yet</p>
          <p className="text-sm text-slate-500">Add your first kid to start planning lunches</p>
        </div>
        <Button onClick={onAddKid}>
          <Plus className="w-4 h-4 mr-2" />
          Add First Kid
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900">Select Kid</h3>
        {kids.length < 10 && (
          <Button variant="outline" size="sm" onClick={onAddKid}>
            <Plus className="w-4 h-4 mr-2" />
            Add Kid
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {kids.map(kid => (
          <button
            key={kid.id}
            onClick={() => onKidSelect(kid.id)}
            className={`
              p-4 rounded-xl border-2 transition-all text-center
              ${activeKidId === kid.id 
                ? 'border-primary-500 bg-primary-50 shadow-md scale-105' 
                : 'border-slate-200 bg-white/80 hover:border-primary-300 hover:shadow-sm hover:scale-102'
              }
            `}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl ${kid.avatar ? kid.avatar.split('|')[1] : 'bg-slate-100'}`}>
              {kid.avatar ? kid.avatar.split('|')[0] : '👶'}
            </div>
            <p className="font-medium text-slate-900 text-sm">{kid.name}</p>
            <p className="text-xs text-slate-500">Age {kid.age}</p>
            {kid.allergies.length > 0 && (
              <p className="text-xs text-red-600 mt-1">
                Allergies: {kid.allergies.slice(0, 2).join(', ')}
                {kid.allergies.length > 2 && '...'}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}