import { Build } from "../data/buildTypes.js";
import { LZString } from "./lz-string.js";
import { buildFromSave, buildItems, clearBuilderData, setPresets, } from "./buildController.js";
import { clearItems, getItems } from "./itemsController.js";
import { clearBonuses, setBonuses } from "./bonusesController.js";
import { enemyCount, modifiedAutoBattleWithBuild, } from "./autoBattleController.js";
import { setSaveData } from "./saveController.js";
export function stringPaste(paste) {
    clear();
    let savegame;
    try {
        // Wtf do you think the try catch is for you stupid linter
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        savegame = JSON.parse(LZString.decompressFromBase64(paste));
    }
    catch (error) {
        // Do nothing
    }
    if (savegame) {
        //  Import save
        if (savegame.global) {
            importSave(savegame);
        }
        else {
            alert("https://nsheetz.github.io/perks/");
        }
    }
    else if (paste.includes("\t")) {
        // Import spreadsheet line
        importSpreadsheet(paste);
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function importSave(savegame) {
    modifiedAutoBattleWithBuild();
    const saveString = {};
    const abData = savegame.global.autoBattleData;
    saveString.items = abData.items;
    const ring = {
        mods: abData.rings.mods,
        level: abData.rings.level,
    };
    if (!("The_Ring" in abData.oneTimers)) {
        // Set ring to unowned through 0 if it isn't owned
        ring.level = 0;
    }
    saveString.ring = ring;
    saveString.oneTimers = abData.oneTimers;
    saveString.mutations = savegame.global.u2MutationData;
    saveString.scruffy = savegame.global.fluffyExp2;
    saveString.currentLevel = abData.enemyLevel;
    saveString.maxEnemyLevel = abData.maxEnemyLevel;
    let remainingEnemies = 0;
    if (saveString.currentLevel === saveString.maxEnemyLevel) {
        remainingEnemies = enemyCount(abData.enemyLevel) - abData.enemiesKilled;
    }
    saveString.remainingEnemies = remainingEnemies;
    saveString.dust = abData.dust;
    saveString.shards = abData.shards;
    setSaveData(saveString);
    setBonuses(abData.bonuses);
    buildFromSave();
    const presets = savegame.global.autoBattleData.presets;
    setPresets(presets);
}
function importSpreadsheet(row) {
    modifiedAutoBattleWithBuild();
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
export function clear() {
    clearItems();
    clearBonuses();
    clearBuilderData();
}
