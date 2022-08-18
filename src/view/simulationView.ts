import { loadPreset } from "../controller/buildController.js";
import { stringPaste } from "../controller/importController.js";
import { clickingAnimation, getHTMLElement, updateButton } from "../utility.js";
import { autoBattle } from "../data/object.js";

export function simulationViews() {
    makeImportBtns();
    makePresetBtns();
    makeRunBtns();
}

function makeImportBtns() {
    const importInp = getHTMLElement("#saveImportInp") as HTMLInputElement;
    addImportAction(importInp);

    const resetBtn = getHTMLElement("#saveResetBtn") as HTMLButtonElement;
    clickingAnimation(resetBtn);

    resetBtn.addEventListener("click", () => {
        console.log(autoBattle.items);
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

function makePresetBtns() {
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

function makeRunBtns() {
    const runBtn = getHTMLElement("#start_Button") as HTMLButtonElement;
    clickingAnimation(runBtn);

    const stopBtn = getHTMLElement("#stop_Button") as HTMLButtonElement;
    clickingAnimation(stopBtn);

    const autoRunBtn = getHTMLElement("#autoRun_Button") as HTMLButtonElement;
    addChangeForAutoRun(autoRunBtn);
}

function addChangeForAutoRun(button: HTMLButtonElement) {
    button.addEventListener("click", () => {
        updateButton(button);
        // TODO: Add auto run functionality
    });
}
