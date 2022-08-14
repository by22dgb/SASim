import { autoBattle } from "../data/object.js";
import { pick, updateButton, updateInput } from "./utility.js";
import { u2Mutations } from "../data/mutations.js";
export function getOneTimers() {
    return autoBattle.oneTimers;
}
export function getOneTimersSA(saveString) {
    const data = saveString ? saveString : autoBattle;
    const oneTimers = data.oneTimers;
    return pick(oneTimers, "Master_of_Arms", "Dusty_Tome", "Whirlwind_of_Arms");
}
export function getRing() {
    const mods = autoBattle.rings.mods;
    return {
        owned: autoBattle.oneTimers.The_Ring.owned,
        level: autoBattle.rings.level,
        mods: mods,
    };
}
export function getPossibleRingMods() {
    return autoBattle.ringStats;
}
export function getMutations() {
    return u2Mutations.tree;
}
export function clearBonuses() {
    const oneTimers = getOneTimersSA();
    Object.entries(oneTimers).forEach(([key, _]) => {
        const name = key;
        oneTimers[name].owned = false;
        updateButton(name, true);
    });
    const ring = getRing();
    const mods = getPossibleRingMods();
    ring.owned = false;
    ring.level = 1;
    ring.mods = [];
    updateInput("Ring", 1);
    Object.entries(mods).forEach(([key, _]) => {
        const name = key;
        updateButton(name, true);
    });
    const mutations = getMutations();
    Object.entries(mutations).forEach(([key, _]) => {
        const name = key;
        mutations[name].purchased = false;
        updateButton(name, true);
    });
    autoBattle.scruffyLvl21 = false;
    updateButton("S21", true);
}
export function equipOneTimer(oneTimer, setUnselected) {
    // Backend
    autoBattle.oneTimers[oneTimer].owned =
        !autoBattle.oneTimers[oneTimer].owned;
    // Frontend
    updateButton(oneTimer, setUnselected);
}
export function equipRing(ringMods, level, frontendCall) {
    autoBattle.oneTimers.The_Ring.owned =
        ringMods !== undefined && ringMods.length > 0;
    const ring = getRing();
    if (ringMods !== undefined && ringMods.length > 0) {
        // Backend
        const index = ring.mods.indexOf(ringMods);
        if (index === -1) {
            ring.mods.push(ringMods);
        }
        else {
            ring.mods.splice(index);
        }
        // Frontend
        Object.entries(ringMods).forEach(([_, value]) => {
            updateButton(value);
        });
    }
    if (level) {
        // Backend
        ring.level = level;
        // Frontend
        if (!frontendCall) {
            updateInput("Ring", level);
        }
    }
}
export function equipMutation(mutation, setUnselected) {
    // Backend
    const mutations = getMutations();
    mutations[mutation].purchased = !mutations[mutation].purchased;
    // Frontend
    updateButton(mutation, setUnselected);
}
export function equipScruffy(xp, setUnselected) {
    const update = xp ? xp > 1466015503701000 : true;
    if (update) {
        // Backend
        autoBattle.scruffyLvl21 = !autoBattle.scruffyLvl21;
        if (xp)
            autoBattle.fluffyExp2 = xp;
        // Frontend
        updateButton("S21", setUnselected);
    }
}
