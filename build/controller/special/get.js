/*/
Provides functions for getting lists of items.
/*/
import { Trinary } from "../../utility";
import { getRing } from "../bonusesController";
import { getItemsInOrder } from "../itemEquipController";
import { getItem } from "../itemsController";
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
