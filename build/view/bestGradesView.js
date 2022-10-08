import { simIsRunning } from "../controller/autoBattleController.js";
import { findBestGrade } from "../controller/bestGradeController.js";
import { getCurrency } from "../controller/itemsController.js";
import { Currency } from "../data/buildTypes.js";
import { clearHTMLChilds, clickingAnimation, convertMilliSecondsToTime, convertSecondsToTime, getHTMLElement, } from "../utility.js";
import { currentExtraResults } from "./extrasView.js";
const bestGradesPanel = getHTMLElement("#bestGradesResults");
const gradesItemsDust = getHTMLElement("#gradesItemsDust");
const gradesItemsShards = getHTMLElement("#gradesItemsShards");
const gradesClearingDust = getHTMLElement("#gradesClearingDust");
const gradesClearingShards = getHTMLElement("#gradesClearingShards");
const gradesProfitDust = getHTMLElement("#gradesProfitDust");
const gradesProfitShards = getHTMLElement("#gradesProfitShards");
export function setupGrades() {
    setupGradeBtns();
}
function setupGradeBtns() {
    const upgradeBtn = getHTMLElement("#bestGradesBtn");
    clickingAnimation(upgradeBtn);
    upgradeBtn.addEventListener("click", () => {
        if (!simIsRunning()) {
            const input = getHTMLElement("#bestGradesInput");
            const increment = +input.value;
            findBestGrade(increment);
        }
    });
}
export function uiSetGradesItems(items) {
    currentExtraResults.clear();
    currentExtraResults.add(clearGradesResults);
    // Make the UI visible
    bestGradesPanel.style.display = "flex";
    // Add all items to the UI
    for (const item of items) {
        const nameSpan = document.createElement("span");
        nameSpan.innerHTML = item.replaceAll("_", " ");
        const clearingSpan = document.createElement("span");
        clearingSpan.innerHTML = "-";
        clearingSpan.id = `gradesClearing${item}`;
        const profitSpan = document.createElement("span");
        profitSpan.innerHTML = "-";
        profitSpan.id = `gradesProfit${item}`;
        if (item === "Ring") {
            gradesItemsShards.appendChild(nameSpan);
            gradesClearingShards.appendChild(clearingSpan);
            gradesProfitShards.appendChild(profitSpan);
        }
        else {
            const currency = getCurrency(item);
            if (currency === Currency.dust) {
                gradesItemsDust.appendChild(nameSpan);
                gradesClearingDust.appendChild(clearingSpan);
                gradesProfitDust.appendChild(profitSpan);
            }
            else if (currency === Currency.shards) {
                gradesItemsShards.appendChild(nameSpan);
                gradesClearingShards.appendChild(clearingSpan);
                gradesProfitShards.appendChild(profitSpan);
            }
        }
    }
}
export function uiUpdateGradeItem(item, reducedTime, timeUntilProfit) {
    const clearingSpan = getHTMLElement(`#gradesClearing${item}`);
    let reducedAverage = reducedTime;
    if (reducedAverage < 0) {
        reducedAverage = Math.abs(reducedAverage);
        clearingSpan.innerHTML = `-${convertMilliSecondsToTime(reducedAverage)}`;
    }
    else
        clearingSpan.innerHTML = convertMilliSecondsToTime(reducedAverage);
    const profitSpan = getHTMLElement(`#gradesProfit${item}`);
    const profitAverage = timeUntilProfit;
    if (profitAverage < 0) {
        profitSpan.innerHTML = convertMilliSecondsToTime(Infinity);
    }
    else
        profitSpan.innerHTML = convertSecondsToTime(profitAverage);
}
function clearGradesResults() {
    bestGradesPanel.style.display = "none";
    clearHTMLChilds(bestGradesPanel);
}
