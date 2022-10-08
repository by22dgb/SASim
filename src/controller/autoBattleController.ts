/*
Controls the autobattle simulation. 
Get information about the simulation, start and stop it.
*/

import { u2Mutations } from "../data/mutations.js";
import { autoBattle } from "../data/object.js";
import { convertMilliSecondsToTime, round } from "../utility.js";
import { updateLiveResults, updateTimeSpent } from "../view/simulationView.js";
import { getOneTimersSA } from "./bonusesController.js";
import { updateBuildCost } from "./buildController.js";
import { conConfig, gameController } from "./gameController.js";
import { updateResistances } from "./resistanceController.js";
import { getRemainingEnemies } from "./saveController.js";

export interface IResults {
    isRunning: boolean;
    timeUsed: number;
    runtime: number;
    enemiesKilled: number;
    trimpsKilled: number;
    gameDust: number;
    baseDust: number;
    clearingTime: number;
    remainingTime: number;
    fightTime: number;
    killTime: number;
    enemyHealth: number;
    enemyHealthLoss: number;
    bestFight: string;
}

let _isAutoRun = false;

export function getAutoRun() {
    return _isAutoRun;
}

export function updateAutoRun() {
    _isAutoRun = !_isAutoRun;
}

export function startSimulation(
    onUpdate?: Function,
    onComplete?: Function,
    onInterrupt?: Function
) {
    if (gameController.isRunning()) {
        return;
    }

    if (onUpdate) {
        conConfig.setOnUpdate(onUpdate);
    } else {
        conConfig.setOnUpdate(liveUpdate);
    }

    if (onComplete) {
        conConfig.setOnComplete(onComplete);
    }

    if (onInterrupt) {
        conConfig.setOnInterrupt(onInterrupt);
    } else {
        conConfig.setOnInterrupt(liveInterrupt);
    }

    if (conConfig.runtime === 0) {
        conConfig.incRuntime();
    }

    runSimulation();
}

export function stopSimulation() {
    gameController.stop();
}

function liveUpdate() {
    const results = getResults();
    updateLiveResults(results);
}

function liveInterrupt() {
    const results = getResults();
    updateTimeSpent(results.isRunning, results.timeUsed, results.runtime);
}

function runSimulation() {
    gameController.start();
}

export function startSimulationFromButton() {
    conConfig.incRuntime();
    if (!gameController.modified) {
        if (!gameController.isRunning()) {
            conConfig.setOnUpdate(liveUpdate);
            runSimulation();
        }
    } else {
        startSimulation();
    }
}

export function getEnemyLevel() {
    return autoBattle.enemyLevel;
}

export function getMaxEnemyLevel() {
    return autoBattle.maxEnemyLevel;
}

export function printAllInfo() {
    // Returns all info for human eye, interacts directly with autoBattle object for safety, use for testing, do not use for anything useful.
    const info = [];

    const maxEnemyLevel = autoBattle.maxEnemyLevel;
    const enemyLevel = autoBattle.enemyLevel;
    info.push(`Levels: ${maxEnemyLevel} ${enemyLevel}`);

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const uneqItems = {} as any;
    const items = {} as any;
    /* eslint-enable @typescript-eslint/no-explicit-any */
    for (const [item, value] of Object.entries(autoBattle.items)) {
        if (value.equipped) {
            items[item] = value.level;
        } else {
            uneqItems[item] = value.level;
        }
    }
    info.push(uneqItems);
    info.push(items);

    const SAOneTimers = getOneTimersSA();
    for (const [oneTimer, value] of Object.entries(autoBattle.oneTimers)) {
        if (value.owned && oneTimer in SAOneTimers) {
            info.push(oneTimer);
        }
    }

    if (autoBattle.oneTimers.The_Ring.owned) {
        const level = autoBattle.rings.level;
        const mods = autoBattle.rings.mods;
        const ring = `${level} ${mods.join()}`;
        info.push(ring);
    }

    for (const [mutation, value] of Object.entries(u2Mutations.tree)) {
        if (value.purchased) {
            info.push(mutation);
        }
    }

    if (autoBattle.scruffyLvl21) {
        info.push("Scruffy 21");
    }

    info.forEach((entry) => {
        console.log(entry);
    });
}

export function modifiedAutoBattle() {
    gameController.halt = true;
    gameController.modified = true;
    resetAutoBattle();
}

export function resetAutoBattle() {
    gameController.lastUpdate = 0;
    conConfig.resetRuntime();
    conConfig.resetFunctions();
}

export function modifiedAutoBattleWithBuild() {
    modifiedAutoBattle();
    updateResistances();
    updateBuildCost();
    if (getAutoRun()) {
        startSimulationFromButton();
    }
}

export function setRuntime(runtime: number) {
    const milliSeconds = runtime * 1000 * 60 * 60;
    conConfig.setBaseRuntime(milliSeconds);
}

export function getDustPs() {
    return autoBattle.getDustPs();
}

export function getClearingTime() {
    const enemyLevel = autoBattle.enemyLevel;
    const toKill = enemyCount(enemyLevel);
    return (
        (toKill / autoBattle.sessionEnemiesKilled) * autoBattle.lootAvg.counter
    );
}

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
    let baseDust = getDustPs();
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
    const clearingTime = getClearingTime();
    const remainingKills = getRemainingEnemies();
    const remainingTime = remainingKills * killTime;

    // Health
    const resultCounter = gameController.resultCounter;
    const enemyHealth = round(
        (resultCounter.healthSum / resultCounter.fights) * 100,
        2
    );
    const enemyHealthLoss = round(
        (resultCounter.healthSum / resultCounter.losses) * 100,
        2
    );

    // Best fight
    const resultBest = gameController.resultBest;
    const bestTime = convertMilliSecondsToTime(resultBest.time);
    const bestFight = resultBest.win
        ? "win in " + bestTime
        : "loss in " +
          bestTime +
          " with " +
          round(resultBest.enemy * 100, 1) +
          "% enemy health left";

    return {
        isRunning: gameController.isRunning(),
        timeUsed,
        runtime: conConfig.runtime,
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

export const enemyCount = (level: number) => {
    if (level < 20) return 10 * level;
    return 190 + 15 * (level - 19);
};

export function simIsRunning() {
    return gameController.isRunning();
}
