import { saveData } from "../data/saveData.js";
export function getSaveData() {
    return saveData;
}
export function setSaveData(data) {
    Object.assign(saveData, data);
}
export function getRemainingEnemies() {
    return saveData.remainingEnemies;
}
