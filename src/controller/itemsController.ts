import { ISaveString } from "../data/buildString.js";
import { autoBattle } from "../data/object.js";
import { updateItem } from "../view/itemsView.js";
import { updateInput } from "./utility.js";

export function equipItem(
    item: keyof ISaveString["items"],
    level?: number,
    frontendCall?: boolean
) {
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

export function levelItem(
    item: keyof ISaveString["items"],
    level: number,
    frontendCall?: boolean
) {
    // Backend
    autoBattle.items[item].level = level;

    // Frontend
    if (!frontendCall) {
        updateInput(item, level);
    }
}

export function getItemsInOrder(): ISaveString["items"] {
    /* Warning this is a copy of the items object, not a reference to it */
    const order = autoBattle.getItemOrder();
    const items = getItems();
    // Order items
    const orderedItems: any = {};
    order.forEach((item) => {
        const name = item.name as keyof ISaveString["items"];
        orderedItems[name] = items[name];
    });
    return orderedItems;
}

export function getItems(): ISaveString["items"] {
    return autoBattle.items;
}

export function clearItems() {
    const items = getItems();
    Object.entries(items).forEach(([key, value]) => {
        value.equipped = false;
        value.level = 1;
        const name = key as keyof ISaveString["items"];
        updateItem(name, true);
        updateInput(name, 1);
    });
}
