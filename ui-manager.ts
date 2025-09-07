import { GameState, GameScreen, Ingredient } from './game-types';
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

    // Update time with better formatting
    const timeElement = document.getElementById('time-left');
    if (timeElement) {
      const minutes = Math.floor(state.timeLeft / 60);
      const seconds = state.timeLeft % 60;
      timeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  private updateAvailableIngredients(ingredients: Ingredient[]): void {
    const container = document.getElementById('available-ingredients');
    if (!container) return;

    if (ingredients.length === 0) {
      container.innerHTML = '<p class="empty-message">🔄 Đang tải nguyên liệu...</p>';
      return;
    }

    // Group ingredients by category
    const categories = {
      'vegetable': ingredients.filter(i => i.category === 'vegetable'),
      'meat': ingredients.filter(i => i.category === 'meat'),
      'spice': ingredients.filter(i => i.category === 'spice'),
      'dairy': ingredients.filter(i => i.category === 'dairy'),
      'grain': ingredients.filter(i => i.category === 'grain')
    };

    const categoryNames = {
      'vegetable': '🥬 Rau củ',
      'meat': '🥩 Thịt cá',
      'spice': '🧂 Gia vị',
      'dairy': '🥛 Sữa & Trứng',
      'grain': '🍚 Ngũ cốc'
    };

    container.innerHTML = Object.entries(categories).map(([category, items]) => {
      if (items.length === 0) return '';
      
      const itemsHTML = items.map(ingredient => `
        <div class="ingredient-item" 
             data-ingredient-id="${ingredient.id}" 
             draggable="true"
             title="${ingredient.name}">
          <div class="ingredient-emoji">${ingredient.emoji}</div>
          <div class="ingredient-name">${ingredient.name}</div>
        </div>
      `).join('');

      return `
        <div class="ingredient-category">
          <h4 class="category-title">${categoryNames[category as keyof typeof categoryNames]}</h4>
          <div class="category-items">${itemsHTML}</div>
        </div>
      `;
    }).join('');
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
    
    // Add performance rating
    const gameOverContent = document.querySelector('.game-over-content');
    if (gameOverContent) {
      let rating = '';
      if (finalScore > 2000) rating = '🏆 Đầu bếp xuất sắc!';
      else if (finalScore > 1500) rating = '🥇 Đầu bếp tài năng!';
      else if (finalScore > 1000) rating = '🥈 Đầu bếp khá!';
      else if (finalScore > 500) rating = '🥉 Đầu bếp mới!';
      else rating = '👨‍🍳 Hãy cố gắng thêm!';
      
      const existingRating = gameOverContent.querySelector('.performance-rating');
      if (existingRating) {
        existingRating.textContent = rating;
      } else {
        const ratingElement = document.createElement('p');
        ratingElement.className = 'performance-rating';
        ratingElement.textContent = rating;
        ratingElement.style.cssText = 'font-size: 1.2rem; color: #ff6b6b; margin: 1rem 0; font-weight: bold;';
        gameOverContent.insertBefore(ratingElement, gameOverContent.querySelector('.game-over-actions'));
      }
    }
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
