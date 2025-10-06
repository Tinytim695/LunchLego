import React from 'react';
import { AlertTriangle, Clock, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Ingredient } from '@/types';
import { isExpiringSoon, isExpired, formatShortDate } from '@/lib/utils';
import { getCategoryColor } from '@/lib/nutrition';

interface ExpirationAlertProps {
  ingredients: Ingredient[];
  isVisible: boolean;
  onDismiss: () => void;
}

export function ExpirationAlert({ ingredients, isVisible, onDismiss }: ExpirationAlertProps) {
  const expiredIngredients = ingredients.filter(ingredient => 
    ingredient.expirationDate && isExpired(ingredient.expirationDate)
  );
  
  const expiringSoonIngredients = ingredients.filter(ingredient => 
    ingredient.expirationDate && 
    isExpiringSoon(ingredient.expirationDate) && 
    !isExpired(ingredient.expirationDate)
  );

  const totalAlerts = expiredIngredients.length + expiringSoonIngredients.length;

  if (!isVisible || totalAlerts === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-40 w-80">
      <Card className="bg-gradient-to-br from-orange-50/95 to-red-50/95 backdrop-blur-md border-orange-200/60 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-orange-900">Food Expiration Alert</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {expiredIngredients.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-800 mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Expired ({expiredIngredients.length})
              </h4>
              <div className="space-y-2">
                {expiredIngredients.slice(0, 3).map(ingredient => (
                  <div key={ingredient.id} className="flex items-center justify-between p-2 bg-red-100/80 rounded-lg border border-red-200">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-900">{ingredient.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={getCategoryColor(ingredient.category)} size="sm">
                          {ingredient.category}
                        </Badge>
                        <span className="text-xs text-red-700">
                          Expired {formatShortDate(ingredient.expirationDate!)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {expiredIngredients.length > 3 && (
                  <p className="text-xs text-red-700 text-center">
                    +{expiredIngredients.length - 3} more expired items
                  </p>
                )}
              </div>
            </div>
          )}

          {expiringSoonIngredients.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-orange-800 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Expiring Soon ({expiringSoonIngredients.length})
              </h4>
              <div className="space-y-2">
                {expiringSoonIngredients.slice(0, 3).map(ingredient => (
                  <div key={ingredient.id} className="flex items-center justify-between p-2 bg-orange-100/80 rounded-lg border border-orange-200">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-900">{ingredient.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={getCategoryColor(ingredient.category)} size="sm">
                          {ingredient.category}
                        </Badge>
                        <span className="text-xs text-orange-700">
                          Expires {formatShortDate(ingredient.expirationDate!)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {expiringSoonIngredients.length > 3 && (
                  <p className="text-xs text-orange-700 text-center">
                    +{expiringSoonIngredients.length - 3} more expiring soon
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-orange-200/60">
          <p className="text-xs text-orange-800">
            💡 Consider using expiring items first or removing expired ones from your pantry
          </p>
        </div>
      </Card>
    </div>
  );
}