export interface Kid {
  id: string;
  name: string;
  age: number;
  allergies: string[];
  preferences: string[];
  dislikes: string[];
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  nutritionInfo: NutritionInfo;
  expirationDate?: Date;
  quantity: number;
  unit: string;
  tags: string[];
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitamins: string[];
}

export type IngredientCategory = 
  | 'protein'
  | 'grain'
  | 'vegetable'
  | 'fruit'
  | 'dairy'
  | 'snack'
  | 'drink'
  | 'condiment';

export interface LunchBox {
  id: string;
  kidId: string;
  date: Date;
  ingredients: LunchBoxIngredient[];
  notes?: string;
  nutritionBalance: NutritionBalance;
  createdAt: Date;
  updatedAt: Date;
}

export interface LunchBoxIngredient {
  ingredientId: string;
  quantity: number;
  compartment: number;
}

export interface NutritionBalance {
  protein: 'low' | 'good' | 'high';
  carbs: 'low' | 'good' | 'high';
  vegetables: 'low' | 'good' | 'high';
  fruits: 'low' | 'good' | 'high';
  overall: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface AppState {
  kids: Kid[];
  ingredients: Ingredient[];
  lunchBoxes: LunchBox[];
  activeKidId?: string;
  currentDate: Date;
  pantryView: 'grid' | 'list';
  theme: 'light' | 'dark' | 'auto';
}

export interface DragItem {
  id: string;
  type: 'ingredient';
  data: Ingredient;
}

export interface DropResult {
  compartment: number;
  ingredient: Ingredient;
  quantity: number;
}