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
import { setEnemyLevel, setMaxEnemyLevel } from "./levelsController.js";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ringMods = saveString.ring.mods as any as string[];
    equipRingMods(ringMods);
    setRingLevel(saveString.ring.level);

    // Set oneTimers
    const oneTimers = getOneTimersSA(saveString);
    Object.keys(oneTimers).forEach((key) => {
        const name = key as keyof IABTypes["oneTimers"];
        equipOneTimer(name);
    });

    // Set mutations
    Object.keys(saveString.mutations).forEach((key) => {
        const name = key as keyof IABTypes["mutations"];
        if (name in u2Mutations.tree) {
            equipMutation(name);
        }
    });

    // Set S21
    equipScruffy(saveString.scruffy);

    // Set levels
    setEnemyLevel(saveString.currentLevel);
    setMaxEnemyLevel(saveString.maxEnemyLevel);
}

export function setPresets(presets: typeof autoBattle.presets) {
    const names = presets.names;
    autoBattle.presets.names = names;
    names.forEach((name, index) => {
        index += 1;
        const presetName = Object.keys(autoBattle.presets)[
            index
        ] as keyof typeof autoBattle.presets;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const preset = presets[presetName] as any;
        if (preset.length > 0) {
            updatePresetButton(name, index);
            autoBattle.presets[presetName] = preset;
        }
    });
}

export function loadPreset(buttonName: string) {
    const r = /\d/;
    const id = Number(buttonName.match(r));
    const presetName = ("p" + id) as keyof typeof autoBattle.presets;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const preset = autoBattle.presets[presetName] as any[];
    const newItems: string[] = [];

    preset.forEach((row) => {
        if (typeof row === "object") {
            switch (row[0]) {
                case "level":
                    // TODO
                    break;
                case "ring": {
                    const ringMods = row.slice(1);
                    unequipRingMods();
                    equipRingMods(ringMods);
                }
            }
        } else {
            // Item
            newItems.push(row);
        }
    });

    const items = Object.entries(getItems());
    for (const [key, item] of Object.values(items)) {
        if (newItems.includes(key) !== item.equipped) {
            const itemName = key as keyof IABTypes["items"];
            equipItem(itemName);
        }
    }
}
