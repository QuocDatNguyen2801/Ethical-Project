import Dexie, { Table } from 'dexie';

export interface HighScore {
  id?: number;
  playerName: string;
  score: number;
  level: number;
  date: Date;
}

export class GameDatabase extends Dexie {
  highScores!: Table<HighScore>;

  constructor() {
    super('CookingMamaGameDB');
    this.version(1).stores({
      highScores: '++id, playerName, score, level, date'
    });
  }
}

export const db = new GameDatabase();

export class ScoreManager {
  static async addHighScore(playerName: string, score: number, level: number): Promise<void> {
    await db.highScores.add({
      playerName,
      score,
      level,
      date: new Date()
    });
  }

  static async getHighScores(limit: number = 10): Promise<HighScore[]> {
    return await db.highScores
      .orderBy('score')
      .reverse()
      .limit(limit)
      .toArray();
  }

  static async clearAllScores(): Promise<void> {
    await db.highScores.clear();
  }
}
