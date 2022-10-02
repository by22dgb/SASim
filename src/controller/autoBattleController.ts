/*
Controls the autobattle simulation. 
Get information about the simulation, start and stop it.
*/

import { IABTypes } from "../data/buildString.js";
import { u2Mutations } from "../data/mutations.js";
import { autoBattle } from "../data/object.js";
import { updateLiveResults } from "../view/simulationView.js";
import { getOneTimersSA, getRing } from "./bonusesController.js";
import { gameController, getResults } from "./gameController.js";
import { getItems } from "./itemsController.js";

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

const controllerConfig = gameController.getDefaultConfig();

export function startSimulation() {
    if (gameController.isRunning()) {
        return;
    }

    controllerConfig.onUpdate = liveUpdate;
    gameController.configure(controllerConfig);

    runSimulation();
}

export function stopSimulation() {
    gameController.stop();
}

function liveUpdate() {
    const results = getResults();
    updateLiveResults(results);
}

function runSimulation() {
    gameController.start();
}

function calcBuildCost() {
    // Not here I think
    let dustCost = 0;
    let shardCost = 0;

    // Price for items.
    const items = getItems();
    Object.entries(items).forEach(([_, value]) => {
        if (value.equipped) {
            const startPrice = "startPrice" in value ? value.startPrice : 5;
            const priceMod = "priceMod" in value ? value.priceMod : 3;
            const cost =
                (startPrice || 5) *
                ((1 - Math.pow(priceMod || 3, value.level - 1)) /
                    (1 - (priceMod || 3)));
            if ("dustType" in value && value.dustType === "shards") {
                shardCost += cost;
            } else {
                dustCost += cost;
            }
        }
    });

    // Price for one timers.
    const oneTimers = getOneTimersSA();
    Object.entries(oneTimers).forEach(([key, value]) => {
        const name = key as keyof IABTypes["oneTimers"];
        const cost = autoBattle.oneTimerPrice(name);
        if ("useShards" in value && value.useShards) {
            shardCost += cost;
        } else {
            dustCost += cost;
        }
    });

    // Price for ring.
    const ring = getRing();
    if (ring.bonus.owned) {
        shardCost += Math.ceil(15 * Math.pow(2, ring.stats.level) - 30);
    }

    // Price for extra limbs.
    // TODO: once builder from ymh is added
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

    const uneqItems = {} as any;
    const items = {} as any;
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
