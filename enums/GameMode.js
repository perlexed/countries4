
export default class GameMode {
    static MIN2 = 'min2';
    static MIN10 = 'min10';

    static getLengths() {
        return {
            [this.MIN2]: 120,
            [this.MIN10]: 600,
        }
    }

    static getGameModeLength(gameMode) {
        return this.getLengths()[gameMode] || null;
    }

}