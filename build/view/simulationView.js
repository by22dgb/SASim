import { loadPreset } from "../controller/buildController.js";
import { stringPaste } from "../controller/importController.js";
import { clickingAnimation, getHTMLElement, updateButton, } from "../controller/utility.js";
import { autoBattle } from "../data/object.js";
export function simulationViews() {
    makeImportBtns();
    makePresetBtns();
    makeRunBtns();
}
function makeImportBtns() {
    const importInp = getHTMLElement("#saveImportInp");
    addImportAction(importInp);
    const resetBtn = getHTMLElement("#saveResetBtn");
    clickingAnimation(resetBtn);
    resetBtn.addEventListener("click", () => {
        console.log(autoBattle.items);
    });
}
function addImportAction(field) {
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
        const presetButton = getHTMLElement("#Preset" + CSS.escape(i.toString()) + "_Button");
        clickingAnimation(presetButton);
        addPresetAction(presetButton);
    }
}
function addPresetAction(button) {
    button.addEventListener("click", () => {
        loadPreset(button.id);
    });
}
export function updatePresetButton(name, index) {
    const button = getHTMLElement("#Preset" + CSS.escape(index.toString()) + "_Button");
    button.innerText = name;
    button.hidden = false;
}
function makeRunBtns() {
    const runBtn = getHTMLElement("#start_Button");
    clickingAnimation(runBtn);
    const stopBtn = getHTMLElement("#stop_Button");
    clickingAnimation(stopBtn);
    const autoRunBtn = getHTMLElement("#autoRun_Button");
    addChangeForAutoRun(autoRunBtn);
}
function addChangeForAutoRun(button) {
    button.addEventListener("click", () => {
        updateButton(button);
        // TODO: Add auto run functionality
    });
}
