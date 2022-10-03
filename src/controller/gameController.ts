/* 
Controller for the autobattle simulation.
Should only be interacted with from the autoBattleController and index.
*/

import { u2Mutations } from "../data/mutations.js";
import { autoBattle } from "../data/object.js";
import { convertMilliSecondsToTime } from "../utility.js";
import { IResults } from "./autoBattleController.js";

interface IConfig {
    framesPerChunk: number;
    onSimInterrupt: Function | null; // Function to call when simulation is interrupted
    onSimComplete: Function | null; // Function to call when simulation is complete
    onUpdate: Function | null; // Function to call when simulation is updated
    runtime: number; // Max runtime in milliseconds
    updateInterval: number; // Update interval in milliseconds
}

export const gameController = {
    framesPerChunk: 0,
    battleCount: 0,
    complete: false,
    interval: null as number | null, // Interval ID
    halt: false,
    onSimInterrupt: null as Function | null,
    onSimComplete: null as Function | null,
    onUpdate: null as Function | null,
    resultBest: { enemy: 1, time: 0, win: false },
    resultCounter: { fights: 0, healthSum: 0, losses: 0 },
    runtime: 0,
    modified: true,
    lastUpdate: 0,
    updateInterval: 0,

    getDefaultConfig(): IConfig {
        return {
            framesPerChunk: 200,
            onSimInterrupt: null,
            onSimComplete: null,
            onUpdate: null,
            runtime: 8 * 60 * 60 * 1000, // 8 hours
            updateInterval: 4 * 60 * 60 * 1000, // 4 hours
        };
    },

    getProgress() {
        const progress = autoBattle.lootAvg.counter / this.runtime;
        return this.complete ? 1 : progress;
    },

    isRunning() {
        return this.interval != null;
    },

    configure(config: IConfig) {
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
        this.resultCounter = { fights: 0, healthSum: 0, losses: 0 };
    },

    start() {
        if (this.interval != null) {
            return; // Already running
        }
        if (this.modified) {
            this.resetStats();
            this.modified = false;
        }

        this.battleCount =
            autoBattle.sessionEnemiesKilled + autoBattle.sessionTrimpsKilled;
        this.complete = false;
        this.halt = false;
        this.interval = setInterval(this.loop, 0);
    },

    stop() {
        this.halt = true;
    },

    loop() {
        // Use gameController instead of "this" to reference the correct object.
        for (
            let frame = 0;
            !gameController.halt && frame < gameController.framesPerChunk;
            ++frame
        ) {
            autoBattle.update();
            gameController.complete =
                autoBattle.lootAvg.counter >= gameController.runtime;
            gameController.halt = gameController.complete;
        }

        if (gameController.halt && gameController.interval) {
            clearInterval(gameController.interval);
            gameController.interval = null;
        }

        const newUpdate = Math.floor(
            autoBattle.lootAvg.counter / gameController.updateInterval
        );

        if (gameController.halt || newUpdate > gameController.lastUpdate) {
            gameController.lastUpdate = newUpdate;
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
        ++this.resultCounter.losses;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const config: IConfig = {
    framesPerChunk: 200,
    onSimInterrupt: null,
    onSimComplete: null,
    onUpdate: null,
    runtime: 8 * 60 * 60 * 1000, // 8 hours
    updateInterval: 4 * 60 * 60 * 1000, // 4 hours
};

export function getResults(): IResults {
    const enemyLevel = autoBattle.enemyLevel;
    const toKill = enemyCount(enemyLevel);

    // Standards
    const assumeTomeLevel = 43;
    const assumeDustierLevel = 85;

    // Kills
    const enemiesKilled = autoBattle.sessionEnemiesKilled;
    const trimpsKilled = autoBattle.sessionTrimpsKilled;

    // Dust gains
    let baseDust = autoBattle.getDustPs();
    const gameDust = baseDust;

    // Remove multipliers
    baseDust = autoBattle.scruffyLvl21 ? baseDust / 5 : baseDust;
    if (enemyLevel < assumeDustierLevel) {
        baseDust = u2Mutations.tree.Dust.purchased
            ? baseDust / (1.25 + (u2Mutations.tree.Dust2.purchased ? 0.25 : 0))
            : baseDust;

        if (enemyLevel < assumeTomeLevel) {
            baseDust = autoBattle.oneTimers.Dusty_Tome.owned
                ? baseDust / (1 + 0.05 * (autoBattle.maxEnemyLevel - 1))
                : baseDust;
        }
    }

    // Times
    const timeUsed = autoBattle.lootAvg.counter;
    const killTime = timeUsed / enemiesKilled;
    const fightTime = timeUsed / (enemiesKilled + trimpsKilled);
    const clearingTime =
        (toKill / autoBattle.sessionEnemiesKilled) * autoBattle.lootAvg.counter;
    const remainingTime = toKill * killTime; // TODO: Add support for save loading

    // Health
    const resultCounter = gameController.resultCounter;
    const enemyHealth = Math.round(
        resultCounter.healthSum / resultCounter.fights
    );
    const enemyHealthLoss = Math.round(
        resultCounter.healthSum / resultCounter.losses
    );
    // Best fight
    const resultBest = gameController.resultBest;
    const bestFight = resultBest.win
        ? "win in " + convertMilliSecondsToTime(resultBest.time)
        : "loss in " +
          convertMilliSecondsToTime(resultBest.time) +
          " with " +
          Math.round(resultBest.enemy * 100 * 10) / 10 +
          "% enemy health left";

    return {
        isRunning: gameController.isRunning(),
        timeUsed,
        runtime: gameController.runtime,
        enemiesKilled,
        trimpsKilled,
        gameDust,
        baseDust,
        killTime,
        clearingTime,
        remainingTime,
        fightTime,
        enemyHealth,
        enemyHealthLoss,
        bestFight,
    };
}

export function setupController() {
    autoBattle.onEnemyDied = gameController.battleSuccess.bind(gameController);
    autoBattle.onTrimpDied = gameController.battleFailure.bind(gameController);
}

const enemyCount = (level: number) => {
    if (level < 20) return 10 * level;
    return 190 + 15 * (level - 19);
};
