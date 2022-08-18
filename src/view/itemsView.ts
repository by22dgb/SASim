import {
    equipItem,
    getItemsInOrder,
    levelItem,
} from "../controller/itemsController.js";
import {
    changeValueSafe,
    hideHover,
    showHover,
    updateButton,
} from "../utility.js";
import { ISaveString } from "../data/buildString.js";

export function itemsView() {
    makeItemBtns();
}

function makeItemBtns() {
    let itemsPanel = document.querySelector("#itemsPanel")!;
    for (let i = 0; i < 2; i++) {
        let partDiv = partItemsDiv(2, i);
        itemsPanel.appendChild(partDiv);
    }
}

function partItemsDiv(parts: number, ind: number) {
    const items = getItemsInOrder();
    const itemNames = Object.keys(items);
    const length = itemNames.length;
    const size = Math.round(length / parts);
    const start = size * ind;
    let end = size * (ind + 1);
    end = length < end ? length : end;
    const table = document.createElement("table");
    table.classList.add("partTable");
    for (let i = start; i < end; i++) {
        const item = itemNames[i];
        const div = document.createElement("div");
        div.classList.add("equipInpDiv");
        table.insertRow(-1).insertCell(-1).appendChild(div);

        const button = document.createElement("button");
        const name = item.replaceAll("_", " ");
        button.innerHTML = name;
        button.id = item + "_Button";
        button.classList.add(
            "uncheckedButton",
            "text",
            "itemsButton",
            "generalButton"
        );
        div.appendChild(button);
        addChangeForItemButton(button, item);

        const input = document.createElement("input");
        input.type = "number";
        input.value = "1";
        input.classList.add("equipInput", "generalInput", "text");
        input.id = item + "_Input";
        addChangeForLevel(input, item);
        div.appendChild(input);

        const descriptionDiv = document.createElement("div");
        descriptionDiv.classList.add("divToDisplayHover");
        const description =
            items[item as keyof ISaveString["items"]].description();
        descriptionDiv.innerHTML = description;
        div.appendChild(descriptionDiv);
        addChangeForHover(button, descriptionDiv);
    }
    return table;
}

function addChangeForItemButton(button: HTMLButtonElement, item: any) {
    button.addEventListener("click", () => {
        equipItem(item);
    });
}

function addChangeForLevel(input: HTMLInputElement, item: any) {
    input.addEventListener("change", () => {
        const value = parseInt(input.value);
        levelItem(item, value, true);
    });
}

function addChangeForHover(hoverDiv: HTMLElement, displayDiv: HTMLDivElement) {
    hoverDiv.addEventListener("mouseover", () => {
        showHover(displayDiv);
    });
    hoverDiv.addEventListener("mouseout", () => {
        hideHover(displayDiv);
    });
}

export function updateItem(
    item: keyof ISaveString["items"],
    setUnselected?: boolean
) {
    let beingEquipped: boolean;
    if (setUnselected) {
        beingEquipped = false;
    } else {
        beingEquipped = document
            .querySelector("#" + item + "_Button")!
            .classList.contains("uncheckedButton");
    }
    const span = document.querySelector("#limbsUsed")!;
    const limbsUsed = parseInt(span.innerHTML);
    const newValue = changeValueSafe(limbsUsed, beingEquipped ? 1 : -1);
    span.innerHTML = newValue.toString();
    updateButton(item, setUnselected);
}
