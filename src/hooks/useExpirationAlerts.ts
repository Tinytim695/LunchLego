import { useState, useEffect } from 'react';
import { Ingredient } from '@/types';
import { isExpiringSoon, isExpired } from '@/lib/utils';

export function useExpirationAlerts(ingredients: Ingredient[], enabled: boolean) {
  const [showAlert, setShowAlert] = useState(false);
  const [lastAlertCheck, setLastAlertCheck] = useState<string>('');

  useEffect(() => {
    if (!enabled) {
      setShowAlert(false);
      return;
    }

    const checkExpirations = () => {
      const today = new Date().toDateString();
      
      // Don't show alert if we already showed it today
      if (lastAlertCheck === today) return;

      const hasExpiringItems = ingredients.some(ingredient => 
        ingredient.expirationDate && (
          isExpired(ingredient.expirationDate) || 
          isExpiringSoon(ingredient.expirationDate)
        )
      );

      if (hasExpiringItems) {
        setShowAlert(true);
        setLastAlertCheck(today);
      }
    };

    // Check immediately
    checkExpirations();

    // Check every hour
    const interval = setInterval(checkExpirations, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [ingredients, enabled, lastAlertCheck]);

  const dismissAlert = () => {
    setShowAlert(false);
  };

  return {
    showAlert,
    dismissAlert,
  };
}