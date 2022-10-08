import { simIsRunning } from "../controller/autoBattleController.js";
import { findBestGrade } from "../controller/bestGradeController.js";
import { getCurrency } from "../controller/general.js";
import { Currency, IABTypes } from "../data/buildTypes.js";
import {
    clearHTMLChilds,
    clickingAnimation,
    convertMilliSecondsToTime,
    convertSecondsToTime,
    getHTMLElement,
} from "../utility.js";
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
            const input = getHTMLElement(
                "#bestGradesInput"
            ) as HTMLInputElement;
            const increment = +input.value;
            findBestGrade(increment);
        }
    });
}

export function uiSetGradesItems(items: string[]) {
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

        const currency = getCurrency(item as keyof IABTypes["items"]);
        if (currency === Currency.dust) {
            gradesItemsDust.appendChild(nameSpan);
            gradesClearingDust.appendChild(clearingSpan);
            gradesProfitDust.appendChild(profitSpan);
        } else if (currency === Currency.shards) {
            gradesItemsShards.appendChild(nameSpan);
            gradesClearingShards.appendChild(clearingSpan);
            gradesProfitShards.appendChild(profitSpan);
        }
    }
}

export function uiUpdateGradeItem(
    item: string,
    reducedTime: number,
    timeUntilProfit: number
) {
    const clearingSpan = getHTMLElement(`#gradesClearing${item}`);
    let reducedAverage = reducedTime;
    if (reducedAverage < 0) {
        reducedAverage = Math.abs(reducedAverage);
        clearingSpan.innerHTML = `-${convertMilliSecondsToTime(
            reducedAverage
        )}`;
    } else clearingSpan.innerHTML = convertMilliSecondsToTime(reducedAverage);

    const profitSpan = getHTMLElement(`#gradesProfit${item}`);
    const profitAverage = timeUntilProfit;
    if (profitAverage < 0) {
        profitSpan.innerHTML = convertMilliSecondsToTime(Infinity);
    } else profitSpan.innerHTML = convertSecondsToTime(profitAverage);
}

function clearGradesResults() {
    bestGradesPanel.style.display = "none";
    clearHTMLChilds(bestGradesPanel);
}
