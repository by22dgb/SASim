import { IItem, ISaveString } from "../data/buildString.js";
import { autoBattle } from "../data/object.js";
import {
    equipOneTimer,
    equipRing,
    getOneTimersSA,
} from "./bonusesController.js";
import { equipItem } from "./itemsController.js";

export function buildItems(items: ISaveString["items"]) {
    Object.entries(items).forEach(([key, value]) => {
        const name = key as keyof ISaveString["items"];
        const newItem = value;
        if (newItem.equipped) {
            equipItem(name, newItem.level);
        }
    });
}

export function buildSave(saveString: ISaveString) {
    buildItems(saveString.items);

    equipRing(saveString.ring.mods, saveString.ring.level, false);

    // Set oneTimers
    const oneTimers = getOneTimersSA(saveString);
    Object.entries(oneTimers).forEach(([key, _]) => {
        const name = key as keyof ISaveString["oneTimers"];
        equipOneTimer(name);
    });
}
