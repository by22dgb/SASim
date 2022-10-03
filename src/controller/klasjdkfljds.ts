/* eslint-disable */

import { builderData } from "../data/buildData.js";
import { IABTypes } from "../data/buildString.js";
import { autoBattle } from "../data/object.js";
import { getOneTimersSA, getRing } from "./bonusesController.js";

// Merge with Build Controller probably

function addItemCost(itemID: keyof IABTypes["items"]) {
    const shards = "shards" in autoBattle.items[itemID];
    const cost = builderData.costItems.get(itemID)!;
    builderData.costDust += cost * +!shards;
    builderData.costShard += cost * +shards;
}

function addOtherCosts() {
    const oneTimers = getOneTimersSA();
    Object.entries(oneTimers).forEach(([key, value]) => {
        if (value.owned) {
            const shards = "shards" in value;
            const cost = builderData.costOneTimers.get(
                key as keyof IABTypes["oneTimers"]
            )!;
            builderData.costDust += cost * +!shards;
            builderData.costShard += cost * +shards;
        }
    });
    const ring = getRing();
    builderData.costShard += builderData.costRing;
    // Idk what to do about ring contract
}
