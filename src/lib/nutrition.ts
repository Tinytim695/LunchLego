import { Ingredient, NutritionBalance, LunchBoxIngredient } from '@/types';

export function calculateNutritionBalance(
  ingredients: Ingredient[],
  lunchBoxIngredients: LunchBoxIngredient[]
): NutritionBalance {
  const totalNutrition = lunchBoxIngredients.reduce(
    (acc, lbIngredient) => {
      const ingredient = ingredients.find(i => i.id === lbIngredient.ingredientId);
      if (!ingredient) return acc;

      const multiplier = lbIngredient.quantity;
      return {
        calories: acc.calories + (ingredient.nutritionInfo.calories * multiplier),
        protein: acc.protein + (ingredient.nutritionInfo.protein * multiplier),
        carbs: acc.carbs + (ingredient.nutritionInfo.carbs * multiplier),
        fat: acc.fat + (ingredient.nutritionInfo.fat * multiplier),
        fiber: acc.fiber + (ingredient.nutritionInfo.fiber * multiplier),
        vegetables: acc.vegetables + (ingredient.category === 'vegetable' ? multiplier : 0),
        fruits: acc.fruits + (ingredient.category === 'fruit' ? multiplier : 0),
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, vegetables: 0, fruits: 0 }
  );

  // Define target ranges for a balanced lunch (rough guidelines)
  const targets = {
    protein: { min: 15, max: 30 }, // grams
    carbs: { min: 30, max: 60 }, // grams
    vegetables: { min: 1, max: 3 }, // servings
    fruits: { min: 1, max: 2 }, // servings
  };

  const getBalanceLevel = (value: number, target: { min: number; max: number }) => {
    if (value < target.min * 0.7) return 'low';
    if (value > target.max * 1.3) return 'high';
    return 'good';
  };

  const proteinBalance = getBalanceLevel(totalNutrition.protein, targets.protein);
  const carbsBalance = getBalanceLevel(totalNutrition.carbs, targets.carbs);
  const vegetablesBalance = getBalanceLevel(totalNutrition.vegetables, targets.vegetables);
  const fruitsBalance = getBalanceLevel(totalNutrition.fruits, targets.fruits);

  // Calculate overall balance
  const balanceScores = [proteinBalance, carbsBalance, vegetablesBalance, fruitsBalance];
  const goodCount = balanceScores.filter(b => b === 'good').length;
  const lowCount = balanceScores.filter(b => b === 'low').length;
  const highCount = balanceScores.filter(b => b === 'high').length;

  let overall: NutritionBalance['overall'];
  if (goodCount >= 3) overall = 'excellent';
  else if (goodCount >= 2) overall = 'good';
  else if (lowCount <= 1 && highCount <= 1) overall = 'fair';
  else overall = 'poor';

  return {
    protein: proteinBalance,
    carbs: carbsBalance,
    vegetables: vegetablesBalance,
    fruits: fruitsBalance,
    overall,
  };
}

export function getNutritionColor(level: 'low' | 'good' | 'high'): string {
  switch (level) {
    case 'low': return 'text-orange-600 bg-orange-50';
    case 'good': return 'text-green-600 bg-green-50';
    case 'high': return 'text-blue-600 bg-blue-50';
  }
}

export function getOverallNutritionColor(level: NutritionBalance['overall']): string {
  switch (level) {
    case 'poor': return 'text-red-600 bg-red-50';
    case 'fair': return 'text-orange-600 bg-orange-50';
    case 'good': return 'text-green-600 bg-green-50';
    case 'excellent': return 'text-emerald-600 bg-emerald-50';
  }
}

export function getCategoryColor(category: string): string {
  const colors = {
    protein: 'bg-red-100 text-red-800',
    grain: 'bg-yellow-100 text-yellow-800',
    vegetable: 'bg-green-100 text-green-800',
    fruit: 'bg-pink-100 text-pink-800',
    dairy: 'bg-blue-100 text-blue-800',
    snack: 'bg-purple-100 text-purple-800',
    drink: 'bg-cyan-100 text-cyan-800',
    condiment: 'bg-gray-100 text-gray-800',
  };
  return colors[category as keyof typeof colors] || colors.snack;
}