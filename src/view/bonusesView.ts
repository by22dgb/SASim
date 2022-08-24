/*
Bonuses view panel, used for setting and leveling bonuses.
This file should not interact directly with the data layer.
*/

import {
    getOneTimersSA,
    getPossibleRingMods,
    getMutations,
    equipOneTimer,
    equipRing,
    equipMutation,
    equipScruffy,
} from "../controller/bonusesController.js";
import { capitaliseFirstLetter } from "../utility.js";
import { IRing, ISaveString } from "../data/buildString.js";

export function bonusesView() {
    setupOneTimerBtns();
    setupRingBtns();
    setupMutationsBtn();
}

function setupOneTimerBtns() {
    const oneTimersPanel = document.querySelector("#oneTimersPanel")!;
    const oneTimers = getOneTimersSA();
    for (const [key, _] of Object.entries(oneTimers)) {
        const button = document.createElement("button");
        button.innerHTML = key.replaceAll("_", " ");
        button.id = key + "_Button";
        button.classList.add(
            "uncheckedButton",
            "text",
            "generalButton",
            "oneTimerButton"
        );
        oneTimersPanel.appendChild(button);
        addChangeForOneTimerButton(button, key);
    }
}

function addChangeForOneTimerButton(button: HTMLButtonElement, oneTimer: any) {
    button.addEventListener("click", () => {
        equipOneTimer(oneTimer);
    });
}

function setupRingBtns() {
    const ringMods = getPossibleRingMods();
    const ringModsDiv = document.querySelector("#ringModsDiv")!;

    Object.entries(ringMods).forEach(([key, _]) => {
        const modButton = document.createElement("button");
        let name = key.replaceAll("_", " ");
        name = name.replace("Mult", "");
        name = capitaliseFirstLetter(name);
        modButton.innerHTML = name;
        modButton.id = key + "_Button";
        modButton.classList.add("uncheckedButton", "text", "generalButton");
        ringModsDiv.appendChild(modButton);
        const mod = [key] as any;
        addChangeForRingButton(modButton, mod);
    });

    const ringInput = document.querySelector(
        "#Ring_Input"
    )! as HTMLInputElement;
    addChangeForRingInput(ringInput);
}

function addChangeForRingButton(button: HTMLButtonElement, mod: IRing["mods"]) {
    button.addEventListener("click", () => {
        equipRing(mod);
    });
}

function addChangeForRingInput(input: HTMLInputElement) {
    input.addEventListener("change", () => {
        const value = parseInt(input.value);
        equipRing(undefined, value, true);
    });
}
function setupMutationsBtn() {
    const mutationsPanel = document.querySelector("#mutationsPanel")!;
    const mutations = getMutations();

    Object.entries(mutations).forEach(([key, value]) => {
        const button = document.createElement("button");
        button.innerHTML = value.dn.replaceAll("_", " ");
        button.id = key + "_Button";
        button.classList.add(
            "uncheckedButton",
            "text",
            "generalButton",
            "mutationsButton"
        );
        mutationsPanel.appendChild(button);
        const mutation = key as keyof ISaveString["mutations"];
        addChangeForMutationButton(button, mutation);
    });

    // Scruffy 21 button, move if needed.
    const button = document.createElement("button");
    button.innerHTML = "S21";
    button.id = "S21_Button";
    button.classList.add(
        "uncheckedButton",
        "text",
        "generalButton",
        "mutationsButton"
    );
    mutationsPanel.appendChild(button);
    addChangeForScruffyButton(button);
}

function addChangeForMutationButton(
    button: HTMLButtonElement,
    mutation: keyof ISaveString["mutations"]
) {
    button.addEventListener("click", () => {
        equipMutation(mutation);
    });
}

function addChangeForScruffyButton(button: HTMLButtonElement) {
    button.addEventListener("click", () => {
        equipScruffy();
    });
}
