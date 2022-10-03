/*
Levels view panel, used for setting levels and displaying relevant information.
This file should not interact directly with the data layer.
*/

import { getItem } from "../controller/itemsController.js";
import {
    checkMaxLevel,
    getActiveEffects,
    setEnemyLevel,
    setMaxEnemyLevel,
} from "../controller/levelsController.js";
import { IEnemy, IHuffy, IShank } from "../data/resistanceData.js";
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
        checkMaxLevel(value);
        updateEffects();
    });
}

export function updateLimbs(increment: -1 | 1) {
    const limbsDiv = getHTMLElement("#limbsUsed");
    limbsDiv.innerHTML = (Number(limbsDiv.innerHTML) + increment).toString();
}

export function updateEffects() {
    const effectsDiv = getHTMLElement("#effectsDiv");
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

export function updateShank(
    shankInfo: IShank,
    huffyShanked: string,
    enemyShanked: string
) {
    const huffyDiv = getHTMLElement("#huffyShank");
    if (shankInfo.shanked) {
        huffyDiv.children[0].innerHTML = capitaliseFirstLetter(huffyShanked);
        huffyDiv.hidden = false;
    } else {
        huffyDiv.hidden = true;
    }

    const enemyDiv = getHTMLElement("#enemyShank");
    if (shankInfo.shanked) {
        enemyDiv.children[0].innerHTML = capitaliseFirstLetter(enemyShanked);
        enemyDiv.hidden = false;
    } else {
        enemyDiv.hidden = true;
    }
}

export function uiUpdateResistances(enemy: IEnemy) {
    const poisonResistSpan = getHTMLElement("#enemyPoisonResist");
    const bleedResistSpan = getHTMLElement("#enemyBleedResist");
    const shockResistSpan = getHTMLElement("#enemyShockResist");
    const poisonResist = enemy.resistPoison;
    let bleedResist: number;
    let shockResist: number;

    if (getItem("Stormbringer").equipped) {
        bleedResist = enemy.resistBleed + enemy.resistShock;
        shockResist = 0;
    } else {
        bleedResist = enemy.resistBleed;
        shockResist = enemy.resistShock;
    }

    poisonResistSpan.innerHTML = poisonResist.toString();
    bleedResistSpan.innerHTML = bleedResist.toString();
    shockResistSpan.innerHTML = shockResist.toString();
}

export function uiUpdateChances(
    huffy: IHuffy,
    enemy: IEnemy,
    shankInfo: IShank
) {
    // Huffy chances
    const hfPoisonChance: number[] = [];
    const hfBleedChance: number[] = [];
    const hfShockChance: number[] = [];

    // Enemy chances
    let enPoisonChance: number[] = [];
    let enBleedChance: number[] = [];
    let enShockChance: number[] = [];

    const hfPoisonChanceSpan = getHTMLElement("#huffyPoisonChance");
    const hfBleedChanceSpan = getHTMLElement("#huffyBleedChance");
    const hfShockChanceSpan = getHTMLElement("#huffyShockChance");

    const enPoisonChanceSpan = getHTMLElement("#enemyPoisonChance");
    const enBleedChanceSpan = getHTMLElement("#enemyBleedChance");
    const enShockChanceSpan = getHTMLElement("#enemyShockChance");

    const shank = getItem("Sacrificial_Shank");

    if (shank.equipped) {
        const resistAllMax =
            huffy.resistAll +
            Math.floor((shankInfo.reductionMax + enemy.shank) / 10) *
                shank.level;
        const resistAllMin =
            huffy.resistAll +
            Math.floor((shankInfo.reductionMin + enemy.shank) / 10) *
                shank.level;

        // Enemy poison chance
        enPoisonChance.push(
            enemy.poison -
                resistAllMin -
                huffy.resistPoison -
                (enemy.shankedEffect === "poison" ? enemy.shank : 0)
        );

        if (resistAllMax !== resistAllMin) {
            enPoisonChance.push(
                enemy.poison -
                    resistAllMax -
                    huffy.resistPoison -
                    (enemy.shankedEffect === "poison" ? enemy.shank : 0)
            );
        }

        // Enemy bleed chance
        enBleedChance.push(
            enemy.bleed -
                resistAllMin -
                huffy.resistBleed -
                (enemy.shankedEffect === "bleed" ? enemy.shank : 0)
        );
        if (resistAllMax !== resistAllMin) {
            enBleedChance.push(
                enemy.bleed -
                    resistAllMax -
                    huffy.resistBleed -
                    (enemy.shankedEffect === "bleed" ? enemy.shank : 0)
            );
        }

        // Enemy shock chance
        enShockChance.push(
            enemy.shock -
                resistAllMin -
                huffy.resistShock -
                (enemy.shankedEffect === "shock" ? enemy.shank : 0)
        );
        if (resistAllMax !== resistAllMin) {
            enShockChance.push(
                enemy.shock -
                    resistAllMax -
                    huffy.resistShock -
                    (enemy.shankedEffect === "shock" ? enemy.shank : 0)
            );
        }

        // Huffy poison chance
        hfPoisonChance.push(shankInfo.poison[0] - enemy.resistPoison);
        if (shankInfo.poison[0] !== shankInfo.poison[1]) {
            hfPoisonChance.push(shankInfo.poison[1] - enemy.resistPoison);
        }

        // Huffy bleed chance
        hfBleedChance.push(shankInfo.bleed[0] - enemy.resistBleed);
        if (shankInfo.bleed[0] !== shankInfo.bleed[1]) {
            hfBleedChance.push(shankInfo.bleed[1] - enemy.resistBleed);
        }

        // Huffy shock chance
        hfShockChance.push(shankInfo.shock[0] - enemy.resistShock);
        if (shankInfo.shock[0] !== shankInfo.shock[1]) {
            hfShockChance.push(shankInfo.shock[1] - enemy.resistShock);
        }
    } else {
        // Enemy poison chance
        enPoisonChance.push(
            enemy.poison - huffy.resistAll - huffy.resistPoison
        );

        // Enemy bleed chance
        enBleedChance.push(enemy.bleed - huffy.resistAll - huffy.resistBleed);

        // Enemy shock chance
        enShockChance.push(enemy.shock - huffy.resistAll - huffy.resistShock);

        // Huffy poison chance
        hfPoisonChance.push(huffy.poisonMin - enemy.resistPoison);
        if (huffy.poisonMin !== huffy.poisonMax) {
            hfPoisonChance.push(huffy.poisonMax - enemy.resistPoison);
        }

        // Huffy bleed chance
        hfBleedChance.push(huffy.bleedMin - enemy.resistBleed);
        if (huffy.bleedMin !== huffy.bleedMax) {
            hfBleedChance.push(huffy.bleedMax - enemy.resistBleed);
        }

        // Huffy shock chance
        hfShockChance.push(huffy.shockMin - enemy.resistShock);
        if (huffy.shockMin !== huffy.shockMax) {
            hfShockChance.push(huffy.shockMax - enemy.resistShock);
        }
    }

    hfPoisonChanceSpan.innerHTML = hfPoisonChance.join("% to ");
    hfBleedChanceSpan.innerHTML = hfBleedChance.join("% to ");
    hfShockChanceSpan.innerHTML = hfShockChance.join("% to ");

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    hfPoisonChanceSpan.parentElement!.hidden = !huffy.canPoison;
    hfBleedChanceSpan.parentElement!.hidden = !huffy.canBleed;
    hfShockChanceSpan.parentElement!.hidden = !huffy.canShock;

    enPoisonChance = enPoisonChance.map((x) => Math.round(x));
    enBleedChance = enBleedChance.map((x) => Math.round(x));
    enShockChance = enShockChance.map((x) => Math.round(x));
    enPoisonChanceSpan.innerHTML = enPoisonChance.join("% to ");
    enBleedChanceSpan.innerHTML = enBleedChance.join("% to ");
    enShockChanceSpan.innerHTML = enShockChance.join("% to ");
    enPoisonChanceSpan.parentElement!.hidden = enemy.poison <= 0;
    enBleedChanceSpan.parentElement!.hidden = enemy.bleed <= 0;
    enShockChanceSpan.parentElement!.hidden = enemy.shock <= 0;
    /* eslint-enable @typescript-eslint/no-non-null-assertion*/
}
