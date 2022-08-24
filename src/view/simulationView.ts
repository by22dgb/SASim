/*
Simulation view panel, used for importing saves and starting the simulation.
This file should not interact directly with the data layer.
*/

import { loadPreset } from "../controller/buildController.js";
import { stringPaste } from "../controller/importController.js";
import { clickingAnimation, getHTMLElement, updateButton } from "../utility.js";
import { getItems } from "../controller/itemsController.js";
import {
    startSimulation,
    stopSimulation,
} from "../controller/autoBattleController.js";
import { readEquips } from "../controller/resistanceController.js";

export function simulationViews() {
    setupImportBtns();
    setupPresetBtns();
    setupRunBtns();
}

function setupImportBtns() {
    const importInp = getHTMLElement("#saveImportInp") as HTMLInputElement;
    addImportAction(importInp);

    const resetBtn = getHTMLElement("#saveResetBtn") as HTMLButtonElement;
    clickingAnimation(resetBtn);

    resetBtn.addEventListener("click", () => {
        console.log(getItems());
    });
}

function addImportAction(field: HTMLInputElement) {
    field.addEventListener("paste", (event) => {
        let paste = event.clipboardData?.getData("text");
        if (paste) {
            stringPaste(paste);
        }
        field.blur();
    });
}

function setupPresetBtns() {
    for (let i = 1; i < 4; i++) {
        const presetButton = getHTMLElement(
            "#Preset" + CSS.escape(i.toString()) + "_Button"
        ) as HTMLButtonElement;
        clickingAnimation(presetButton);
        addPresetAction(presetButton);
    }
}

function addPresetAction(button: HTMLButtonElement) {
    button.addEventListener("click", () => {
        loadPreset(button.id);
    });
}

export function updatePresetButton(name: string, index: number) {
    const button = getHTMLElement(
        "#Preset" + CSS.escape(index.toString()) + "_Button"
    ) as HTMLButtonElement;
    button.innerText = name;
    button.hidden = false;
}

function setupRunBtns() {
    const startBtn = getHTMLElement("#start_Button") as HTMLButtonElement;
    clickingAnimation(startBtn);
    setupStartBtn(startBtn);

    const stopBtn = getHTMLElement("#stop_Button") as HTMLButtonElement;
    clickingAnimation(stopBtn);
    setupStopBtn(stopBtn);

    const autoRunBtn = getHTMLElement("#autoRun_Button") as HTMLButtonElement;
    addChangeForAutoRun(autoRunBtn);
}

function addChangeForAutoRun(button: HTMLButtonElement) {
    button.addEventListener("click", () => {
        updateButton(button);
        // TODO: Add auto run functionality
        readEquips();
    });
}

function setupStartBtn(button: HTMLButtonElement) {
    button.addEventListener("click", () => {
        startSimulation();
    });
}

function setupStopBtn(button: HTMLButtonElement) {
    button.addEventListener("click", () => {
        stopSimulation();
    });
}
