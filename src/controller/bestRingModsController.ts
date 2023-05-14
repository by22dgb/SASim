/*
Functions for calculating best ring mods.
*/

import { IRing } from "../data/buildTypes";
import { uiSetMods, uiUpdateMod } from "../view/bestRingModsView.js";
import {
    getKillTime,
    getDustPs,
    modifiedAutoBattle,
    startSimulation,
} from "./autoBattleController.js";
import {
    equipRingMods,
    getPossibleRingMods,
    getRing,
    unequipRingMods,
} from "./bonusesController.js";

let MODSTORUN: (string | string[])[] = [];
let CURRENTMODS: string | string[];
let ORIGINALMODS: string | string[];

export function findBestMod() {
    const ring = getRing().stats as IRing;
    ORIGINALMODS = ring.mods as unknown as string | string[];
    const lvl = ring.level;
    if (lvl < 5) return; // No mods
    if (lvl < 15) {
        updateModsToRun(1);
    } else {
        updateModsToRun(2);
    }
    uiSetMods(MODSTORUN);
    CURRENTMODS = MODSTORUN.shift() as string;
    simulateNextMod();
}

function updateModsToRun(count: number) {
    const posMods = getPossibleRingMods();
    for (const mod in posMods) MODSTORUN.push(mod);
    if (count > 1) {
        MODSTORUN = MODSTORUN.flatMap((v, i) =>
            MODSTORUN.slice(i + 1).map((w) => [v, w] as string[]),
        );
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
    const mod = MODSTORUN.shift() as string;
    if (mod !== undefined) {
        CURRENTMODS = mod;
        simulateNextMod();
    } else {
        unequipRingMods();
        equipRingMods(listMods(ORIGINALMODS));
    }
}

function listMods(mod: string | string[]) {
    if (Array.isArray(mod)) return mod;
    return [mod];
}
