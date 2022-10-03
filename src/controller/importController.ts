import { Build, IRing } from "../data/buildString.js";
import { LZString } from "./lz-string.js";
import { buildItems, buildSave, setPresets } from "./buildController.js";
import { clearItems, getItems } from "./itemsController.js";
import { IABTypes } from "../data/buildString.js";
import { clearBonuses } from "./bonusesController.js";
import { modifiedAutoBattle } from "./autoBattleController.js";

export function stringPaste(paste: string) {
    clear();
    let savegame;
    try {
        // Wtf do you think the try catch is for you stupid linter
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        savegame = JSON.parse(LZString.decompressFromBase64(paste)!);
    } catch (error) {
        // Do nothing
    }
    if (savegame) {
        //  Import save
        if (savegame.global) {
            importSave(savegame);
        } else {
            alert("https://nsheetz.github.io/perks/");
        }
    } else if (paste.includes("\t")) {
        // Import spreadsheet line
        importSpreadsheet(paste);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function importSave(savegame: any) {
    modifiedAutoBattle();

    const saveString = {} as IABTypes;
    const abData = savegame.global.autoBattleData;

    saveString.items = abData.items;
    const ring: IRing = {
        mods: abData.rings.mods,
        level: abData.rings.level,
    };
    saveString.ring = ring;
    saveString.oneTimers = abData.oneTimers;
    saveString.mutations = savegame.global.u2MutationData;
    saveString.scruffy = savegame.global.fluffyExp2;
    saveString.currentLevel = abData.enemyLevel;
    saveString.maxEnemyLevel = abData.maxEnemyLevel;

    buildSave(saveString);

    const presets = savegame.global.autoBattleData.presets;
    setPresets(presets);
}

function importSpreadsheet(row: string) {
    modifiedAutoBattle();

    const items = JSON.parse(JSON.stringify(getItems()));

    const itemLevels = row.split("\t");
    itemLevels.forEach((itemLevel, index) => {
        if (itemLevel !== "") {
            const itemName = Object.keys(Build.items)[index];
            items[itemName].equipped = true;
            items[itemName].level = parseInt(itemLevel);
        }
    });
    buildItems(items);
}

function clear() {
    clearItems();
    clearBonuses();
}
