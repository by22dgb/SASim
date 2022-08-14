import { equipOneTimer, equipRing, getOneTimersSA, } from "./bonusesController.js";
import { equipItem } from "./itemsController.js";
export function buildItems(items) {
    Object.entries(items).forEach(([key, value]) => {
        const name = key;
        const newItem = value;
        if (newItem.equipped) {
            equipItem(name, newItem.level);
        }
    });
}
export function buildSave(saveString) {
    buildItems(saveString.items);
    equipRing(saveString.ring.mods, saveString.ring.level, false);
    // Set oneTimers
    const oneTimers = getOneTimersSA(saveString);
    Object.entries(oneTimers).forEach(([key, _]) => {
        const name = key;
        equipOneTimer(name);
    });
}
