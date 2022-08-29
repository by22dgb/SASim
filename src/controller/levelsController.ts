/*
Controller for the levels, effects and resistance divs.
*/

import { builderData } from "../data/buildData.js";
import { IABTypes } from "../data/buildString.js";
import { autoBattle } from "../data/object.js";
import { updateLimbs } from "../view/levelsView.js";
import { getEnemyLevel } from "./autoBattleController.js";

export function getActiveEffects() {
    // TODO: Fix this
    const level = getEnemyLevel();
    const effects = autoBattle.getEffects(100);
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
