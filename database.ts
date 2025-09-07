import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;

export interface HighScore {
  playerName: string;
  score: number;
}

export class ScoreManager {
  static async initialize(): Promise<void> {
    if (db) return;
    try {
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });
      db = new SQL.Database();
      // Create the high_scores table if it doesn't exist
      db.run("CREATE TABLE IF NOT EXISTS high_scores (playerName TEXT, score INTEGER)");
    } catch (err) {
      console.error("Failed to initialize the database:", err);
    }
  }

  static async addHighScore(playerName: string, score: number): Promise<void> {
    if (!db) {
      await this.initialize();
    }
    try {
      const stmt = db!.prepare("INSERT INTO high_scores (playerName, score) VALUES (?, ?)");
      stmt.run([playerName, score]);
      stmt.free();
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
      if (scores.length < limit) {
        return true;
      }
      return score > scores[scores.length - 1].score;
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
    } catch (err) {
      console.error("Failed to clear scores:", err);
    }
  }
}

// Initialize the database when the module is loaded
ScoreManager.initialize();
