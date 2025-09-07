export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  category: 'vegetable' | 'meat' | 'spice' | 'dairy' | 'grain';
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  baseScore: number;
  timeLimit: number;
}

export interface CustomerOrder {
  id: string;
  recipe: Recipe;
  timeLeft: number;
  maxTime: number;
}

export interface GameState {
  score: number;
  level: number;
  timeLeft: number;
  currentOrder: CustomerOrder | null;
  availableIngredients: Ingredient[];
  cookingIngredients: string[];
  isGameActive: boolean;
  gameStartTime: number;
}

export interface GameConfig {
  initialTime: number;
  timePerLevel: number;
  scoreMultiplier: number;
  maxLevel: number;
}

export type GameScreen = 'main-menu' | 'game' | 'high-scores' | 'instructions' | 'game-over';

export interface DragDropEvent {
  ingredientId: string;
  source: 'ingredients' | 'cooking';
  target: 'cooking' | 'ingredients';
}
