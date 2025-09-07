import { GameState, GameConfig, CustomerOrder, GameScreen, DragDropEvent } from './game-types';
import { INGREDIENTS, getRandomRecipe, getIngredientById } from './game-data';
import { ScoreManager } from './database';

export class GameEngine {
  private state: GameState;
  private config: GameConfig;
  private gameLoop: number | null = null;
  private onStateChange: (state: GameState) => void;
  private onScreenChange: (screen: GameScreen) => void;

  constructor(
    onStateChange: (state: GameState) => void,
    onScreenChange: (screen: GameScreen) => void
  ) {
    this.config = {
      initialTime: 60,
      timePerLevel: 10,
      scoreMultiplier: 1.2,
      maxLevel: 10
    };

    this.state = this.createInitialState();
    this.onStateChange = onStateChange;
    this.onScreenChange = onScreenChange;
  }

  private createInitialState(): GameState {
    return {
      score: 0,
      level: 1,
      timeLeft: this.config.initialTime,
      currentOrder: null,
      availableIngredients: [...INGREDIENTS],
      cookingIngredients: [],
      isGameActive: false,
      gameStartTime: 0
    };
  }

  public startGame(): void {
    this.state = this.createInitialState();
    this.state.isGameActive = true;
    this.state.gameStartTime = Date.now();
    this.generateNewOrder();
    this.startGameLoop();
    this.onStateChange(this.state);
    this.onScreenChange('game');
  }

  public initializeGame(): void {
    // Initialize game state when entering game screen
    if (!this.state.isGameActive) {
      this.state = this.createInitialState();
      this.state.isGameActive = true;
      this.state.gameStartTime = Date.now();
      this.generateNewOrder();
      this.startGameLoop();
      this.onStateChange(this.state);
    }
  }

  public pauseGame(): void {
    this.state.isGameActive = false;
    this.stopGameLoop();
    this.onStateChange(this.state);
  }

  public resumeGame(): void {
    this.state.isGameActive = true;
    this.startGameLoop();
    this.onStateChange(this.state);
  }

  public endGame(): void {
    this.state.isGameActive = false;
    this.stopGameLoop();
    this.onStateChange(this.state);
    this.onScreenChange('game-over');
  }

  private startGameLoop(): void {
    this.gameLoop = window.setInterval(() => {
      if (!this.state.isGameActive) return;

      this.state.timeLeft--;
      
      if (this.state.currentOrder) {
        this.state.currentOrder.timeLeft--;
        
        if (this.state.currentOrder.timeLeft <= 0) {
          this.handleOrderTimeout();
        }
      }

      if (this.state.timeLeft <= 0) {
        this.endGame();
        return;
      }

      this.onStateChange(this.state);
    }, 1000);
  }

  private stopGameLoop(): void {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
  }

  private generateNewOrder(): void {
    const difficulty = this.getDifficultyForLevel(this.state.level);
    const recipe = getRandomRecipe(difficulty);
    
    this.state.currentOrder = {
      id: `order_${Date.now()}`,
      recipe,
      timeLeft: recipe.timeLimit,
      maxTime: recipe.timeLimit
    };

    this.state.cookingIngredients = [];
    this.onStateChange(this.state);
    
    // Log for debugging
    console.log(`🍳 Khách hàng mới: ${recipe.name}`);
    console.log(`📋 Nguyên liệu cần: ${recipe.ingredients.join(', ')}`);
    console.log(`⏰ Thời gian: ${recipe.timeLimit}s`);
  }

  private getDifficultyForLevel(level: number): 'easy' | 'medium' | 'hard' {
    if (level <= 3) return 'easy';
    if (level <= 6) return 'medium';
    return 'hard';
  }

  public addIngredientToCooking(ingredientId: string): boolean {
    if (!this.state.isGameActive || !this.state.currentOrder) return false;

    const ingredient = getIngredientById(ingredientId);
    if (!ingredient) return false;

    this.state.cookingIngredients.push(ingredientId);
    this.onStateChange(this.state);
    return true;
  }

  public removeIngredientFromCooking(ingredientId: string): boolean {
    if (!this.state.isGameActive) return false;

    const index = this.state.cookingIngredients.indexOf(ingredientId);
    if (index === -1) return false;

    this.state.cookingIngredients.splice(index, 1);
    this.onStateChange(this.state);
    return true;
  }

  public serveDish(): boolean {
    if (!this.state.isGameActive || !this.state.currentOrder) return false;

    const order = this.state.currentOrder;
    const requiredIngredients = order.recipe.ingredients;
    const cookingIngredients = [...this.state.cookingIngredients];

    // Check if all required ingredients are present
    const hasAllIngredients = requiredIngredients.every(required => 
      cookingIngredients.includes(required)
    );

    if (!hasAllIngredients) {
      return false;
    }

    // Calculate score based on time remaining and accuracy
    const timeBonus = Math.floor(order.timeLeft / order.maxTime * 100);
    const levelMultiplier = Math.pow(this.config.scoreMultiplier, this.state.level - 1);
    const score = Math.floor((order.recipe.baseScore + timeBonus) * levelMultiplier);

    this.state.score += score;
    this.state.level++;
    this.state.timeLeft += this.config.timePerLevel;

    // Generate new order
    this.generateNewOrder();

    this.onStateChange(this.state);
    return true;
  }

  private handleOrderTimeout(): void {
    // Penalty for timeout
    this.state.score = Math.max(0, this.state.score - 50);
    this.generateNewOrder();
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public getConfig(): GameConfig {
    return { ...this.config };
  }

  public async saveHighScore(playerName: string): Promise<void> {
    await ScoreManager.addHighScore(
      playerName,
      this.state.score,
      this.state.level
    );
  }

  public canServeDish(): boolean {
    if (!this.state.currentOrder) return false;

    const requiredIngredients = this.state.currentOrder.recipe.ingredients;
    const cookingIngredients = this.state.cookingIngredients;

    return requiredIngredients.every(required => 
      cookingIngredients.includes(required)
    );
  }

  public getOrderProgress(): { current: number; total: number } {
    if (!this.state.currentOrder) return { current: 0, total: 0 };

    const requiredIngredients = this.state.currentOrder.recipe.ingredients;
    const cookingIngredients = this.state.cookingIngredients;
    
    const current = requiredIngredients.filter(required => 
      cookingIngredients.includes(required)
    ).length;

    return { current, total: requiredIngredients.length };
  }
}
