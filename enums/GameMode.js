
export default class GameMode {
    static MIN2 = '2min';
    static MIN10 = '10min';

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