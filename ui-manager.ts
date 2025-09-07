import { GameState, GameScreen } from './game-types';
import { getIngredientById } from './game-data';
import { ScoreManager, HighScore } from './database';

export class UIManager {
  private currentScreen: GameScreen = 'main-menu';

  constructor() {
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    // Main menu buttons
    document.getElementById('start-game-btn')?.addEventListener('click', () => {
      this.showScreen('game');
      // Initialize game when entering game screen
      setTimeout(() => {
        this.onInitializeGame?.();
      }, 100);
    });

    document.getElementById('high-scores-btn')?.addEventListener('click', () => {
      this.showScreen('high-scores');
      this.loadHighScores();
    });

    document.getElementById('instructions-btn')?.addEventListener('click', () => {
      this.showScreen('instructions');
    });

    // Game over buttons
    document.getElementById('play-again-btn')?.addEventListener('click', () => {
      this.showScreen('game');
      // Initialize game when playing again
      setTimeout(() => {
        this.onInitializeGame?.();
      }, 100);
    });

    document.getElementById('back-to-menu-btn')?.addEventListener('click', () => {
      this.showScreen('main-menu');
    });

    document.getElementById('back-to-menu-from-instructions')?.addEventListener('click', () => {
      this.showScreen('main-menu');
    });

    document.getElementById('back-to-menu-from-game-over')?.addEventListener('click', () => {
      this.showScreen('main-menu');
    });

    // Serve dish button
    document.getElementById('serve-dish-btn')?.addEventListener('click', () => {
      this.onServeDish?.();
    });

    this.initializeDragAndDrop();
  }

  private initializeDragAndDrop(): void {
    const ingredientsGrid = document.getElementById('available-ingredients');
    const cookingPan = document.getElementById('cooking-pan');

    if (!ingredientsGrid || !cookingPan) return;

    // Make ingredients draggable
    ingredientsGrid.addEventListener('dragstart', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('ingredient-item')) {
        e.dataTransfer?.setData('text/plain', target.dataset.ingredientId || '');
        target.classList.add('dragging');
      }
    });

    ingredientsGrid.addEventListener('dragend', (e) => {
      const target = e.target as HTMLElement;
      target.classList.remove('dragging');
    });

    // Make cooking pan a drop target
    cookingPan.addEventListener('dragover', (e) => {
      e.preventDefault();
      cookingPan.classList.add('drag-over');
    });

    cookingPan.addEventListener('dragleave', () => {
      cookingPan.classList.remove('drag-over');
    });

    cookingPan.addEventListener('drop', (e) => {
      e.preventDefault();
      cookingPan.classList.remove('drag-over');
      
      const ingredientId = e.dataTransfer?.getData('text/plain');
      if (ingredientId) {
        this.onAddIngredient?.(ingredientId);
      }
    });

    // Make cooking ingredients draggable back to ingredients
    const cookingIngredients = document.getElementById('cooking-ingredients');
    if (cookingIngredients) {
      cookingIngredients.addEventListener('dragstart', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('cooking-ingredient')) {
          e.dataTransfer?.setData('text/plain', target.dataset.ingredientId || '');
          target.classList.add('dragging');
        }
      });

      cookingIngredients.addEventListener('dragend', (e) => {
        const target = e.target as HTMLElement;
        target.classList.remove('dragging');
      });

      cookingIngredients.addEventListener('dragover', (e) => {
        e.preventDefault();
        cookingIngredients.classList.add('drag-over');
      });

      cookingIngredients.addEventListener('dragleave', () => {
        cookingIngredients.classList.remove('drag-over');
      });

      cookingIngredients.addEventListener('drop', (e) => {
        e.preventDefault();
        cookingIngredients.classList.remove('drag-over');
        
        const ingredientId = e.dataTransfer?.getData('text/plain');
        if (ingredientId) {
          this.onRemoveIngredient?.(ingredientId);
        }
      });
    }
  }

  public showScreen(screen: GameScreen): void {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(el => {
      el.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(`${screen.replace('-', '-')}-screen`) || 
                        document.getElementById(screen);
    if (targetScreen) {
      targetScreen.classList.add('active');
    }

    this.currentScreen = screen;
  }

  public updateGameState(state: GameState): void {
    // Update score
    const scoreElement = document.getElementById('current-score');
    if (scoreElement) {
      scoreElement.textContent = state.score.toString();
    }

    // Update time
    const timeElement = document.getElementById('time-left');
    if (timeElement) {
      timeElement.textContent = state.timeLeft.toString();
    }

    // Update level
    const levelElement = document.getElementById('current-level');
    if (levelElement) {
      levelElement.textContent = state.level.toString();
    }

    // Update current order
    this.updateCurrentOrder(state);

    // Update available ingredients
    this.updateAvailableIngredients(state.availableIngredients);

    // Update cooking ingredients
    this.updateCookingIngredients(state.cookingIngredients);

    // Update serve button
    this.updateServeButton(state);
  }

  private updateCurrentOrder(state: GameState): void {
    const orderElement = document.getElementById('current-order');
    if (!orderElement || !state.currentOrder) {
      if (orderElement) orderElement.innerHTML = '<p>🔄 Đang tạo đơn hàng mới...</p>';
      return;
    }

    const order = state.currentOrder;
    const ingredients = order.recipe.ingredients.map(id => {
      const ingredient = getIngredientById(id);
      return ingredient ? `${ingredient.emoji} ${ingredient.name}` : id;
    }).join(', ');

    // Determine progress bar color based on time remaining
    const timePercentage = (order.timeLeft / order.maxTime) * 100;
    let progressClass = '';
    if (timePercentage < 30) progressClass = 'danger';
    else if (timePercentage < 60) progressClass = 'warning';

    orderElement.innerHTML = `
      <div class="order-recipe">
        <h4>🍽️ ${order.recipe.name}</h4>
        <p><strong>📋 Nguyên liệu cần:</strong> ${ingredients}</p>
        <p><strong>⏰ Thời gian còn lại:</strong> ${order.timeLeft}s</p>
        <div class="progress-bar">
          <div class="progress-fill ${progressClass}" style="width: ${timePercentage}%"></div>
        </div>
      </div>
    `;
  }

  private updateAvailableIngredients(ingredients: any[]): void {
    const container = document.getElementById('available-ingredients');
    if (!container) return;

    if (ingredients.length === 0) {
      container.innerHTML = '<p class="empty-message">🔄 Đang tải nguyên liệu...</p>';
      return;
    }

    container.innerHTML = ingredients.map(ingredient => `
      <div class="ingredient-item" 
           data-ingredient-id="${ingredient.id}" 
           draggable="true"
           title="${ingredient.name}">
        <div class="ingredient-emoji">${ingredient.emoji}</div>
        <div class="ingredient-name">${ingredient.name}</div>
      </div>
    `).join('');
  }

  private updateCookingIngredients(ingredientIds: string[]): void {
    const container = document.getElementById('cooking-ingredients');
    if (!container) return;

    if (ingredientIds.length === 0) {
      container.innerHTML = '<p class="empty-message">Kéo nguyên liệu vào đây</p>';
      return;
    }

    container.innerHTML = ingredientIds.map(id => {
      const ingredient = getIngredientById(id);
      if (!ingredient) return '';

      return `
        <div class="cooking-ingredient" 
             data-ingredient-id="${ingredient.id}" 
             draggable="true"
             title="${ingredient.name}">
          ${ingredient.emoji} ${ingredient.name}
        </div>
      `;
    }).join('');
  }

  private updateServeButton(state: GameState): void {
    const button = document.getElementById('serve-dish-btn') as HTMLButtonElement;
    if (!button) return;

    const canServe = state.currentOrder && 
                    state.currentOrder.recipe.ingredients.every(required => 
                      state.cookingIngredients.includes(required)
                    );

    button.disabled = !canServe;
    button.textContent = canServe ? 'Phục vụ món ăn' : 'Thiếu nguyên liệu';
  }

  public updateGameOverScreen(finalScore: number, finalLevel: number): void {
    const scoreElement = document.getElementById('final-score');
    const levelElement = document.getElementById('final-level');

    if (scoreElement) scoreElement.textContent = finalScore.toString();
    if (levelElement) levelElement.textContent = finalLevel.toString();
  }

  private async loadHighScores(): Promise<void> {
    const container = document.getElementById('high-scores-list');
    if (!container) return;

    try {
      const scores = await ScoreManager.getHighScores(10);
      
      if (scores.length === 0) {
        container.innerHTML = '<p>Chưa có điểm cao nào!</p>';
        return;
      }

      container.innerHTML = scores.map((score, index) => `
        <div class="score-item ${index === 0 ? 'first-place' : ''}">
          <div class="score-rank">#${index + 1}</div>
          <div class="score-details">
            <div class="score-player">${score.playerName}</div>
            <div class="score-info">Cấp ${score.level} - ${score.score} điểm</div>
          </div>
          <div class="score-date">${new Date(score.date).toLocaleDateString('vi-VN')}</div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading high scores:', error);
      container.innerHTML = '<p>Lỗi khi tải điểm cao!</p>';
    }
  }

  public showPlayerNameDialog(): Promise<string> {
    return new Promise((resolve) => {
      const playerName = prompt('Nhập tên của bạn để lưu điểm cao:') || 'Người chơi';
      resolve(playerName);
    });
  }

  // Event callbacks
  public onAddIngredient?: (ingredientId: string) => void;
  public onRemoveIngredient?: (ingredientId: string) => void;
  public onServeDish?: () => void;
  public onInitializeGame?: () => void;
}
