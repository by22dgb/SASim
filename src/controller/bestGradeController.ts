/*
Functions for calculating the best upgrade and best downgrade items.
*/

import { Currency, IABTypes } from "../data/buildTypes.js";
import { prettyNumber } from "../utility.js";
import { uiSetGradesItems, uiUpdateGradeItem } from "../view/bestGradesView.js";
import {
    modifiedAutoBattle,
    startSimulation,
    getDustPs,
    getClearingTime,
} from "./autoBattleController.js";
import { getRing, getRingPrice, incrementRing } from "./bonusesController.js";
import { getCurrency, getPrice } from "./general.js";
import { getItemsInOrder, incrementItem } from "./itemsController.js";

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
    reducedTime: 0,
    timeUntilProfit: 0,
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
    updateItemsToRun();
    if (storage.itemsToRun.length > 0) {
        modifiedAutoBattle();
        uiSetGradesItems(storage.itemsToRun);
        startSimulation(undefined, baseOnComplete);
    }
}

function onUpdate() {
    const reducedTime = storage.baseClearingTime - getClearingTime();
    storage.reducedTime = reducedTime;

    let totalCost = 0;
    let currency = Currency.dust;
    if (storage.increment > 0) {
        if (storage.currentItem === "Ring") {
            totalCost = getRingPrice();
            currency = Currency.shards;
        } else {
            totalCost = getPrice(
                storage.currentItem as keyof IABTypes["items"],
                storage.increment
            );
            currency = getCurrency(
                storage.currentItem as keyof IABTypes["items"]
            );
        }
    }

    const increaseDust =
        (getDustPs() - storage.baseDustPs) /
        (currency === Currency.shards ? 1e9 : 1);
    const timeUntilProfit = totalCost / increaseDust;
    storage.timeUntilProfit = timeUntilProfit;

    uiUpdateGradeItem(
        storage.currentItem,
        storage.reducedTime,
        storage.timeUntilProfit
    );
}

function onComplete() {
    storage.reducedTime = 0;
    storage.timeUntilProfit = 0;
    if (storage.currentItem === "Ring") incrementRing(-storage.increment);
    else
        incrementItem(
            storage.currentItem as keyof IABTypes["items"],
            -storage.increment
        );
    const item = storage.itemsToRun.shift();
    if (item !== undefined) {
        storage.currentItem = item;
        simulateNextItem();
    }
}

function simulateNextItem() {
    if (storage.currentItem === "Ring") {
        incrementRing(storage.increment);
    } else {
        incrementItem(
            storage.currentItem as keyof IABTypes["items"],
            storage.increment
        );
    }
    modifiedAutoBattle();
    startSimulation(onUpdate, onComplete);
}

function baseOnComplete() {
    storage.baseDustPs = getDustPs();
    storage.baseClearingTime = getClearingTime();
    storage.currentItem = storage.itemsToRun.shift() as string;
    simulateNextItem();
}
