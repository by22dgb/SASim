export function pick(obj, ...keys) {
    return Object.fromEntries(keys.filter((key) => key in obj).map((key) => [key, obj[key]]));
}
export function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export function updateButton(button, setUnselected) {
    let classList;
    if (typeof button === "string") {
        classList = getHTMLElement("#" + button + "_Button").classList;
    }
    else {
        classList = button.classList;
    }
    if (setUnselected || classList.contains("checkedButton")) {
        classList.remove("checkedButton");
        classList.add("uncheckedButton");
    }
    else {
        classList.remove("uncheckedButton");
        classList.add("checkedButton");
    }
}
export function updateInput(name, level) {
    let input;
    if (typeof name === "string") {
        input = getHTMLElement(name);
    }
    else {
        input = name;
    }
    input.value = level.toString();
}
export function clickingAnimation(button) {
    button.addEventListener("click", () => {
        button.classList.remove("uncheckedButton");
        button.classList.add("checkedButton");
        setTimeout(() => {
            button.classList.remove("checkedButton");
            button.classList.add("uncheckedButton");
        }, 269);
    });
}
export function changeValueSafe(value, change) {
    return value + change > 0 ? value + change : 0;
}
export function getHTMLElement(name) {
    const element = document.querySelector(name);
    if (!element) {
        throw new Error("Element not found: " + name);
    }
    return element;
}
export function showHover(element) {
    element.style.display = "block";
}
export function hideHover(element) {
    element.style.display = "none";
}
