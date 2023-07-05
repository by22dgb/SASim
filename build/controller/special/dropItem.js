/*
Calculating the best item to remove from a build.
*/
import { modifiedAutoBattle } from "../autoBattleController";
import { getItemsToRun } from "./get";
const STORAGE = {
    itemsToRun: [],
};
export function dropItem() {
    runAllItems();
}
function runAllItems() {
    STORAGE.itemsToRun = getItemsToRun(false);
    if (STORAGE.itemsToRun.length > 0) {
        modifiedAutoBattle();
    }
}
