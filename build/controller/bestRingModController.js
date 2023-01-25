/*
Functions for calculating best ring mods.
*/
import { getRing } from "./bonusesController.js";
export function findBestMod() {
    const ring = getRing();
    console.log(ring);
}
