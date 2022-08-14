import { autoBattle } from "../data/object.js";
import { equipMutation, equipOneTimer, equipRing, equipScruffy, getOneTimersSA, } from "./bonusesController.js";
import { equipItem, getItems, levelItem } from "./itemsController.js";
import { u2Mutations } from "../data/mutations.js";
import { updatePresetButton } from "../view/simulationView.js";
export function buildItems(items) {
    Object.entries(items).forEach(([key, value]) => {
        const name = key;
        if (value.equipped) {
            equipItem(name, value.level);
        }
        else {
            levelItem(name, value.level);
        }
    });
}
export function buildSave(saveString) {
    buildItems(saveString.items);
    // Set ring
    equipRing(saveString.ring.mods, saveString.ring.level);
    // Set oneTimers
    const oneTimers = getOneTimersSA(saveString);
    Object.entries(oneTimers).forEach(([key, _]) => {
        const name = key;
        equipOneTimer(name);
    });
    // Set mutations
    Object.entries(saveString.mutations).forEach(([key, _]) => {
        const name = key;
        if (name in u2Mutations.tree) {
            equipMutation(name);
        }
    });
    // Set S21
    equipScruffy(saveString.scruffy);
}
export function setPresets(presets) {
    const names = presets.names;
    autoBattle.presets.names = names;
    names.forEach((name, index) => {
        index += 1;
        const presetName = Object.keys(autoBattle.presets)[index];
        const preset = presets[presetName];
        if (preset.length > 0) {
            updatePresetButton(name, index);
            autoBattle.presets[presetName] = preset;
        }
    });
}
export function loadPreset(buttonName) {
    const r = /\d/;
    const id = buttonName.match(r);
    const presetName = ("p" + id);
    const preset = autoBattle.presets[presetName];
    const newItems = [];
    preset.forEach((row) => {
        if (typeof row === "object") {
            switch (row[0]) {
                case "level":
                    break;
                case "ring":
                    break;
            }
        }
        else {
            // Item
            newItems.push(row);
        }
    });
    const items = Object.entries(getItems());
    items.forEach(([key, item]) => {
        if (newItems.includes(key) != item.equipped) {
            const name = key;
            equipItem(name);
        }
    });
}
