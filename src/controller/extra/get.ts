/*/
Provides functions for getting lists of items.
/*/

import { Trinary } from "../../utility.js";
import { getPossibleRingMods, getRing } from "../bonusesController.js";
import { getItemsInOrder } from "../itemEquipController.js";
import { getItem } from "../itemsController.js";

export function getItemsToRun(withRing: boolean) {
    const itemsToRun = [] as string[];
    const names = getItemsInOrder();
    for (const name of names) {
        const item = getItem(name);
        if (item.state === Trinary.Yes) {
            if (name === "Doppelganger_Signet") continue;
            itemsToRun.push(name);
        }
    }
    const ring = getRing();
    if (ring.bonus.owned) {
        itemsToRun.push("Ring");
    }
    return itemsToRun;
}

export function getModsToRun(count: number) {
    let modsToRun: (string | string[])[] = [];
    const posMods = getPossibleRingMods();
    for (const mod in posMods) modsToRun.push(mod);
    if (count > 1) {
        modsToRun = modsToRun.flatMap((v, i) =>
            modsToRun.slice(i + 1).map((w) => [v, w] as string[]),
        );
    }
    return modsToRun;
}
