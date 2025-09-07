import { GameEngine } from './game-engine';
import { UIManager } from './ui-manager';
import { GameState, GameScreen } from './game-types';

class CookingMamaGame {
  private gameEngine: GameEngine;
  private uiManager: UIManager;
  private isInitialized: boolean = false;

  constructor() {
    this.gameEngine = new GameEngine(
      (state: GameState) => this.onGameStateChange(state),
      (screen: GameScreen) => this.onScreenChange(screen)
    );

    this.uiManager = new UIManager();
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    // UI Manager event handlers
    this.uiManager.onAddIngredient = (ingredientId: string) => {
      this.gameEngine.addIngredientToCooking(ingredientId);
    };

    this.uiManager.onRemoveIngredient = (ingredientId: string) => {
      this.gameEngine.removeIngredientFromCooking(ingredientId);
    };

    this.uiManager.onServeDish = () => {
      const success = this.gameEngine.serveDish();
      if (success) {
        this.playSound('success');
        this.showSuccessMessage();
      } else {
        this.playSound('error');
        this.showErrorMessage('Thiếu nguyên liệu hoặc nguyên liệu không đúng!');
      }
    };

    this.uiManager.onInitializeGame = () => {
      this.gameEngine.initializeGame();
    };

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.handleEscapeKey();
      } else if (e.key === ' ') {
        e.preventDefault();
        this.handleSpaceKey();
      }
    });

    // Prevent context menu on right click for better game experience
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  private onGameStateChange(state: GameState): void {
    this.uiManager.updateGameState(state);
    
    // Check for game over conditions
    if (!state.isGameActive && state.timeLeft <= 0) {
      this.handleGameOver(state);
    }
  }

  private onScreenChange(screen: GameScreen): void {
    this.uiManager.showScreen(screen);
  }

  private async handleGameOver(state: GameState): Promise<void> {
    this.uiManager.updateGameOverScreen(state.score, state.level);
    
    // Check if this is a high score
    const highScores = await import('./database').then(module => 
      module.ScoreManager.getHighScores(1)
    );
    
    const isHighScore = highScores.length === 0 || state.score > highScores[0].score;
    
    if (isHighScore) {
      this.playSound('high-score');
      setTimeout(async () => {
        const playerName = await this.uiManager.showPlayerNameDialog();
        await this.gameEngine.saveHighScore(playerName);
        this.showSuccessMessage('Chúc mừng! Bạn đã lập kỷ lục mới!');
      }, 1000);
    } else {
      this.playSound('game-over');
      // Show different messages based on score
      if (state.score > 1000) {
        this.showErrorMessage('Tuyệt vời! Bạn đã nấu rất giỏi!');
      } else if (state.score > 500) {
        this.showErrorMessage('Không tệ! Hãy thử lại để cải thiện!');
      } else {
        this.showErrorMessage('Hết thời gian! Hãy thử lại nhé!');
      }
    }
  }

  private handleEscapeKey(): void {
    const currentScreen = this.getCurrentScreen();
    
    switch (currentScreen) {
      case 'game':
        this.gameEngine.pauseGame();
        this.showPauseMenu();
        break;
      case 'high-scores':
      case 'instructions':
      case 'game-over':
        this.uiManager.showScreen('main-menu');
        break;
    }
  }

  private handleSpaceKey(): void {
    const currentScreen = this.getCurrentScreen();
    
    if (currentScreen === 'game') {
      this.uiManager.onServeDish?.();
    }
  }

  private getCurrentScreen(): GameScreen {
    const activeScreen = document.querySelector('.screen.active');
    if (!activeScreen) return 'main-menu';
    
    const screenId = activeScreen.id;
    if (screenId.includes('main-menu')) return 'main-menu';
    if (screenId.includes('game')) return 'game';
    if (screenId.includes('high-scores')) return 'high-scores';
    if (screenId.includes('instructions')) return 'instructions';
    if (screenId.includes('game-over')) return 'game-over';
    
    return 'main-menu';
  }

  private showPauseMenu(): void {
    const resume = confirm('Game đã tạm dừng. Nhấn OK để tiếp tục chơi.');
    if (resume) {
      this.gameEngine.resumeGame();
    } else {
      this.gameEngine.endGame();
    }
  }

  private showSuccessMessage(message: string = 'Tuyệt vời!'): void {
    this.createToast(message, 'success');
  }

  private showErrorMessage(message: string): void {
    this.createToast(message, 'error');
  }

  private createToast(message: string, type: 'success' | 'error'): void {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add toast styles
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

    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  private playSound(type: 'success' | 'error' | 'high-score' | 'game-over'): void {
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const createTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    };

    switch (type) {
      case 'success':
        createTone(523, 0.2); // C5
        setTimeout(() => createTone(659, 0.2), 100); // E5
        setTimeout(() => createTone(784, 0.3), 200); // G5
        break;
        
      case 'error':
        createTone(200, 0.5, 'sawtooth');
        break;
        
      case 'high-score':
        createTone(523, 0.2); // C5
        setTimeout(() => createTone(659, 0.2), 100); // E5
        setTimeout(() => createTone(784, 0.2), 200); // G5
        setTimeout(() => createTone(1047, 0.4), 300); // C6
        break;
        
      case 'game-over':
        createTone(392, 0.5); // G4
        setTimeout(() => createTone(349, 0.5), 200); // F4
        setTimeout(() => createTone(294, 0.8), 400); // D4
        break;
    }
  }

  public start(): void {
    if (this.isInitialized) return;
    
    this.isInitialized = true;
    this.uiManager.showScreen('main-menu');
    
    // Add some CSS for toast notifications
    const style = document.createElement('style');
    style.textContent = `
      .toast {
        font-family: 'Arial', sans-serif;
        font-size: 14px;
        max-width: 300px;
        word-wrap: break-word;
      }
      
      .toast-success {
        background: linear-gradient(45deg, #4CAF50, #45a049) !important;
      }
      
      .toast-error {
        background: linear-gradient(45deg, #f44336, #da190b) !important;
      }
    `;
    document.head.appendChild(style);
    
    console.log('🍳 Cooking Mama Game đã sẵn sàng!');
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const game = new CookingMamaGame();
  game.start();
});

// Handle page visibility change to pause/resume game
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, could pause game here if needed
  } else {
    // Page is visible again
  }
});

// Export for potential external use
export { CookingMamaGame };
