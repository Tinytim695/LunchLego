import React from 'react';
import { Sandwich, User, Calendar, Settings } from 'lucide-react';
import { Button } from './ui/Button';
import { formatDate } from '@/lib/utils';

interface HeaderProps {
  currentDate: Date;
  activeKid?: { name: string; avatar?: string };
  onDateChange: (date: Date) => void;
  onKidSelect: () => void;
  onSettingsClick: () => void;
}

export function Header({ 
  currentDate, 
  activeKid, 
  onDateChange, 
  onKidSelect, 
  onSettingsClick 
}: HeaderProps) {
  const goToPreviousDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    onDateChange(prevDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    onDateChange(nextDay);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
            <Sandwich className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">LunchLego</h1>
            <p className="text-sm text-slate-500">60-second lunch planner</p>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={goToPreviousDay}>
            ←
          </Button>
          <div className="text-center min-w-[200px]">
            <p className="text-sm font-medium text-slate-900">
              {formatDate(currentDate)}
            </p>
            <Button variant="ghost" size="sm" onClick={goToToday} className="text-xs">
              Today
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={goToNextDay}>
            →
          </Button>
        </div>

        {/* Kid Selector & Settings */}
        <div className="flex items-center space-x-3">
          {activeKid && (
            <Button variant="outline" size="sm" onClick={onKidSelect}>
              <User className="w-4 h-4 mr-2" />
              {activeKid.name}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onSettingsClick}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}