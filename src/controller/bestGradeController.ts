/*
Functions for calculating the best upgrade and best downgrade items.
*/

import { Currency, IABTypes } from "../data/buildTypes.js";
import { uiSetGradesItems, uiUpdateGradeItem } from "../view/bestGradesView.js";
import {
    modifiedAutoBattle,
    startSimulation,
    getDustPs,
    getClearingTime,
} from "./autoBattleController.js";
import { getRing, incrementRing } from "./bonusesController.js";
import { getCurrency, getUpgradePrice } from "./general.js";
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

    let upgradeCost = 0;
    let currency = Currency.dust;
    if (storage.increment > 0) {
        if (storage.currentItem === "Ring") {
            upgradeCost = getUpgradePrice(
                storage.currentItem,
                -storage.increment
            );
            currency = Currency.shards;
        } else {
            const item = storage.currentItem as keyof IABTypes["items"];
            upgradeCost = getUpgradePrice(item, -storage.increment);
            currency = getCurrency(item);
        }
    }

    const increaseDust =
        (getDustPs() - storage.baseDustPs) /
        (currency === Currency.shards ? 1e9 : 1);
    const timeUntilProfit = upgradeCost / increaseDust;

    uiUpdateGradeItem(storage.currentItem, reducedTime, timeUntilProfit);
}

function onComplete() {
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
