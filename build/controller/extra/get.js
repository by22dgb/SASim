/*/
Provides functions for getting lists of items.
/*/
import { Trinary } from "../../utility.js";
import { getPossibleRingMods, getRing } from "../bonusesController.js";
import { getItemsInOrder } from "../itemEquipController.js";
import { getItem } from "../itemsController.js";
export function getItemsToRun(withRing) {
    const itemsToRun = [];
    const names = getItemsInOrder();
    for (const name of names) {
        const item = getItem(name);
        if (item.state === Trinary.Yes) {
            if (name === "Doppelganger_Signet")
                continue;
            itemsToRun.push(name);
        }
    }
    const ring = getRing();
    if (ring.bonus.owned) {
        itemsToRun.push("Ring");
    }
    return itemsToRun;
}
export function getModsToRun(count) {
    let modsToRun = [];
    const posMods = getPossibleRingMods();
    for (const mod in posMods)
        modsToRun.push(mod);
    if (count > 1) {
        modsToRun = modsToRun.flatMap((v, i) => modsToRun.slice(i + 1).map((w) => [v, w]));
    }
    return modsToRun;
}
