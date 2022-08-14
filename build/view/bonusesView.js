import { getOneTimersSA, getPossibleRingMods, getMutations, equipOneTimer, equipRing, equipMutation, equipScruffy } from "../controller/bonusesController.js";
import { capitaliseFirstLetter } from "../controller/utility.js";
export function bonusesView() {
    makeOneTimerBtns();
    makeRingBtns();
    makeMutationsBtn();
}
function makeOneTimerBtns() {
    const oneTimersPanel = document.querySelector("#oneTimersPanel");
    const oneTimers = getOneTimersSA();
    Object.entries(oneTimers).forEach(([key, _]) => {
        const button = document.createElement("button");
        button.innerHTML = key.replaceAll('_', ' ');
        button.id = key + "_Button";
        button.classList.add("uncheckedButton", "text", "generalButton", "oneTimerButton");
        oneTimersPanel.appendChild(button);
        addChangeForOneTimerButton(button, key);
    });
}
function addChangeForOneTimerButton(button, oneTimer) {
    button.addEventListener("click", () => {
        equipOneTimer(oneTimer);
    });
}
function makeRingBtns() {
    const ringMods = getPossibleRingMods();
    const ringModsDiv = document.querySelector("#ringModsDiv");
    Object.entries(ringMods).forEach(([key, _]) => {
        const modButton = document.createElement("button");
        let name = key.replaceAll('_', ' ');
        name = name.replace("Mult", "");
        name = capitaliseFirstLetter(name);
        modButton.innerHTML = name;
        modButton.id = key + "_Button";
        modButton.classList.add("uncheckedButton", "text", "generalButton");
        ringModsDiv.appendChild(modButton);
        const mod = [key];
        addChangeForRingButton(modButton, mod);
    });
    const ringInput = document.querySelector("#Ring_Input");
    addChangeForRingInput(ringInput);
}
function addChangeForRingButton(button, mod) {
    button.addEventListener("click", () => {
        equipRing(mod);
    });
}
function addChangeForRingInput(input) {
    input.addEventListener("change", () => {
        const value = parseInt(input.value);
        equipRing(undefined, value, true);
    });
}
function makeMutationsBtn() {
    const mutationsPanel = document.querySelector("#mutationsPanel");
    const mutations = getMutations();
    Object.entries(mutations).forEach(([key, value]) => {
        const button = document.createElement("button");
        button.innerHTML = value.dn.replaceAll('_', ' ');
        button.id = key + "_Button";
        button.classList.add("uncheckedButton", "text", "generalButton", "mutationsButton");
        mutationsPanel.appendChild(button);
        const mutation = key;
        addChangeForMutationButton(button, mutation);
    });
    // Scruffy 21 button, move if needed.
    const button = document.createElement("button");
    button.innerHTML = "S21";
    button.id = "S21_Button";
    button.classList.add("uncheckedButton", "text", "generalButton", "mutationsButton");
    mutationsPanel.appendChild(button);
    addChangeForScruffyButton(button);
}
function addChangeForMutationButton(button, mutation) {
    button.addEventListener("click", () => {
        equipMutation(mutation);
    });
}
function addChangeForScruffyButton(button) {
    button.addEventListener("click", () => {
        equipScruffy();
    });
}
