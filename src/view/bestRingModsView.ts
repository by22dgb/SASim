/*
Handles UI display of best ring mods calculations.
*/

import { simIsRunning } from "../controller/autoBattleController.js";
import { findBestMod } from "../controller/bestRingModsController.js";
import { clickingAnimation, getHTMLElement } from "../utility.js";
export function setupBestMods() {
    setupModsBtn();
}

function setupModsBtn() {
    /*
    const upgradeBtn = getHTMLElement("#bestRingModsBtn");
    clickingAnimation(upgradeBtn);
    upgradeBtn.addEventListener("click", () => {
        if (!simIsRunning()) {
            findBestMod();
        }
    });
    */
}
