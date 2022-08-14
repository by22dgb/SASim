import { autoBattle } from "../data/object.js";
import { updateItem } from "../view/itemsView.js";
import { updateInput } from "./utility.js";
export function equipItem(item, level, frontendCall) {
    // Backend
    autoBattle.equip(item);
    if (level) {
        autoBattle.items[item].level = level;
    }
    // Frontend
    updateItem(item);
    if (level && !frontendCall) {
        levelItem(item, level, frontendCall);
    }
}
export function levelItem(item, level, frontendCall) {
    // Backend
    autoBattle.items[item].level = level;
    // Frontend
    if (!frontendCall) {
        updateInput(item, level);
    }
}
export function getItemsInOrder() {
    /* Warning this is a copy of the items object, not a reference to it */
    const order = autoBattle.getItemOrder();
    const items = getItems();
    // Order items
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
export function clearItems() {
    const items = getItems();
    Object.entries(items).forEach(([key, value]) => {
        value.equipped = false;
        value.level = 1;
        const name = key;
        updateItem(name, true);
        updateInput(name, 1);
    });
}
