/*
Levels view panel, used for setting levels and displaying relevant information.
This file should not interact directly with the data layer.
*/

import {
    getActiveEffects,
    setEnemyLevel,
    setMaxEnemyLevel,
} from "../controller/levelsController.js";
import { capitaliseFirstLetter, getHTMLElement } from "../utility.js";

export function levelsView() {
    setWidth();
    setupMaxLevelInput();
    setupEnemyLevelInput();
    updateEffects();
}

function setWidth() {
    const bonusesPanel = getHTMLElement("#bonusesPanel");
    const levelsPanel = getHTMLElement("#infoPanel");
    levelsPanel.style.width = bonusesPanel.offsetWidth + "px";
}

function setupMaxLevelInput() {
    const input = getHTMLElement("#maxEnemyLevel_Input") as HTMLInputElement;
    input.addEventListener("input", () => {
        const value = parseInt(input.value);
        setMaxEnemyLevel(value, true);
    });
}

function setupEnemyLevelInput() {
    const input = getHTMLElement(
        "#currentEnemyLevel_Input"
    ) as HTMLInputElement;
    input.addEventListener("input", () => {
        const value = parseInt(input.value);
        setEnemyLevel(value, true);
        updateEffects();
    });
}

export function updateLimbs(increment: -1 | 1) {
    const limbsDiv = getHTMLElement("#limbsUsed");
    limbsDiv.innerHTML = (Number(limbsDiv.innerHTML) + increment).toString();
}

export function updateEffects() {
    const effectsDiv = document.querySelector("#effectsDiv")!;
    const effects = getActiveEffects();
    let effectsString = "";
    const effectsIter = effects.entries();
    for (let i = 0; i < effects.size; ++i) {
        const [effect, multiplier] = effectsIter.next().value;
        if (multiplier === 1) {
            effectsString += capitaliseFirstLetter(effect);
        } else {
            effectsString += capitaliseFirstLetter(effect) + " x" + multiplier;
        }
        if (i < effects.size - 1) {
            effectsString += ", ";
        }
    }
    effectsDiv.innerHTML = effectsString;
}

export function updateShank(imp: "huffy" | "enemy", shankInfo: boolean[]) {
    const div = getHTMLElement("#" + imp + "Shank");
    for (const [index, shank] of shankInfo.entries()) {
        if (shank) {
            const effects = ["Poison", "Bleed", "Shock"];
            div.children[0].innerHTML = effects[index];
            div.hidden = false;
            break;
        }
    }
}
