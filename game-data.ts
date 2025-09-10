import { Ingredient, Recipe } from './game-types';

export const INGREDIENTS: Ingredient[] = [
  // Vegetables
  { id: 'tomato', name: { vi: 'Cà chua', en: 'Tomato' }, emoji: '🍅', category: 'vegetable' },
  { id: 'onion', name: { vi: 'Hành tây', en: 'Onion' }, emoji: '🧅', category: 'vegetable' },
  { id: 'carrot', name: { vi: 'Cà rốt', en: 'Carrot' }, emoji: '🥕', category: 'vegetable' },
  { id: 'potato', name: { vi: 'Khoai tây', en: 'Potato' }, emoji: '🥔', category: 'vegetable' },
  { id: 'lettuce', name: { vi: 'Rau xà lách', en: 'Lettuce' }, emoji: '🥬', category: 'vegetable' },
  { id: 'cucumber', name: { vi: 'Dưa chuột', en: 'Cucumber' }, emoji: '🥒', category: 'vegetable' },
  { id: 'bell-pepper', name: { vi: 'Ớt chuông', en: 'Bell Pepper' }, emoji: '🟢', category: 'vegetable' },
  { id: 'mushroom', name: { vi: 'Nấm', en: 'Mushroom' }, emoji: '🍄', category: 'vegetable' },

  // Meat
  { id: 'chicken', name: { vi: 'Thịt gà', en: 'Chicken' }, emoji: '🍗', category: 'meat' },
  { id: 'beef', name: { vi: 'Thịt bò', en: 'Beef' }, emoji: '🥩', category: 'meat' },
  { id: 'pork', name: { vi: 'Thịt heo', en: 'Pork' }, emoji: '🥓', category: 'meat' },
  { id: 'fish', name: { vi: 'Cá', en: 'Fish' }, emoji: '🐟', category: 'meat' },
  { id: 'shrimp', name: { vi: 'Tôm', en: 'Shrimp' }, emoji: '🦐', category: 'meat' },

  // Spices
  { id: 'salt', name: { vi: 'Muối', en: 'Salt' }, emoji: '🧂', category: 'spice' },
  { id: 'pepper', name: { vi: 'Tiêu', en: 'Pepper' }, emoji: '⚫', category: 'spice' },
  { id: 'garlic', name: { vi: 'Tỏi', en: 'Garlic' }, emoji: '🧄', category: 'spice' },
  { id: 'ginger', name: { vi: 'Gừng', en: 'Ginger' }, emoji: '🟤', category: 'spice' },
  { id: 'chili', name: { vi: 'Ớt', en: 'Chili' }, emoji: '🌶️', category: 'spice' },

  // Dairy
  { id: 'cheese', name: { vi: 'Phô mai', en: 'Cheese' }, emoji: '🧀', category: 'dairy' },
  { id: 'milk', name: { vi: 'Sữa', en: 'Milk' }, emoji: '🥛', category: 'dairy' },
  { id: 'butter', name: { vi: 'Bơ', en: 'Butter' }, emoji: '🧈', category: 'dairy' },
  { id: 'egg', name: { vi: 'Trứng', en: 'Egg' }, emoji: '🥚', category: 'dairy' },

  // Grains
  { id: 'rice', name: { vi: 'Cơm', en: 'Rice' }, emoji: '🍚', category: 'grain' },
  { id: 'bread', name: { vi: 'Bánh mì', en: 'Bread' }, emoji: '🍞', category: 'grain' },
  { id: 'pasta', name: { vi: 'Mì ống', en: 'Pasta' }, emoji: '🍝', category: 'grain' },
  { id: 'noodles', name: { vi: 'Mì', en: 'Noodles' }, emoji: '🍜', category: 'grain' }
];

export const RECIPES: Recipe[] = [
  // Easy Recipes
  {
    id: 'simple-salad',
    name: { vi: 'Salad Đơn Giản', en: 'Simple Salad' },
    ingredients: ['lettuce', 'tomato', 'cucumber'],
    difficulty: 'easy',
    baseScore: 100,
    timeLimit: 20
  },
  {
    id: 'tomato-omelette',
    name: { vi: 'Trứng ốp la cà chua', en: 'Tomato Omelette' },
    ingredients: ['egg', 'tomato', 'salt'],
    difficulty: 'easy',
    baseScore: 120,
    timeLimit: 22
  },
  {
    id: 'scrambled-eggs',
    name: { vi: 'Trứng Chiên', en: 'Scrambled Eggs' },
    ingredients: ['egg', 'butter', 'salt'],
    difficulty: 'easy',
    baseScore: 120,
    timeLimit: 18
  },
  {
    id: 'grilled-cheese',
    name: { vi: 'Bánh Mì Phô Mai Nướng', en: 'Grilled Cheese' },
    ingredients: ['bread', 'cheese', 'butter'],
    difficulty: 'easy',
    baseScore: 110,
    timeLimit: 22
  },
  {
    id: 'butter-potato',
    name: { vi: 'Khoai tây bơ', en: 'Butter Potato' },
    ingredients: ['potato', 'butter', 'salt'],
    difficulty: 'easy',
    baseScore: 130,
    timeLimit: 20
  },

  // Medium Recipes
  {
    id: 'chicken-stir-fry',
    name: { vi: 'Gà Xào', en: 'Chicken Stir Fry' },
    ingredients: ['chicken', 'onion', 'bell-pepper', 'garlic', 'salt'],
    difficulty: 'medium',
    baseScore: 200,
    timeLimit: 30
  },
  {
    id: 'pasta-marinara',
    name: { vi: 'Mì Sốt Cà Chua', en: 'Pasta Marinara' },
    ingredients: ['pasta', 'tomato', 'onion', 'garlic', 'salt'],
    difficulty: 'medium',
    baseScore: 180,
    timeLimit: 28
  },
  {
    id: 'beef-noodles',
    name: { vi: 'Mì Bò', en: 'Beef Noodles' },
    ingredients: ['noodles', 'beef', 'onion', 'garlic', 'salt'],
    difficulty: 'medium',
    baseScore: 220,
    timeLimit: 32
  },
  {
    id: 'fish-grill',
    name: { vi: 'Cá nướng tiêu', en: 'Grilled Fish with Pepper' },
    ingredients: ['fish', 'pepper', 'salt'],
    difficulty: 'medium',
    baseScore: 210,
    timeLimit: 30
  },
  {
    id: 'chicken-salad',
    name: { vi: 'Salad gà', en: 'Chicken Salad' },
    ingredients: ['lettuce', 'chicken', 'cucumber', 'tomato', 'salt'],
    difficulty: 'medium',
    baseScore: 230,
    timeLimit: 32
  },

  // Hard Recipes
  {
    id: 'complex-stir-fry',
    name: { vi: 'Xào Tổng Hợp', en: 'Mixed Stir Fry' },
    ingredients: ['chicken', 'shrimp', 'onion', 'bell-pepper', 'mushroom', 'garlic', 'ginger', 'salt'],
    difficulty: 'hard',
    baseScore: 350,
    timeLimit: 40
  },
  {
    id: 'gourmet-salad',
    name: { vi: 'Salad Thượng Hạng', en: 'Gourmet Salad' },
    ingredients: ['lettuce', 'tomato', 'cucumber', 'cheese', 'onion', 'salt', 'pepper'],
    difficulty: 'hard',
    baseScore: 300,
    timeLimit: 35
  },
  {
    id: 'seafood-pasta',
    name: { vi: 'Mì Hải Sản', en: 'Seafood Pasta' },
    ingredients: ['pasta', 'shrimp', 'fish', 'tomato', 'onion', 'garlic', 'salt', 'pepper'],
    difficulty: 'hard',
    baseScore: 400,
    timeLimit: 42
  },
  {
    id: 'beef-stir-ginger',
    name: { vi: 'Bò xào gừng', en: 'Beef Stir-fried with Ginger' },
    ingredients: ['beef', 'ginger', 'onion', 'garlic', 'salt'],
    difficulty: 'hard',
    baseScore: 360,
    timeLimit: 38
  },
  {
    id: 'shrimp-garlic-noodles',
    name: { vi: 'Mì tôm xào tỏi', en: 'Shrimp Garlic Noodles' },
    ingredients: ['noodles', 'shrimp', 'garlic', 'onion', 'salt'],
    difficulty: 'hard',
    baseScore: 370,
    timeLimit: 40
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
