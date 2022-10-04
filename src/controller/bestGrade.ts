/*
Functions for calculating the best upgrade and best downgrade items.
*/

import { IABTypes } from "../data/buildTypes.js";
import { uiSetGradesItems, uiUpdateGradeItem } from "../view/bestGradesView.js";
import {
    modifiedAutoBattle,
    startSimulation,
    getDustPs,
    getClearingTime,
} from "./autoBattleController.js";
import { getRing } from "./bonusesController.js";
import {
    getItemsInOrder,
    getPrice,
    incrementItem,
    incrementRing,
} from "./itemsController.js";

export function findBestGrade(increment: number) {
    storage.increment = increment;
    runAllItems();
}

const storage = {
    increment: 0,
    itemsToRun: [] as string[],
    baseDustPs: 0,
    baseClearingTime: 0,
    currentItem: "",
};

function updateItemsToRun() {
    const items = getItemsInOrder();
    for (const [name, item] of Object.entries(items)) {
        if (item.equipped) {
            if (name === "Doppelganger_Signet") continue;
            storage.itemsToRun.push(name);
        }
    }
    const ring = getRing();
    if (ring.bonus.owned) {
        storage.itemsToRun.push("Ring");
    }
}

function runAllItems() {
    modifiedAutoBattle();
    updateItemsToRun();
    if (storage.itemsToRun.length > 0) {
        uiSetGradesItems(storage.itemsToRun);
        startSimulation(undefined, baseOnComplete);
    }
}

function onUpdate() {
    const reducedTime = storage.baseClearingTime - getClearingTime();
    const increaseDust = getDustPs() - storage.baseDustPs;

    let totalCost = 0;
    if (storage.increment > 0) {
        totalCost = getPrice(
            storage.currentItem as keyof IABTypes["items"],
            storage.increment
        );
    }
    const timeUntilProfit = totalCost / increaseDust;
    uiUpdateGradeItem(storage.currentItem, reducedTime, timeUntilProfit);
}

function onComplete() {
    const item = storage.itemsToRun.shift();
    if (item !== undefined) {
        storage.currentItem = item;
        simulateNextItem();
    }
}

function simulateNextItem() {
    modifiedAutoBattle();
    if (storage.currentItem === "Ring") {
        incrementRing(storage.increment);
        startSimulation(onUpdate, onComplete);
        incrementRing(-storage.increment);
    } else {
        incrementItem(
            storage.currentItem as keyof IABTypes["items"],
            storage.increment
        );
        startSimulation(onUpdate, onComplete);
    }
}

function baseOnComplete() {
    storage.baseDustPs = getDustPs();
    storage.baseClearingTime = getClearingTime();
    storage.currentItem = storage.itemsToRun.shift() as string;
    simulateNextItem();
}
