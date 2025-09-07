import { Ingredient, Recipe } from './game-types';

export const INGREDIENTS: Ingredient[] = [
  // Vegetables
  { id: 'tomato', name: 'Cà chua', emoji: '🍅', category: 'vegetable' },
  { id: 'onion', name: 'Hành tây', emoji: '🧅', category: 'vegetable' },
  { id: 'carrot', name: 'Cà rốt', emoji: '🥕', category: 'vegetable' },
  { id: 'potato', name: 'Khoai tây', emoji: '🥔', category: 'vegetable' },
  { id: 'lettuce', name: 'Rau xà lách', emoji: '🥬', category: 'vegetable' },
  { id: 'cucumber', name: 'Dưa chuột', emoji: '🥒', category: 'vegetable' },
  { id: 'bell-pepper', name: 'Ớt chuông', emoji: '🫑', category: 'vegetable' },
  { id: 'mushroom', name: 'Nấm', emoji: '🍄', category: 'vegetable' },

  // Meat
  { id: 'chicken', name: 'Thịt gà', emoji: '🍗', category: 'meat' },
  { id: 'beef', name: 'Thịt bò', emoji: '🥩', category: 'meat' },
  { id: 'pork', name: 'Thịt heo', emoji: '🥓', category: 'meat' },
  { id: 'fish', name: 'Cá', emoji: '🐟', category: 'meat' },
  { id: 'shrimp', name: 'Tôm', emoji: '🦐', category: 'meat' },

  // Spices
  { id: 'salt', name: 'Muối', emoji: '🧂', category: 'spice' },
  { id: 'pepper', name: 'Tiêu', emoji: '🫚', category: 'spice' },
  { id: 'garlic', name: 'Tỏi', emoji: '🧄', category: 'spice' },
  { id: 'ginger', name: 'Gừng', emoji: '🫚', category: 'spice' },
  { id: 'chili', name: 'Ớt', emoji: '🌶️', category: 'spice' },

  // Dairy
  { id: 'cheese', name: 'Phô mai', emoji: '🧀', category: 'dairy' },
  { id: 'milk', name: 'Sữa', emoji: '🥛', category: 'dairy' },
  { id: 'butter', name: 'Bơ', emoji: '🧈', category: 'dairy' },
  { id: 'egg', name: 'Trứng', emoji: '🥚', category: 'dairy' },

  // Grains
  { id: 'rice', name: 'Cơm', emoji: '🍚', category: 'grain' },
  { id: 'bread', name: 'Bánh mì', emoji: '🍞', category: 'grain' },
  { id: 'pasta', name: 'Mì ống', emoji: '🍝', category: 'grain' },
  { id: 'noodles', name: 'Mì', emoji: '🍜', category: 'grain' }
];

export const RECIPES: Recipe[] = [
  // Easy Recipes
  {
    id: 'simple-salad',
    name: 'Salad Đơn Giản',
    ingredients: ['lettuce', 'tomato', 'cucumber'],
    difficulty: 'easy',
    baseScore: 100,
    timeLimit: 30
  },
  {
    id: 'scrambled-eggs',
    name: 'Trứng Chiên',
    ingredients: ['egg', 'butter', 'salt'],
    difficulty: 'easy',
    baseScore: 120,
    timeLimit: 25
  },
  {
    id: 'grilled-cheese',
    name: 'Bánh Mì Phô Mai Nướng',
    ingredients: ['bread', 'cheese', 'butter'],
    difficulty: 'easy',
    baseScore: 110,
    timeLimit: 35
  },

  // Medium Recipes
  {
    id: 'chicken-stir-fry',
    name: 'Gà Xào',
    ingredients: ['chicken', 'onion', 'bell-pepper', 'garlic', 'salt'],
    difficulty: 'medium',
    baseScore: 200,
    timeLimit: 45
  },
  {
    id: 'pasta-marinara',
    name: 'Mì Sốt Cà Chua',
    ingredients: ['pasta', 'tomato', 'onion', 'garlic', 'salt'],
    difficulty: 'medium',
    baseScore: 180,
    timeLimit: 40
  },
  {
    id: 'beef-noodles',
    name: 'Mì Bò',
    ingredients: ['noodles', 'beef', 'onion', 'garlic', 'salt'],
    difficulty: 'medium',
    baseScore: 220,
    timeLimit: 50
  },

  // Hard Recipes
  {
    id: 'complex-stir-fry',
    name: 'Xào Tổng Hợp',
    ingredients: ['chicken', 'shrimp', 'onion', 'bell-pepper', 'mushroom', 'garlic', 'ginger', 'salt'],
    difficulty: 'hard',
    baseScore: 350,
    timeLimit: 60
  },
  {
    id: 'gourmet-salad',
    name: 'Salad Thượng Hạng',
    ingredients: ['lettuce', 'tomato', 'cucumber', 'cheese', 'onion', 'salt', 'pepper'],
    difficulty: 'hard',
    baseScore: 300,
    timeLimit: 55
  },
  {
    id: 'seafood-pasta',
    name: 'Mì Hải Sản',
    ingredients: ['pasta', 'shrimp', 'fish', 'tomato', 'onion', 'garlic', 'salt', 'pepper'],
    difficulty: 'hard',
    baseScore: 400,
    timeLimit: 65
  }
];

export function getRandomRecipe(difficulty?: 'easy' | 'medium' | 'hard'): Recipe {
  const filteredRecipes = difficulty 
    ? RECIPES.filter(recipe => recipe.difficulty === difficulty)
    : RECIPES;
  
  const randomIndex = Math.floor(Math.random() * filteredRecipes.length);
  return filteredRecipes[randomIndex];
}

export function getIngredientsByIds(ids: string[]): Ingredient[] {
  return ids.map(id => INGREDIENTS.find(ingredient => ingredient.id === id)).filter(Boolean) as Ingredient[];
}

export function getIngredientById(id: string): Ingredient | undefined {
  return INGREDIENTS.find(ingredient => ingredient.id === id);
}
