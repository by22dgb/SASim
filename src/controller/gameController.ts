/* 
Controller for the autobattle simulation.
Should only be interacted with from the autoBattleController and index.
*/


import { autoBattle } from "../data/object.js";

interface IConfig {
    fights: number; // Max enemy + huffy deaths
    framesPerChunk: number;
    onSimInterrupt: Function | null; // Function to call when simulation is interrupted
    onSimComplete: Function | null; // Function to call when simulation is complete
    onUpdate: Function | null; // Function to call when simulation is updated
    runtime: number; // Max runtime in seconds
    updateInterval: number; // Update interval in milliseconds
}

export const gameController = {
    framesPerChunk: 200,
    battles: 1000,
    battleCount: 0,
    complete: false,
    interval: null as number | null, // Interval ID
    lastFrame: 0,
    halt: false,
    onSimInterrupt: null as Function | null,
    onSimComplete: null as Function | null,
    onUpdate: null as Function | null,
    resultBest: { enemy: 1, time: 0, win: false },
    resultCounter: { fights: 0, healthSum: 0, loses: 0 },
    runtime: 8 * 60 * 60,
    modificated: true,
    timeStart: 0,
    timeUsed: 0,
    updateInterval: 1000,
    lastUpdate: Date.now(),

    getDefaultConfig(): IConfig {
        return {
            fights: 1000,
            framesPerChunk: 200,
            onSimInterrupt: null,
            onSimComplete: null,
            onUpdate: null,
            runtime: 8 * 60 * 60,
            updateInterval: 1000,
        };
    },

    getProgress(): number {
        const progress = Math.max(
            autoBattle.lootAvg.counter / 1000 / this.runtime,
            this.battleCount / this.battles
        );
        return this.complete ? 1 : progress;
    },

    getTimeUsed(): number {
        const interval =
            this.interval == null ? 0 : Date.now() - this.timeStart;
        return this.timeUsed + interval;
    },

    isRunning(): boolean {
        return this.interval != null;
    },

    modifiedAutoBattle() {
        this.halt = true;
        this.modificated = true;
    },

    configure(config: IConfig) {
        this.battles = config.fights;
        this.framesPerChunk = config.framesPerChunk;
        this.onSimInterrupt = config.onSimInterrupt;
        this.onSimComplete = config.onSimComplete;
        this.onUpdate = config.onUpdate;
        this.runtime = config.runtime;
        this.updateInterval = config.updateInterval;
    },

    resetStats() {
        autoBattle.resetAll();
        this.resultBest = { enemy: 1, time: 0, win: false };
        this.resultCounter = { fights: 0, healthSum: 0, loses: 0 };
        this.timeUsed = 0;
    },

    start() {
        if (this.interval != null) {
            return; // Already running
        }
        if (this.modificated) {
            this.resetStats();
            this.modificated = false;
        }

        this.battleCount =
            autoBattle.sessionEnemiesKilled + autoBattle.sessionTrimpsKilled;
        this.complete = false;
        this.halt = false;
        this.lastUpdate = Date.now();
        this.timeStart = this.lastUpdate;
        this.interval = setInterval(this.loop, 0);
        
    },

    stop() {
        this.halt = true;
    },

    loop() {
        // Use gameController instead of this to reference the correct object.
        for (
            let frame = 0;
            !gameController.halt && frame < gameController.framesPerChunk;
            ++frame
        ) {
            autoBattle.update();
            gameController.complete =
                autoBattle.lootAvg.counter / 1000 >= gameController.runtime ||
                gameController.battleCount >= gameController.battles;
                gameController.halt == gameController.complete;
        }

        const now = Date.now();
        if (gameController.halt && gameController.interval) {
            clearInterval(gameController.interval);
            gameController.interval = null;
            gameController.timeUsed = now - gameController.timeStart;
        }
        if (gameController.halt || now - gameController.lastUpdate >= gameController.updateInterval) {
            gameController.lastUpdate = now;
            if (gameController.onUpdate) {
                gameController.onUpdate();
            }
            if (gameController.halt) {
                if (gameController.complete && gameController.onSimComplete) {
                    gameController.onSimComplete();
                } else if (gameController.onSimInterrupt) {
                    gameController.onSimInterrupt();
                }
            }
        }
    },

    battleSuccess() {
        ++this.resultCounter.fights;
        if (!this.resultBest.win) {
            this.resultBest.enemy = 0;
            this.resultBest.time = autoBattle.battleTime;
            this.resultBest.win = true;
        }
        if (this.resultBest.time > autoBattle.battleTime) {
            this.resultBest.time = autoBattle.battleTime;
        }
        this.battleCommon();
    },

    battleFailure() {
        ++this.resultCounter.fights;
        ++this.resultCounter.loses;
        const enemy = autoBattle.enemy as any;
        const enemyHealthPercentage = Math.max(
            0,
            Math.min(enemy.health / enemy.maxHealth, 1)
        );

        if (!this.resultBest.win) {
            if (enemyHealthPercentage < this.resultBest.enemy) {
                this.resultBest.enemy = enemyHealthPercentage;
                this.resultBest.time = autoBattle.battleTime;
            } else if (
                enemyHealthPercentage == this.resultBest.enemy &&
                autoBattle.battleTime > this.resultBest.time
            ) {
                this.resultBest.time = autoBattle.battleTime;
            }
        }
        this.resultCounter.healthSum += enemyHealthPercentage;
        this.battleCommon();
    },

    battleCommon() {
        this.battleCount =
            autoBattle.sessionEnemiesKilled + autoBattle.sessionTrimpsKilled;
    },
};

export function setupController() {
    autoBattle.onEnemyDied = gameController.battleSuccess.bind(gameController);
    autoBattle.onTrimpDied = gameController.battleFailure.bind(gameController);
}
