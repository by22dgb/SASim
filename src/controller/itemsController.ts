/*
Controls equipping and leveling items.
Sends calls both to frontend and backend.
*/

import { IABTypes } from "../data/buildString.js";
import { autoBattle } from "../data/object.js";
import { updateItem } from "../view/itemsView.js";
import { updateInput } from "../utility.js";
import { changeLimbs } from "./levelsController.js";

export function equipItem(
    itemName: keyof IABTypes["items"],
    level?: number,
    frontendCall?: boolean
) {
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
}

export function levelItem(
    item: keyof IABTypes["items"],
    level: number,
    frontendCall?: boolean
) {
    // Backend
    const items = getItems();
    items[item].level = level;

    // Frontend
    if (!frontendCall) {
        updateInput(item, level);
    }
}

export function getItemsInOrder(): IABTypes["items"] {
    /* Warning this is a copy of the items object, not a reference to it */
    const order = autoBattle.getItemOrder();
    const items = getItems();
    // Order items
    const orderedItems: any = {};
    order.forEach((item) => {
        const name = item.name as keyof IABTypes["items"];
        orderedItems[name] = items[name];
    });
    return orderedItems;
}

export function getItems(): IABTypes["items"] {
    return autoBattle.items;
}

export function getItem(
    item: keyof IABTypes["items"]
): IABTypes["items"][keyof IABTypes["items"]] {
    return autoBattle.items[item];
}

export function clearItems() {
    const items = getItems();
    for (const [key, value] of Object.entries(items)) {
        value.equipped = false;
        value.level = 1;
        const name = key as keyof IABTypes["items"];
        updateItem(name, true);
        updateInput(name, 1);
    }
}
