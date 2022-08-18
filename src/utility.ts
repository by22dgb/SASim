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

export function changeValueSafe(value: number, change: number) {
    return value + change > 0 ? value + change : 0;
}

export function getHTMLElement(name: string): HTMLElement {
    const element = document.querySelector(name);
    if (!element) {
        throw new Error("Element not found: " + name);
    }
    return element as HTMLElement;
}

export function showHover(element: HTMLElement) {
    element.style.display = "block";
}

export function hideHover(element: HTMLElement) {
    element.style.display = "none";
}
