// Ingredient group and item translations
const INGREDIENT_GROUPS: Record<string, Record<string, string>> = {
  vi: {
    'Rau củ': 'Rau củ',
    'Thịt cá': 'Thịt cá',
    'Gia vị': 'Gia vị',
    'Sữa & Trứng': 'Sữa & Trứng',
    'Ngũ cốc': 'Ngũ cốc',
  },
  en: {
    'Rau củ': 'Vegetables',
    'Thịt cá': 'Meat & Fish',
    'Gia vị': 'Spices',
    'Sữa & Trứng': 'Dairy & Eggs',
    'Ngũ cốc': 'Grains',
  }
};
const INGREDIENTS: Record<string, Record<string, string>> = {
  vi: {
    'Cà chua': 'Cà chua',
    'Hành tây': 'Hành tây',
    'Cà rốt': 'Cà rốt',
    'Khoai tây': 'Khoai tây',
    'Thịt gà': 'Thịt gà',
    'Thịt bò': 'Thịt bò',
    'Thịt heo': 'Thịt heo',
    'Cá': 'Cá',
    'Muối': 'Muối',
    'Tiêu': 'Tiêu',
    'Tỏi': 'Tỏi',
    'Bơ': 'Bơ',
    'Sữa': 'Sữa',
    'Phô mai': 'Phô mai',
    'Trứng': 'Trứng',
    'Cơm': 'Cơm',
    'Bánh mì': 'Bánh mì',
    'Mì ống': 'Mì ống',
  },
  en: {
    'Cà chua': 'Tomato',
    'Hành tây': 'Onion',
    'Cà rốt': 'Carrot',
    'Khoai tây': 'Potato',
    'Thịt gà': 'Chicken',
    'Thịt bò': 'Beef',
    'Thịt heo': 'Pork',
    'Cá': 'Fish',
    'Muối': 'Salt',
    'Tiêu': 'Pepper',
    'Tỏi': 'Garlic',
    'Bơ': 'Butter',
    'Sữa': 'Milk',
    'Phô mai': 'Cheese',
    'Trứng': 'Egg',
    'Cơm': 'Rice',
    'Bánh mì': 'Bread',
    'Mì ống': 'Noodles',
  }
};
// Helper: update in-game UI text for language
function updateGameScreenText() {
  const lang = languageSelect ? languageSelect.value : 'vi';
  // Order section
  const orderTitle = document.querySelector('.order-display h3');
  if (orderTitle) orderTitle.textContent = lang === 'vi' ? 'Đơn hàng:' : 'Order:';
  // Needed ingredients and time left labels
  const orderBox = document.querySelector('.order-display');
  if (orderBox) {
    const spans = orderBox.querySelectorAll('span');
    spans.forEach((span) => {
      if (span.textContent?.includes('Nguyên liệu cần') || span.textContent?.includes('Needed')) {
        span.textContent = lang === 'vi' ? 'Nguyên liệu cần:' : 'Needed:';
      }
      if (span.textContent?.includes('Thời gian còn lại') || span.textContent?.includes('Time left')) {
        span.textContent = lang === 'vi' ? 'Thời gian còn lại:' : 'Time left:';
      }
    });
  }
  // Cooking area
  const cookTitle = document.querySelector('.cooking-area h3');
  if (cookTitle) cookTitle.textContent = lang === 'vi' ? 'Khu vực nấu ăn:' : 'Cooking Area:';
  // Drag ingredients text
  const pan = document.getElementById('cooking-pan');
  if (pan) {
    const dragText = pan.querySelector('div');
    if (dragText) dragText.textContent = lang === 'vi' ? 'Kéo nguyên liệu vào đây' : 'Drag ingredients here';
  }
  // Missing ingredients button
  const missingBtn = document.querySelector('.cooking-area button');
  if (missingBtn) missingBtn.textContent = lang === 'vi' ? 'THIẾU NGUYÊN LIỆU' : 'MISSING INGREDIENTS';
  // Ingredient group titles
  document.querySelectorAll('.ingredient-group-col .category-title').forEach((el) => {
    const vi = el.textContent?.trim() || '';
    if (vi && INGREDIENT_GROUPS[lang][vi]) el.textContent = INGREDIENT_GROUPS[lang][vi];
  });
  // Ingredient item names
  document.querySelectorAll('.ingredient-item .ingredient-name').forEach((el) => {
    const vi = el.textContent?.trim() || '';
    if (vi && INGREDIENTS[lang][vi]) el.textContent = INGREDIENTS[lang][vi];
  });
}
// --- Language Dictionary ---
const LANG = {
  vi: {
    title: 'Cooking Mama - Game Nấu Ăn',
    mainMenu: {
      start: 'Bắt Đầu Chơi',
      highScores: 'Điểm Cao',
      instructions: 'Hướng Dẫn',
      avatar: 'Chọn Avatar',
      settings: 'Cài đặt',
      welcome: 'Game Nấu Ăn Thú Vị',
      gameTitle: '🍳 Cooking Mama',
    },
    settings: {
      title: 'Cài đặt',
      language: 'Ngôn ngữ:',
      sound: 'Âm thanh:',
      volume: 'Âm lượng:',
      close: 'Đóng',
      on: 'Bật',
      off: 'Tắt',
    },
    game: {
      score: 'Điểm:',
      time: 'Thời gian:',
      level: 'Cấp độ:',
      serve: 'Phục vụ món ăn',
      available: 'Nguyên liệu có sẵn:',
    },
    gameOver: {
      title: '🎮 Game Over',
      finalScore: 'Điểm cuối cùng:',
      finalLevel: 'Cấp độ đạt được:',
      playAgain: 'Chơi Lại',
      backMenu: 'Quay lại Menu',
    },
    highScores: {
      title: '🏆 Điểm Cao Nhất',
      backMenu: 'Quay lại Menu',
    },
    instructions: {
      title: '📖 Hướng Dẫn Chơi',
      backMenu: 'Quay lại Menu',
    },
  },
  en: {
    title: 'Cooking Mama - Cooking Game',
    mainMenu: {
      start: 'Start Game',
      highScores: 'High Scores',
      instructions: 'Instructions',
      avatar: 'Choose Avatar',
      settings: 'Settings',
      welcome: 'Fun Cooking Game',
      gameTitle: '🍳 Cooking Mama',
    },
    settings: {
      title: 'Settings',
      language: 'Language:',
      sound: 'Sound:',
      volume: 'Volume:',
      close: 'Close',
      on: 'On',
      off: 'Off',
    },
    game: {
      score: 'Score:',
      time: 'Time:',
      level: 'Level:',
      serve: 'Serve Dish',
      available: 'Available Ingredients:',
    },
    gameOver: {
      title: '🎮 Game Over',
      finalScore: 'Final Score:',
      finalLevel: 'Level Reached:',
      playAgain: 'Play Again',
      backMenu: 'Back to Menu',
    },
    highScores: {
      title: '🏆 High Scores',
      backMenu: 'Back to Menu',
    },
    instructions: {
      title: '📖 Instructions',
      backMenu: 'Back to Menu',
    },
  },
};

function updateAllText() {
  updateGameScreenText();
  const lang = languageSelect ? languageSelect.value : 'vi';
  const dict = LANG[lang as keyof typeof LANG];
  // Title
  document.title = dict.title;
  // Main menu
  const mainMenu = document.getElementById('main-menu');
  if (mainMenu) {
    const btns = [
      { id: 'start-game-btn', text: dict.mainMenu.start },
      { id: 'high-scores-btn', text: dict.mainMenu.highScores },
      { id: 'instructions-btn', text: dict.mainMenu.instructions },
      { id: 'open-avatar-modal', text: dict.mainMenu.avatar },
      { id: 'open-settings-modal', text: dict.mainMenu.settings },
    ];
    btns.forEach(({ id, text }) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    });
    const h1 = mainMenu.querySelector('h1');
    if (h1) h1.textContent = dict.mainMenu.gameTitle;
    const p = mainMenu.querySelector('p');
    if (p) p.textContent = dict.mainMenu.welcome;
  }
  // Settings modal
  if (settingsTitle) settingsTitle.textContent = dict.settings.title;
  if (labelLanguage) labelLanguage.innerHTML = `<b>${dict.settings.language}</b>`;
  if (labelSound) labelSound.innerHTML = `<b>${dict.settings.sound}</b>`;
  if (labelVolume) labelVolume.innerHTML = `<b>${dict.settings.volume}</b>`;
  if (closeSettingsBtnText) closeSettingsBtnText.textContent = dict.settings.close;
  if (soundStatus) soundStatus.textContent = soundToggle && soundToggle.checked ? dict.settings.on : dict.settings.off;
  // Game screen
  const scoreDisplay = document.querySelector('.score-display');
  if (scoreDisplay) scoreDisplay.innerHTML = `${dict.game.score} <span id="current-score">0</span>`;
  const timeDisplay = document.querySelector('.time-display');
  if (timeDisplay) timeDisplay.innerHTML = `${dict.game.time} <span id="time-left">60</span>s`;
  const levelDisplay = document.querySelector('.level-display');
  if (levelDisplay) levelDisplay.innerHTML = `${dict.game.level} <span id="current-level">1</span>`;
  const serveBtn = document.getElementById('serve-dish-btn');
  if (serveBtn) serveBtn.textContent = dict.game.serve;
  const available = document.querySelector('.ingredients-panel.wide h3');
  if (available) available.textContent = dict.game.available;
  // Game Over screen
  const goTitle = document.querySelector('#game-over-screen h2');
  if (goTitle) goTitle.textContent = dict.gameOver.title;
  const goScore = document.getElementById('final-score');
  if (goScore) goScore.parentElement!.childNodes[0].textContent = dict.gameOver.finalScore + ' ';
  const goLevel = document.getElementById('final-level');
  if (goLevel) goLevel.parentElement!.childNodes[0].textContent = dict.gameOver.finalLevel + ' ';
  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) playAgainBtn.textContent = dict.gameOver.playAgain;
  const backMenuBtn = document.getElementById('back-to-menu-from-game-over');
  if (backMenuBtn) backMenuBtn.textContent = dict.gameOver.backMenu;
  // High Scores screen
  const hsTitle = document.querySelector('#high-scores-screen h2');
  if (hsTitle) hsTitle.textContent = dict.highScores.title;
  const hsBackBtn = document.getElementById('back-to-menu-btn');
  if (hsBackBtn) hsBackBtn.textContent = dict.highScores.backMenu;
  // Instructions screen
  const insTitle = document.querySelector('#instructions-screen h2');
  if (insTitle) insTitle.textContent = dict.instructions.title;
  const insBackBtn = document.getElementById('back-to-menu-from-instructions');
  if (insBackBtn) insBackBtn.textContent = dict.instructions.backMenu;
}
// --- Settings Modal Logic ---
const openSettingsBtn = document.getElementById('open-settings-modal');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings-modal');
const languageSelect = document.getElementById('language-select') as HTMLSelectElement | null;
const soundToggle = document.getElementById('sound-toggle') as HTMLInputElement | null;
const soundStatus = document.getElementById('sound-status');
const soundVolume = document.getElementById('sound-volume') as HTMLInputElement | null;
const volumeValue = document.getElementById('volume-value');
// Settings modal labels
const settingsTitle = document.getElementById('settings-title');
const labelLanguage = document.getElementById('label-language');
const labelSound = document.getElementById('label-sound');
const labelVolume = document.getElementById('label-volume');
const closeSettingsBtnText = document.getElementById('close-settings-modal');

function showSettingsModal() {
  if (settingsModal) settingsModal.classList.remove('hidden');
}
function hideSettingsModal() {
  if (settingsModal) settingsModal.classList.add('hidden');
}
if (openSettingsBtn) openSettingsBtn.addEventListener('click', showSettingsModal);
if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', hideSettingsModal);

// Load and save settings from localStorage
function saveSettings() {
  const lang = languageSelect ? languageSelect.value : 'vi';
  const sound = soundToggle ? soundToggle.checked : true;
  const volume = soundVolume ? soundVolume.value : '100';
  localStorage.setItem('settings.language', lang);
  localStorage.setItem('settings.sound', sound ? 'on' : 'off');
  localStorage.setItem('settings.volume', volume);
}
function loadSettings() {
  const lang = localStorage.getItem('settings.language') || 'vi';
  const sound = localStorage.getItem('settings.sound') !== 'off';
  const volume = localStorage.getItem('settings.volume') || '100';
  if (languageSelect) languageSelect.value = lang;
  if (soundToggle) soundToggle.checked = sound;
  if (soundStatus) soundStatus.textContent = sound ? (lang === 'vi' ? 'Bật' : 'On') : (lang === 'vi' ? 'Tắt' : 'Off');
  if (soundVolume) soundVolume.value = volume;
  if (volumeValue) volumeValue.textContent = volume;
  updateSettingsLabels(lang);
}

function updateSettingsLabels(lang: string) {
  if (settingsTitle) settingsTitle.textContent = lang === 'vi' ? 'Cài đặt' : 'Settings';
  if (labelLanguage) labelLanguage.innerHTML = lang === 'vi' ? '<b>Ngôn ngữ:</b>' : '<b>Language:</b>';
  if (labelSound) labelSound.innerHTML = lang === 'vi' ? '<b>Âm thanh:</b>' : '<b>Sound:</b>';
  if (labelVolume) labelVolume.innerHTML = lang === 'vi' ? '<b>Âm lượng:</b>' : '<b>Volume:</b>';
  if (closeSettingsBtnText) closeSettingsBtnText.textContent = lang === 'vi' ? 'Đóng' : 'Close';
  if (soundStatus) soundStatus.textContent = soundToggle && soundToggle.checked ? (lang === 'vi' ? 'Bật' : 'On') : (lang === 'vi' ? 'Tắt' : 'Off');
}
if (languageSelect) languageSelect.addEventListener('change', () => {
  saveSettings();
  updateSettingsLabels(languageSelect.value);
  updateAllText();
});
if (soundToggle) soundToggle.addEventListener('change', () => {
  saveSettings();
  if (soundStatus) soundStatus.textContent = soundToggle.checked ? (languageSelect && languageSelect.value === 'vi' ? 'Bật' : 'On') : (languageSelect && languageSelect.value === 'vi' ? 'Tắt' : 'Off');
});
if (soundVolume) soundVolume.addEventListener('input', () => {
  if (volumeValue) volumeValue.textContent = soundVolume.value;
  saveSettings();
});

// Call on load
loadSettings();
updateAllText();

// Move avatar to top right of game screen (not in error area)
document.addEventListener('DOMContentLoaded', () => {
  const avatar = document.querySelector('.player-avatar-container') as HTMLElement | null;
  const gameScreen = document.getElementById('game-screen');
  if (avatar && gameScreen) {
    avatar.style.position = 'fixed';
    avatar.style.top = '30px';
    avatar.style.right = '30px';
    avatar.style.zIndex = '2000';
    gameScreen.appendChild(avatar);
  }
});
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
      this.playSound('success');
    };

    this.uiManager.onRemoveIngredient = (ingredientId: string) => {
      this.gameEngine.removeIngredientFromCooking(ingredientId);
      this.playSound('error');
    };

    this.uiManager.onServeDish = () => {
      const success = this.gameEngine.serveDish();
      const lang = languageSelect ? languageSelect.value : 'vi';
      if (success) {
        this.playSound('serve-success');
        this.showSuccessMessage(lang === 'vi' ? 'Món đã được phục vụ!' : 'Dish served!');
      } else {
        this.playSound('serve-fail');
        this.showErrorMessage(lang === 'vi' ? 'Thiếu nguyên liệu hoặc nguyên liệu không đúng!' : 'Missing or incorrect ingredients!');
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
    if (!state.isGameActive) {
      // Luôn truyền state hiện tại khi game kết thúc
      this.handleGameOver(state);
    }
  }

  private onScreenChange(screen: GameScreen): void {
    this.uiManager.showScreen(screen);
  }

  private async handleGameOver(state: GameState): Promise<void> {
    this.uiManager.updateGameOverScreen(state.score, state.level);

    // Ensure high score DB is initialized and loaded from localStorage
    const ScoreManager = (await import('./database')).ScoreManager;
    await ScoreManager.initialize();
    const isHighScore = await ScoreManager.isHighScore(state.score);

    // Get language
    const lang = languageSelect ? languageSelect.value : 'vi';
    const dict = LANG[lang as keyof typeof LANG];

    if (isHighScore) {
      this.playSound('high-score');
      // Show name input modal immediately
      (async () => {
        let playerName: string | null = '';
        while (!playerName || playerName.trim().length === 0) {
          playerName = await this.uiManager.showPlayerNameDialog();
          if (playerName === null) playerName = lang === 'vi' ? 'Người chơi' : 'Player';
          playerName = playerName.trim();
        }
        await this.gameEngine.saveHighScore(playerName);
        this.showSuccessMessage(lang === 'vi' ? 'Chúc mừng! Bạn đã lập kỷ lục mới!' : 'Congratulations! New high score!');
      })();
    } else {
      this.playSound('game-over');
      // Show different messages based on score
      if (state.score > 1000) {
        this.showErrorMessage(lang === 'vi' ? 'Tuyệt vời! Bạn đã nấu rất giỏi!' : 'Awesome! You cooked very well!');
      } else if (state.score > 500) {
        this.showErrorMessage(lang === 'vi' ? 'Không tệ! Hãy thử lại để cải thiện!' : 'Not bad! Try again to improve!');
      } else {
        this.showErrorMessage(lang === 'vi' ? 'Hết thời gian! Hãy thử lại nhé!' : 'Time is up! Try again!');
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
    const lang = languageSelect ? languageSelect.value : 'vi';
    const msg = lang === 'vi' ? 'Game đã tạm dừng. Nhấn OK để tiếp tục chơi.' : 'Game paused. Press OK to continue.';
    const resume = confirm(msg);
    if (resume) {
      this.gameEngine.resumeGame();
    } else {
      this.gameEngine.endGame();
    }
  }

  private showSuccessMessage(message?: string): void {
    const lang = languageSelect ? languageSelect.value : 'vi';
    const msg = message || (lang === 'vi' ? 'Tuyệt vời!' : 'Awesome!');
    this.createToast(msg, 'success');
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

  private playSound(type: 'success' | 'error' | 'high-score' | 'game-over' | 'serve-success' | 'serve-fail'): void {
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
      case 'serve-success':
        createTone(659, 0.15); // E5
        setTimeout(() => createTone(784, 0.15), 120); // G5
        setTimeout(() => createTone(987, 0.25), 240); // B5
        break;
      case 'serve-fail':
        createTone(233, 0.25, 'triangle'); // Bb3
        setTimeout(() => createTone(196, 0.4, 'triangle'), 180); // G3
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
