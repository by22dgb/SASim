import { ISaveString } from "../data/buildString.js";
import { autoBattle } from "../data/object.js";
import {
    equipMutation,
    equipOneTimer,
    equipRing,
    equipScruffy,
    getOneTimersSA,
} from "./bonusesController.js";
import { equipItem, getItems, levelItem } from "./itemsController.js";
import { u2Mutations } from "../data/mutations.js";
import { updatePresetButton } from "../view/simulationView.js";

export function buildItems(items: ISaveString["items"]) {
    Object.entries(items).forEach(([key, value]) => {
        const name = key as keyof ISaveString["items"];
        if (value.equipped) {
            equipItem(name, value.level);
        } else {
            levelItem(name, value.level);
        }
    });
}

export function buildSave(saveString: ISaveString) {
    buildItems(saveString.items);

    // Set ring
    equipRing(saveString.ring.mods, saveString.ring.level);

    // Set oneTimers
    const oneTimers = getOneTimersSA(saveString);
    Object.entries(oneTimers).forEach(([key, _]) => {
        const name = key as keyof ISaveString["oneTimers"];
        equipOneTimer(name);
    });

    // Set mutations
    Object.entries(saveString.mutations).forEach(([key, _]) => {
        const name = key as keyof ISaveString["mutations"];
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
    const id = buttonName.match(r)! as any as number;
    const presetName = ("p" + id) as keyof typeof autoBattle.presets;
    const preset = autoBattle.presets[presetName];
    const newItems: string[] = [];

    preset.forEach((row) => {
        if (typeof row === "object") {
            switch (row[0]) {
                case "level":
                    break;
                case "ring":
                    break;
            }
        } else {
            // Item
            newItems.push(row);
        }
    });

    const items = Object.entries(getItems());
    items.forEach(([key, item]) => {
        if (newItems.includes(key) != item.equipped) {
            const name = key as keyof ISaveString["items"];
            equipItem(name);
        }
    });
}
