import { getHTMLElement } from "../utility.js";
import { setupGrades } from "./bestGradesView.js";

export function extrasView() {
    setWidth();
    setupGrades();
}

export const currentExtraResults = {
    functions: [] as Function[],
    clear() {
        if (this.functions.length > 0) {
            for (const func of this.functions) {
                func();
            }
        }
        this.functions = [];
    },
    add(func: Function) {
        this.functions.push(func);
    },
};

function setWidth() {
    const simPanel = getHTMLElement("#simulationPanel");
    const calcPanel = getHTMLElement("#calcPanel");
    const calcResPanel = getHTMLElement("#calcResultsPanel");
    calcPanel.style.width = simPanel.offsetWidth + "px";
    calcResPanel.style.width = simPanel.offsetWidth + "px";
}
