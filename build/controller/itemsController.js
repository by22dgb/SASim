/*
Controls equipping and leveling items.
Sends calls both to frontend and backend.
*/
import { autoBattle } from "../data/object.js";
import { updateDescription, updateItem } from "../view/itemsView.js";
import { updateInput } from "../utility.js";
import { changeLimbs } from "./levelsController.js";
import { modifiedAutoBattleWithBuild } from "./autoBattleController.js";
export function equipItem(itemName, level, frontendCall) {
    // Backend
    autoBattle.equip(itemName);
    const item = getItem(itemName);
    changeLimbs(item);
    if (level) {
        item.level = level;
    }
    // Frontend
    updateItem(itemName);
    if (level && !frontendCall) {
        levelItem(itemName, level, frontendCall);
    }
    modifiedAutoBattleWithBuild();
}
export function levelItem(item, level, frontendCall) {
    // Backend
    const items = getItems();
    items[item].level = level;
    // Frontend
    updateDescription(item);
    if (!frontendCall) {
        updateInput(item, level);
    }
    modifiedAutoBattleWithBuild();
}
export function incrementItem(item, increment) {
    const items = getItems();
    items[item].level += increment;
}
export function getItemsInOrder() {
    /* Warning this is a copy of the items object, not a reference to it */
    const order = autoBattle.getItemOrder();
    const items = getItems();
    // Order items
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderedItems = {};
    order.forEach((item) => {
        const name = item.name;
        orderedItems[name] = items[name];
    });
    return orderedItems;
}
export function getItems() {
    return autoBattle.items;
}
export function getItem(item) {
    return autoBattle.items[item];
}
export function clearItems() {
    const items = getItems();
    for (const [key, value] of Object.entries(items)) {
        value.equipped = false;
        value.level = 1;
        const name = key;
        updateItem(name, true);
        updateInput(name, 1);
    }
}
export function getItemPrice(name, increment) {
    const item = getItem(name);
    const startPrice = "startPrice" in item ? item.startPrice : 5;
    const priceMod = "priceMod" in item ? item.priceMod : 3;
    const contractPrice = autoBattle.contractPrice(name);
    let cost = isNaN(contractPrice) ? 0 : contractPrice;
    const level = increment ? item.level + increment : item.level;
    cost += startPrice * ((1 - Math.pow(priceMod, level - 1)) / (1 - priceMod));
    return cost;
}
