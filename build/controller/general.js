import { Currency } from "../data/buildTypes.js";
import { autoBattle } from "../data/object.js";
import { getBonusPrice, getOneTimerPrice, getRingPrice, } from "./bonusesController.js";
import { getItem, getItemPrice } from "./itemsController.js";
export function getPrice(name, level) {
    if (name === "The_Ring" || name === "Ring") {
        return getRingPrice(level);
    }
    const itemKeys = Object.keys(autoBattle.items);
    if (itemKeys.includes(name)) {
        return getItemPrice(name, level);
    }
    const oneTimerKeys = Object.keys(autoBattle.oneTimers);
    if (oneTimerKeys.includes(name)) {
        return getOneTimerPrice(name);
    }
    if (name === "Extra_Limbs" ||
        name === "Radon" ||
        name === "Stats" ||
        name === "Scaffolding") {
        return getBonusPrice(name);
    }
    throw new Error("Object not implemented: " + name);
}
export function getCurrency(name) {
    if (name === "The_Ring" || name === "Ring") {
        return Currency.shards;
    }
    const itemKeys = Object.keys(autoBattle.items);
    if (itemKeys.includes(name)) {
        const item = getItem(name);
        if ("dustType" in item && item.dustType === "shards") {
            return Currency.shards;
        }
        else {
            return Currency.dust;
        }
    }
    const oneTimerKeys = Object.keys(autoBattle.oneTimers);
    if (oneTimerKeys.includes(name)) {
        return Currency.dust;
    }
    if (name === "Extra_Limbs" || name === "Radon" || name === "Stats") {
        return Currency.dust;
    }
    if (name === "Scaffolding") {
        return Currency.shards;
    }
    throw new Error("Object not implemented: " + name);
}
