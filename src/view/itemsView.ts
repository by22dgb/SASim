/*
Items view panel, used for equipping and leveling items.
This file should not interact directly with the data layer.
*/

import {
    equipItem,
    getItemsInOrder,
    levelItem,
} from "../controller/itemsController.js";
import {
    hideHover,
    showHover,
    updateButton,
} from "../utility.js";
import { ISaveString } from "../data/buildString.js";

export function itemsView() {
    setupItemBtns();
}

function setupItemBtns() {
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
        const itemName = itemNames[i];
        const div = document.createElement("div");
        div.classList.add("equipInpDiv");
        table.insertRow(-1).insertCell(-1).appendChild(div);

        const button = document.createElement("button");
        const name = itemName.replaceAll("_", " ");
        button.innerHTML = name;
        button.id = itemName + "_Button";
        button.classList.add(
            "uncheckedButton",
            "text",
            "itemsButton",
            "generalButton"
        );
        div.appendChild(button);
        addChangeForItemButton(button, itemName);

        const input = document.createElement("input");
        input.type = "number";
        input.value = "1";
        input.classList.add("equipInput", "generalInput", "text");
        input.id = itemName + "_Input";
        addChangeForLevel(input, itemName);
        div.appendChild(input);

        const descriptionDiv = document.createElement("div");
        descriptionDiv.classList.add("divToDisplayHover");
        const item = items[itemName as keyof ISaveString["items"]];
        let description =
            item.description();
        if ("zone" in item) {
            description += " Contract at zone " + item.zone.toString() + ".";
        }
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
    updateButton(item, setUnselected);
}
