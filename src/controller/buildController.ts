import { IABTypes } from "../data/buildString.js";
import { autoBattle } from "../data/object.js";
import {
    equipMutation,
    equipOneTimer,
    equipRingMods,
    equipScruffy,
    getOneTimersSA,
    setRingLevel,
    unequipRingMods,
} from "./bonusesController.js";
import { equipItem, getItems, levelItem } from "./itemsController.js";
import { u2Mutations } from "../data/mutations.js";
import { updatePresetButton } from "../view/simulationView.js";

export function buildItems(items: IABTypes["items"]) {
    for (const [key, value] of Object.entries(items)) {
        const name = key as keyof IABTypes["items"];
        if (value.equipped) {
            equipItem(name, value.level);
        } else {
            levelItem(name, value.level);
        }
    }
}

export function buildSave(saveString: IABTypes) {
    buildItems(saveString.items);

    // Set ring
    const ringMods = saveString.ring.mods as any as string[];
    equipRingMods(ringMods);
    setRingLevel(saveString.ring.level);

    // Set oneTimers
    const oneTimers = getOneTimersSA(saveString);
    Object.entries(oneTimers).forEach(([key, _]) => {
        const name = key as keyof IABTypes["oneTimers"];
        equipOneTimer(name);
    });

    // Set mutations
    Object.entries(saveString.mutations).forEach(([key, _]) => {
        const name = key as keyof IABTypes["mutations"];
        if (name in u2Mutations.tree) {
            equipMutation(name);
        }
    });

    // Set S21
    equipScruffy(saveString.scruffy);
}

export function setPresets(presets: typeof autoBattle.presets) {
    const names = presets.names;
    autoBattle.presets.names = names;
    names.forEach((name, index) => {
        index += 1;
        const presetName = Object.keys(autoBattle.presets)[
            index
        ] as keyof typeof autoBattle.presets;
        const preset = presets[presetName] as any;
        if (preset.length > 0) {
            updatePresetButton(name, index);
            autoBattle.presets[presetName] = preset;
        }
    });
}

export function loadPreset(buttonName: string) {
    const r = /\d/;
    const id = Number(buttonName.match(r)!);
    const presetName = ("p" + id) as keyof typeof autoBattle.presets;
    const preset = autoBattle.presets[presetName] as any[];
    const newItems: string[] = [];

    preset.forEach((row) => {
        if (typeof row === "object") {
            switch (row[0]) {
                case "level":
                    // TODO
                    break;
                case "ring":
                    const ringMods = row.slice(1);
                    equipRingMods(ringMods);
            }
        } else {
            // Item
            newItems.push(row);
        }
    });

    const items = Object.entries(getItems());
    for (const [_, [key, item]] of Object.entries(items)) {
        if (newItems.includes(key) !== item.equipped) {
            const itemName = key as keyof IABTypes["items"];
            equipItem(itemName);
        }
    }
}
