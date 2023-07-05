/*
Functions for calculating best ring mods.
*/
import { uiSetMods, uiUpdateMod } from "../../view/bestRingModsView.js";
import { getKillTime, getDustPs, modifiedAutoBattle, startSimulation, } from "../autoBattleController.js";
import { equipRingMods, getPossibleRingMods, getRing, unequipRingMods, } from "../bonusesController.js";
let MODSTORUN = [];
let CURRENTMODS;
let ORIGINALMODS;
export function findBestMod() {
    const ring = getRing().stats;
    ORIGINALMODS = ring.mods;
    const lvl = ring.level;
    if (lvl < 5)
        return; // No mods
    if (lvl < 15) {
        updateModsToRun(1);
    }
    else {
        updateModsToRun(2);
    }
    uiSetMods(MODSTORUN);
    CURRENTMODS = MODSTORUN.shift();
    simulateNextMod();
}
function updateModsToRun(count) {
    const posMods = getPossibleRingMods();
    for (const mod in posMods)
        MODSTORUN.push(mod);
    if (count > 1) {
        MODSTORUN = MODSTORUN.flatMap((v, i) => MODSTORUN.slice(i + 1).map((w) => [v, w]));
    }
}
function simulateNextMod() {
    unequipRingMods();
    const mod = listMods(CURRENTMODS);
    equipRingMods(mod);
    modifiedAutoBattle();
    startSimulation(onUpdate, onComplete);
}
function onUpdate() {
    const killTime = getKillTime();
    const dustPs = getDustPs();
    uiUpdateMod(listMods(CURRENTMODS), killTime, dustPs);
}
function onComplete() {
    const mod = MODSTORUN.shift();
    if (mod !== undefined) {
        CURRENTMODS = mod;
        simulateNextMod();
    }
    else {
        unequipRingMods();
        equipRingMods(listMods(ORIGINALMODS));
    }
}
function listMods(mod) {
    if (Array.isArray(mod))
        return mod;
    return [mod];
}
