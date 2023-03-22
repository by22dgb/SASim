/*
Functions for calculating best ring mods.
*/

import { getPossibleRingMods, getRing } from "./bonusesController.js";

export function findBestMod() {
    const ring = getRing().stats;
    const lvl = ring.level;
    const currMods = ring.mods;
    const posMods = getPossibleRingMods();
    console.log(currMods, posMods, lvl);
}
