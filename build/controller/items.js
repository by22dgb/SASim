"use strict";
class Items {
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
