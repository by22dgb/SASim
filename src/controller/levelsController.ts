/*
Controller for the levels, effects and resistance divs.
*/

import { builderData } from "../data/buildData.js";
import { IABTypes } from "../data/buildString.js";
import { autoBattle } from "../data/object.js";
import { updateInput } from "../utility.js";
import { updateEffects, updateLimbs } from "../view/levelsView.js";
import { getEnemyLevel } from "./autoBattleController.js";
import { updateResistances } from "./resistanceController.js";

export function getActiveEffects() {
    const level = getEnemyLevel();
    const effects = autoBattle.getEffects(level);
    if (effects === undefined) {
        return new Map();
    }
    return effects;
}

export function changeLimbs(item: IABTypes["items"][keyof IABTypes["items"]]) {
    const increment = item.equipped ? 1 : -1;
    builderData.limbs += increment;
    updateLimbs(increment);
}

export function setEnemyLevel(level: number, frontendCall?: boolean) {
    // Backend
    autoBattle.enemyLevel = level;

    // Frontend
    if (!frontendCall) {
        updateInput("currentEnemyLevel", level);
        updateEffects();
    }

    updateResistances();
}

export function setMaxEnemyLevel(level: number, frontendCall?: boolean) {
    // Backend
    autoBattle.maxEnemyLevel = level;

    // Frontend
    if (!frontendCall) {
        updateInput("maxEnemyLevel", level);
    }
}
