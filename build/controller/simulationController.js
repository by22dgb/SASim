import { autoBattle } from "../data/object.js";
import { getOneTimersSA, getRing } from "./bonusesController.js";
import { gameController } from "./gameController.js";
import { getItems } from "./itemsController.js";
const controllerConfig = gameController.getDefaultConfig();
function startSimulation() {
    if (gameController.isRunning()) {
        return;
    }
    controllerConfig.onSimInterrupt = null;
    controllerConfig.onSimInterrupt = null;
    controllerConfig.onUpdate = wrapup;
    gameController.configure(controllerConfig);
    runSimulation();
}
function stopSimulation() {
    gameController.stop();
}
function wrapup() { }
function runSimulation() { }
function calcBuildCost() {
    let dustCost = 0;
    let shardCost = 0;
    // Price for items.
    const items = getItems();
    Object.entries(items).forEach(([_, value]) => {
        if (value.equipped) {
            const startPrice = "startPrice" in value ? value.startPrice : 5;
            const priceMod = "priceMod" in value ? value.priceMod : 3;
            const cost = (startPrice || 5) *
                ((1 - Math.pow(priceMod || 3, value.level - 1)) /
                    (1 - (priceMod || 3)));
            if ("dustType" in value && value.dustType === "shards") {
                shardCost += cost;
            }
            else {
                dustCost += cost;
            }
        }
    });
    // Price for one timers.
    const oneTimers = getOneTimersSA();
    Object.entries(oneTimers).forEach(([key, value]) => {
        const name = key;
        const cost = autoBattle.oneTimerPrice(name);
        if ("useShards" in value && value.useShards) {
            shardCost += cost;
        }
        else {
            dustCost += cost;
        }
    });
    // Price for ring.
    const ring = getRing();
    if (ring.owned) {
        shardCost += Math.ceil(15 * Math.pow(2, ring.level) - 30);
    }
    // Price for extra limbs.
    // TODO: once builder from ymh is added
}
