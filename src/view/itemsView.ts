/*
Items view panel, used for equipping and leveling items.
This file should not interact directly with the data layer.
*/

import {
    equipItem,
    getItemsInOrder,
    levelItem,
} from "../controller/itemsController.js";
import { addHover, getHTMLElement, updateButton } from "../utility.js";
import { IABTypes } from "../data/buildString.js";

export function itemsView() {
    setupItemBtns();
}

function setupItemBtns() {
    const itemsPanel = getHTMLElement("#itemsPanel");
    for (let i = 0; i < 2; i++) {
        const partDiv = partItemsDiv(2, i);
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
        const itemName = itemNames[i] as keyof IABTypes["items"];
        const div = document.createElement("div");
        div.classList.add("equipInpDiv");
        table.insertRow(-1).insertCell(-1).appendChild(div);

        const button = document.createElement("button");
        const name = itemName.replaceAll("_", " ");
        button.innerHTML = name;
        button.id = itemName + "_Button";
        button.classList.add(
            "uncheckedButton",
            "small-text",
            "itemsButton",
            "generalButton"
        );
        div.appendChild(button);
        addChangeForItemButton(button, itemName);

        const input = document.createElement("input");
        input.type = "number";
        input.min = "1";
        input.value = "1";
        input.classList.add("equipInput", "generalInput", "small-text");
        input.id = itemName + "_Input";
        addChangeForLevel(input, itemName);
        div.appendChild(input);

        const descriptionDiv = document.createElement("div");
        descriptionDiv.classList.add("hover", "itemHover");
        const item = items[itemName as keyof IABTypes["items"]];
        let description = item.description();
        if ("zone" in item) {
            description += " Contract at zone " + item.zone.toString() + ".";
        }
        descriptionDiv.innerHTML = description;
        div.appendChild(descriptionDiv);
        addHover(button, descriptionDiv);
    }

    // Styling
    if (ind !== 0) {
        table.style.marginLeft = "0em";
    }
    return table;
}

function addChangeForItemButton(
    button: HTMLButtonElement,
    item: keyof IABTypes["items"]
) {
    button.addEventListener("click", () => {
        equipItem(item);
    });
}

function addChangeForLevel(
    input: HTMLInputElement,
    item: keyof IABTypes["items"]
) {
    input.addEventListener("input", () => {
        const value = parseInt(input.value);
        levelItem(item, value, true);
    });
}

export function updateItem(
    item: keyof IABTypes["items"],
    setUnselected?: boolean
) {
    updateButton(item, setUnselected);
}
