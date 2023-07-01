/*
Defines item and items classes.
Proivdes functions for interacting with items.
All files interacting with items should go through this file.
*/
import { autoBattle } from "../data/object";
export class Items {
    static instance;
    // Singleton pattern
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }
    static getInstance() {
        if (!Items.instance) {
            Items.instance = new Items();
        }
        return Items.instance;
    }
    items = [];
    getItem(name) {
        // The key type guarantees that the item exists
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.items.find((item) => item.name === name);
    }
    push(item) {
        this.items.push(item);
    }
}
export class Item {
    name;
    currentState = "no";
    constructor(name) {
        this.name = name;
    }
    get state() {
        return this.currentState;
    }
    set state(state) {
        this.currentState = state;
    }
    get item() {
        return autoBattle.items[this.name];
    }
}
export function initialiseItems() {
    createItems();
}
export function createItems() {
    // For each of the items in autobattle, create an item object
    const items = getItems();
    const itemsClass = Items.getInstance();
    for (const key of Object.keys(items)) {
        const name = key;
        const item = new Item(name);
        itemsClass.push(item);
    }
}
function getItems() {
    return autoBattle.items;
}
function getItem(item) {
    const items = Items.getInstance();
    return items.getItem(item);
}
