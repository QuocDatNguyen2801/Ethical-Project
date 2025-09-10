import { GameState, GameScreen, Ingredient } from './game-types';
import { getIngredientById } from './game-data';
import { ScoreManager, HighScore } from './database';

export class UIManager {
  private currentScreen: GameScreen = 'main-menu';
  private lastOrderId: string | null = null;

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

    // Avatar selection (save to localStorage and update header)
    const avatarModal = document.getElementById('avatar-modal');
    const openModalBtn = document.getElementById('open-avatar-modal');
    const closeModalBtn = document.getElementById('close-avatar-modal');

    openModalBtn?.addEventListener('click', () => {
      avatarModal?.classList.remove('hidden');
    });
    closeModalBtn?.addEventListener('click', () => {
      avatarModal?.classList.add('hidden');
    });
    avatarModal?.querySelector('.modal-backdrop')?.addEventListener('click', () => {
      avatarModal?.classList.add('hidden');
    });

    document.querySelectorAll('.avatar-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const avatar = target.getAttribute('data-avatar') || '👩‍🍳';
        localStorage.setItem('playerAvatar', avatar);
        const headerAvatar = document.querySelector('.player-avatar');
        if (headerAvatar) headerAvatar.textContent = avatar;
        avatarModal?.classList.add('hidden');
  const lang = (document.getElementById('language-select') as HTMLSelectElement)?.value || 'vi';
  this.showToast(lang === 'vi' ? 'Đã chọn avatar thành công!' : 'Avatar selected!');
      });
    });
    const savedAvatar = localStorage.getItem('playerAvatar');
    if (savedAvatar) {
      const headerAvatar = document.querySelector('.player-avatar');
      if (headerAvatar) headerAvatar.textContent = savedAvatar;
    }
  }

  public showToast(message: string, type: 'success' | 'error' = 'success'): void {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px 20px',
      borderRadius: '10px',
      color: 'white',
      fontWeight: 'bold',
      zIndex: '10000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      backgroundColor: type === 'success' ? '#4CAF50' : '#f44336',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
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

      // Get language
      const lang = (document.getElementById('language-select') as HTMLSelectElement)?.value || 'vi';
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

  // Drag text is handled inside updateCookingIngredients; do not override here.

    // Update serve button
    this.updateServeButton(state);
  }

  private updateCurrentOrder(state: GameState): void {
    const orderElement = document.getElementById('current-order');
    const avatarEl = document.querySelector('.customer-avatar') as HTMLElement | null;
    if (!orderElement || !state.currentOrder) {
      if (orderElement) orderElement.innerHTML = '<p>🔄 Đang tạo đơn hàng mới...</p>';
      return;
    }

    const order = state.currentOrder;
    const lang = ((document.getElementById('language-select') as HTMLSelectElement)?.value || 'vi') as 'vi' | 'en';
    const ingredients = order.recipe.ingredients.map(id => {
      const ingredient = getIngredientById(id);
      return ingredient ? `${ingredient.emoji} ${ingredient.name[lang]}` : id;
    }).join(', ');

    // Determine progress bar color based on time remaining
    const timePercentage = (order.timeLeft / order.maxTime) * 100;
    let progressClass = '';
    if (timePercentage < 30) progressClass = 'danger';
    else if (timePercentage < 60) progressClass = 'warning';

    orderElement.innerHTML = `
      <div class="order-recipe">
        <h4>🍽️ ${order.recipe.name[lang]}</h4>
        <p><strong>📋 ${lang === 'vi' ? 'Nguyên liệu cần:' : 'Needed:'}</strong> ${ingredients}</p>
        <p><strong>⏰ ${lang === 'vi' ? 'Thời gian còn lại:' : 'Time left:'}</strong> ${order.timeLeft}s</p>
        <div class="progress-bar">
          <div class="progress-fill ${progressClass}" style="width: ${timePercentage}%"></div>
        </div>
      </div>
    `;

    // Update customer avatar only when a NEW order arrives
    if (avatarEl && order.id !== this.lastOrderId) {
      avatarEl.textContent = this.getRandomCustomerEmoji();
      this.lastOrderId = order.id;
    }
  }

  private getRandomCustomerEmoji(): string {
    const customers = ['🧔', '👩', '👨', '👩‍🦰', '🧓', '👴', '👵', '👨‍🦱', '👩‍🦱', '👨‍🦳', '👩‍🦳', '🧑‍🎓', '🧑‍💼'];
    return customers[Math.floor(Math.random() * customers.length)];
  }

  private updateAvailableIngredients(ingredients: Ingredient[]): void {
    const container = document.getElementById('available-ingredients');
    if (!container) return;

  const lang = ((document.getElementById('language-select') as HTMLSelectElement)?.value || 'vi') as 'vi' | 'en';

    if (ingredients.length === 0) {
      container.innerHTML = `<p class="empty-message">${lang === 'vi' ? '🔄 Đang tải nguyên liệu...' : '🔄 Loading ingredients...'}</p>`;
      return;
    }

    const categories = {
      'vegetable': ingredients.filter(i => i.category === 'vegetable'),
      'meat': ingredients.filter(i => i.category === 'meat'),
      'spice': ingredients.filter(i => i.category === 'spice'),
      'dairy': ingredients.filter(i => i.category === 'dairy'),
      'grain': ingredients.filter(i => i.category === 'grain')
    };
    const categoryNames = {
      'vegetable': lang === 'vi' ? '🥬 Rau củ' : '🥬 Vegetables',
      'meat': lang === 'vi' ? '🥩 Thịt cá' : '🥩 Meat & Fish',
      'spice': lang === 'vi' ? '🧂 Gia vị' : '🧂 Spices',
      'dairy': lang === 'vi' ? '🥛 Sữa & Trứng' : '🥛 Dairy & Eggs',
      'grain': lang === 'vi' ? '🍚 Ngũ cốc' : '🍚 Grains'
    };

    container.innerHTML = `
      <div class="ingredient-groups-row">
        ${Object.entries(categories).map(([category, items]) => `
          <div class="ingredient-group-col">
            <div class="category-title">${categoryNames[category as keyof typeof categoryNames]}</div>
            <div class="group-items">
              ${items.map(ingredient => `
                <div class="ingredient-item" 
                     data-ingredient-id="${ingredient.id}" 
                     draggable="true"
                     title="${ingredient.name[lang as 'vi' | 'en']}" 
                     id="ingredient-${ingredient.id}">
                  <div class="ingredient-emoji">${ingredient.emoji}</div>
                  <div class="ingredient-name">${ingredient.name[lang as 'vi' | 'en']}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private updateCookingIngredients(ingredientIds: string[]): void {
    console.log('[updateCookingIngredients] ingredientIds:', ingredientIds);
    const container = document.getElementById('cooking-ingredients');
    if (!container) return;
    console.log('[updateCookingIngredients] container found:', container);
    const lang = ((document.getElementById('language-select') as HTMLSelectElement)?.value || 'vi') as 'vi' | 'en';


    // Only show placeholder if empty
    if (ingredientIds.length === 0) {
      container.innerHTML = '<div class="pan-placeholder">' + (lang === 'vi' ? 'Kéo nguyên liệu vào đây' : 'Drag ingredients here') + '</div>';
    } else {
      // Only render ingredients, no placeholder
      container.innerHTML = ingredientIds.map(id => {
        const ingredient = getIngredientById(id);
        if (!ingredient) {
          return `
            <div class="cooking-ingredient missing-ingredient" 
                 data-ingredient-id="${id}" 
                 draggable="false"
                 title="${lang === 'vi' ? 'Không tìm thấy nguyên liệu' : 'Ingredient not found'}">
              ❓ ${lang === 'vi' ? 'Không rõ' : 'Unknown'} (${id})
            </div>
          `;
        }
        return `
          <div class="cooking-ingredient" 
               data-ingredient-id="${ingredient.id}" 
               draggable="true"
               title="${ingredient.name[lang as 'vi' | 'en']}">
            ${ingredient.emoji} ${ingredient.name[lang as 'vi' | 'en']}
            <button class="remove-ingredient" data-remove-id="${ingredient.id}" aria-label="${lang === 'vi' ? 'Bỏ nguyên liệu' : 'Remove ingredient'}">✖</button>
          </div>
        `;
      }).join('');
    }
    // Attach click handlers to remove buttons
    container.querySelectorAll('.remove-ingredient').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const id = target.getAttribute('data-remove-id');
        if (id) this.onRemoveIngredient?.(id);
      });
    });
  }

  private updateServeButton(state: GameState): void {
    const button = document.getElementById('serve-dish-btn') as HTMLButtonElement;
    if (!button) return;

    const lang = (document.getElementById('language-select') as HTMLSelectElement)?.value || 'vi';
    const canServe = state.currentOrder && 
                    state.currentOrder.recipe.ingredients.every(required => 
                      state.cookingIngredients.includes(required)
                    );

    button.disabled = !canServe;
    button.textContent = canServe
      ? (lang === 'vi' ? 'Phục vụ món ăn' : 'Serve Dish')
      : (lang === 'vi' ? 'Thiếu nguyên liệu' : 'Missing Ingredients');
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
      await ScoreManager.initialize();
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
            <div class="score-info">${score.score} điểm</div>
          </div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading high scores:', error);
      container.innerHTML = '<p>Lỗi khi tải điểm cao!</p>';
    }
  }

  // Removed old modal-based implementation. Now using browser prompt below.
    public async showPlayerNameDialog(): Promise<string | null> {
      // Always use browser prompt for entering player name
      return window.prompt('Nhập tên của bạn để lưu điểm cao:', '') || null;
    }

  // Event callbacks
  public onAddIngredient?: (ingredientId: string) => void;
  public onRemoveIngredient?: (ingredientId: string) => void;
  public onServeDish?: () => void;
  public onInitializeGame?: () => void;
}
