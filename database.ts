import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;

export interface HighScore {
  playerName: string;
  score: number;
}

export class ScoreManager {
  // Key for localStorage
  private static STORAGE_KEY = 'cooking-mama-highscores';
  static async initialize(): Promise<void> {
    if (db) return;
    try {
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });
      db = new SQL.Database();
      // Create the high_scores table if it doesn't exist
      db.run("CREATE TABLE IF NOT EXISTS high_scores (playerName TEXT, score INTEGER)");
      // Load from localStorage if available
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const scores: HighScore[] = JSON.parse(saved);
        for (const s of scores) {
          db.run("INSERT INTO high_scores (playerName, score) VALUES (?, ?)", [s.playerName, s.score]);
        }
      }
    } catch (err) {
      console.error("Failed to initialize the database:", err);
    }
  }

  static async addHighScore(playerName: string, score: number): Promise<void> {
    if (!db) {
      await this.initialize();
    }
    try {
      let scores = await this.getHighScores(10);
      console.log('[HighScore] Current top 10 before add:', scores);
      if (scores.length < 10) {
        const stmt = db!.prepare("INSERT INTO high_scores (playerName, score) VALUES (?, ?)");
        stmt.run([playerName, score]);
        stmt.free();
        console.log(`[HighScore] Added new score (${playerName}, ${score}) - less than 10 scores`);
      } else {
        const minScore = scores[scores.length - 1].score;
        if (score > minScore) {
          const lowest = scores[scores.length - 1];
          db!.run("DELETE FROM high_scores WHERE playerName = ? AND score = ? LIMIT 1", [lowest.playerName, lowest.score]);
          const stmt = db!.prepare("INSERT INTO high_scores (playerName, score) VALUES (?, ?)");
          stmt.run([playerName, score]);
          stmt.free();
          console.log(`[HighScore] Replaced lowest score (${lowest.playerName}, ${lowest.score}) with (${playerName}, ${score})`);
        } else {
          console.log(`[HighScore] Score ${score} is not high enough to enter top 10 (lowest: ${minScore})`);
          return;
        }
      }
      scores = await this.getHighScores(10);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scores));
      console.log('[HighScore] Top 10 after add:', scores);
    } catch (err) {
      console.error("Failed to add high score:", err);
    }
  }

  static async getHighScores(limit: number = 10): Promise<HighScore[]> {
    if (!db) {
      await this.initialize();
    }
    const highScores: HighScore[] = [];
    try {
      const res = db!.exec(`SELECT playerName, score FROM high_scores ORDER BY score DESC LIMIT ${limit}`);
      if (res.length > 0) {
        res[0].values.forEach(row => {
          highScores.push({
            playerName: row[0] as string,
            score: row[1] as number
          });
        });
      }
    } catch (err) {
      console.error("Failed to get high scores:", err);
    }
    return highScores;
  }

  static async isHighScore(score: number, limit: number = 10): Promise<boolean> {
    if (!db) {
      await this.initialize();
    }
    try {
      const scores = await this.getHighScores(limit);
      console.log('[HighScore] Checking if', score, 'is a high score. Current top:', scores);
      if (scores.length < limit) {
        console.log('[HighScore] Less than 10 scores, so it is a high score.');
        return true;
      }
      const result = score > scores[scores.length - 1].score;
      console.log(`[HighScore] Score ${score} > lowest (${scores[scores.length - 1].score}):`, result);
      return result;
    } catch (err) {
      console.error("Failed to check if it is a high score:", err);
      return false;
    }
  }

  static async clearAllScores(): Promise<void> {
    if (!db) {
      await this.initialize();
    }
    try {
      db!.run("DELETE FROM high_scores");
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear scores:", err);
    }
  }
}

// Do not auto-initialize here; always await initialize() before any operation
