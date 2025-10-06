import React, { useState } from 'react';
import { X, Trash2, Download, Upload, Moon, Sun, Monitor, User, Palette, Database, Bell, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Kid } from '@/types';
import { exportData, importData } from '@/lib/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  kids: Kid[];
  onDeleteKid: (kidId: string) => void;
  theme: 'light' | 'dark' | 'auto';
  onThemeChange: (theme: 'light' | 'dark' | 'auto') => void;
  notifications: boolean;
  onNotificationsChange: (enabled: boolean) => void;
  expirationAlerts: boolean;
  onExpirationAlertsChange: (enabled: boolean) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  kids,
  onDeleteKid,
  theme,
  onThemeChange,
  notifications,
  onNotificationsChange,
  expirationAlerts,
  onExpirationAlertsChange,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'kids' | 'appearance' | 'data' | 'notifications' | 'about'>('kids');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleExportData = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lunchlego-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await importData(text);
      window.location.reload(); // Refresh to load new data
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import data. Please check the file format.');
    }
  };

  const handleDeleteKid = (kidId: string) => {
    if (deleteConfirm === kidId) {
      onDeleteKid(kidId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(kidId);
      setTimeout(() => setDeleteConfirm(null), 3000); // Auto-cancel after 3 seconds
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'kids', label: 'Kids', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'about', label: 'About', icon: Shield },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-4">
            <nav className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                      ${activeTab === tab.id 
                        ? 'bg-primary-100 text-primary-700 font-medium' 
                        : 'text-slate-600 hover:bg-slate-100'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'kids' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Manage Kids</h3>
                  <p className="text-slate-600 mb-6">Add, edit, or remove kid profiles. Each kid can have their own lunch preferences and restrictions.</p>
                </div>

                {kids.length === 0 ? (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">No kids added yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {kids.map(kid => (
                      <div key={kid.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${kid.avatar ? kid.avatar.split('|')[1] : 'bg-slate-100'}`}>
                            {kid.avatar ? kid.avatar.split('|')[0] : '👶'}
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">{kid.name}</h4>
                            <p className="text-sm text-slate-500">Age {kid.age}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              {kid.allergies.length > 0 && (
                                <Badge variant="error" size="sm">
                                  {kid.allergies.length} allergies
                                </Badge>
                              )}
                              {kid.preferences.length > 0 && (
                                <Badge variant="success" size="sm">
                                  {kid.preferences.length} preferences
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteKid(kid.id)}
                          className={deleteConfirm === kid.id ? "bg-red-600 text-white hover:bg-red-700 border-red-600" : "hover:bg-red-50 hover:border-red-300 hover:text-red-700"}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {deleteConfirm === kid.id ? 'Confirm Delete' : 'Delete'}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Appearance</h3>
                  <p className="text-slate-600 mb-6">Customize how LunchLego looks and feels.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'auto', label: 'Auto', icon: Monitor },
                      ].map(option => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => onThemeChange(option.value as 'light' | 'dark' | 'auto')}
                            className={`
                              p-4 rounded-lg border-2 transition-all text-center
                              ${theme === option.value 
                                ? 'border-primary-500 bg-primary-50' 
                                : 'border-slate-200 hover:border-slate-300'
                              }
                            `}
                          >
                            <Icon className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                            <span className="text-sm font-medium text-slate-900">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Data Management</h3>
                  <p className="text-slate-600 mb-6">Backup and restore your lunch planning data.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Export Data</h4>
                    <p className="text-sm text-blue-700 mb-3">Download a backup of all your kids, ingredients, and lunch boxes.</p>
                    <Button variant="outline" onClick={handleExportData}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Backup
                    </Button>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-medium text-orange-900 mb-2">Import Data</h4>
                    <p className="text-sm text-orange-700 mb-3">Restore data from a previous backup. This will replace all current data.</p>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Backup
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Notifications</h3>
                  <p className="text-slate-600 mb-6">Manage when and how LunchLego notifies you.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                    <div>
                      <h4 className="font-medium text-slate-900">Meal Prep Reminders</h4>
                      <p className="text-sm text-slate-500">Get notified to prepare lunch the night before</p>
                    </div>
                    <button
                      onClick={() => onNotificationsChange(!notifications)}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${notifications ? 'bg-primary-600' : 'bg-slate-200'}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${notifications ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                    <div>
                      <h4 className="font-medium text-slate-900">Expiration Alerts</h4>
                      <p className="text-sm text-slate-500">Get notified when ingredients are expiring soon</p>
                    </div>
                    <button
                      onClick={() => onExpirationAlertsChange(!expirationAlerts)}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                        ${expirationAlerts ? 'bg-primary-600' : 'bg-slate-200'}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                          ${expirationAlerts ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">About LunchLego</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-medium text-slate-900 mb-2">Version</h4>
                    <p className="text-slate-600">1.0.0</p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-medium text-slate-900 mb-2">Description</h4>
                    <p className="text-slate-600">A 60-second drag-and-drop lunchbox planner web app for parents: nutrition-balanced bento builder with labels, surprise swaps, and multi-kid offline PWA.</p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-medium text-slate-900 mb-2">Privacy</h4>
                    <p className="text-slate-600">All your data is stored locally on your device. We don't collect or share any personal information.</p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-medium text-slate-900 mb-2">Support</h4>
                    <p className="text-slate-600">Built with ❤️ for parents who want to make lunchtime easier and more nutritious!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}