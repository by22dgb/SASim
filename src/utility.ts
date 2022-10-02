import { prettify } from "./data/object.js";

export function pick(obj: any, ...keys: any) {
    return Object.fromEntries(
        keys.filter((key: any) => key in obj).map((key: any) => [key, obj[key]])
    );
}

export function capitaliseFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function updateButton(
    button: HTMLButtonElement | string,
    setUnselected?: boolean
) {
    let classList;
    if (typeof button === "string") {
        classList = getHTMLElement("#" + button + "_Button").classList;
    } else {
        classList = button.classList;
    }
    if (setUnselected || classList.contains("checkedButton")) {
        classList.remove("checkedButton");
        classList.add("uncheckedButton");
    } else {
        classList.remove("uncheckedButton");
        classList.add("checkedButton");
    }
}

export function updateInput(
    name: HTMLInputElement | string,
    level: number | string
) {
    let input;
    if (typeof name === "string") {
        name = "#" + name + "_Input";
        input = getHTMLElement(name) as HTMLInputElement;
    } else {
        input = name;
    }
    input.value = level.toString();
}

export function clickingAnimation(button: HTMLElement) {
    button.addEventListener("click", () => {
        button.classList.remove("uncheckedButton");
        button.classList.add("checkedButton");
        setTimeout(() => {
            button.classList.remove("checkedButton");
            button.classList.add("uncheckedButton");
        }, 269);
    });
}

export function getHTMLElement(name: string): HTMLElement {
    const element = document.querySelector(name);
    if (!element) {
        throw new Error("Element not found: " + name);
    }
    return element as HTMLElement;
}

export function addHover(hoverDiv: HTMLElement, displayDiv: HTMLDivElement) {
    hoverDiv.addEventListener("mouseover", () => {
        showHover(displayDiv);
    });
    hoverDiv.addEventListener("mouseout", () => {
        hideHover(displayDiv);
    });
}

function showHover(element: HTMLElement) {
    element.style.display = "block";
}

function hideHover(element: HTMLElement) {
    element.style.display = "none";
}

export function prettyNumber(number: number) {
    return prettify(number);
}

export function convertSecondsToTime(seconds: number) {
    if (!isFinite(seconds)) return "♾️";

    // Seconds, minutes, hours, days and years
    const s = +(seconds % 60).toFixed(2);
    const m = Math.floor(seconds / 60) % 60;
    const h = Math.floor(seconds / 3600) % 24;
    const d = Math.floor(seconds / 86400) % 365;
    const y = Math.floor(seconds / 31536000);
    // Return the time
    return (
        (y > 0 ? y + "y " : "") +
        (d > 0 ? d + "d " : "") +
        (h > 0 ? h + "h " : "") +
        (m > 0 ? m + "m " : "") +
        (s > 0 ? s + "s " : "")
    );
}

export function convertMilliSecondsToTime(ms: number) {
    return convertSecondsToTime(ms / 1000);
}
