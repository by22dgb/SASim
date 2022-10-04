import { simIsRunning } from "../controller/autoBattleController.js";
import { findBestGrade } from "../controller/bestGrade.js";
import { getCurrency } from "../controller/itemsController.js";
import { Currency, IABTypes } from "../data/buildTypes.js";
import {
    clearHTMLChilds,
    clickingAnimation,
    convertMilliSecondsToTime,
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
            const value = +getHTMLElement("#bestGradesInput").innerHTML;
            findBestGrade(value);
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

        if (item === "Ring") {
            gradesItemsShards.appendChild(nameSpan);
            gradesClearingShards.appendChild(clearingSpan);
            gradesProfitShards.appendChild(profitSpan);
        } else {
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
}

export function uiUpdateGradeItem(
    item: string,
    reducedTime: number,
    timeUntilProfit: number
) {
    console.log(reducedTime);
    getHTMLElement(`#gradesClearing${item}`).innerHTML =
        convertMilliSecondsToTime(reducedTime);

    getHTMLElement(`#gradesProfit${item}`).innerHTML =
        convertMilliSecondsToTime(timeUntilProfit);
}

function clearGradesResults() {
    bestGradesPanel.style.display = "none";
    clearHTMLChilds(gradesItemsDust);
    clearHTMLChilds(gradesItemsShards);
    clearHTMLChilds(gradesClearingDust);
    clearHTMLChilds(gradesClearingShards);
    clearHTMLChilds(gradesProfitDust);
    clearHTMLChilds(gradesProfitShards);
}
