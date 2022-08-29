import { autoBattle } from "./object";
import { u2Mutations } from "./mutations.js";

export interface IABTypes {
    items: typeof autoBattle.items;
    ring: IRing;
    oneTimers: typeof autoBattle.oneTimers;
    mutations: typeof u2Mutations.tree;
    scruffy: number;
    currentLevel: number;
    maxEnemyLevel: number;
}

export interface IRing {
    mods: typeof autoBattle.ringStats;
    level: number;
}

export const Build = {
    items: {
        Menacing_Mask: "AA",
        Sword: "AB",
        Armor: "AC",
        Rusty_Dagger: "AD",
        Fists_of_Goo: "AE",
        Battery_Stick: "AF",
        Pants: "AG",
        Raincoat: "AH",
        Putrid_Pouch: "AI",
        Chemistry_Set: "AJ",
        Bad_Medkit: "AK",
        Comfy_Boots: "AL",
        Labcoat: "AM",
        Lifegiving_Gem: "AN",
        Mood_Bracelet: "AO",
        Hungering_Mold: "AP",
        Recycler: "AQ",
        Shining_Armor: "AR",
        Shock_and_Awl: "AS",
        Spiked_Gloves: "AT",
        Tame_Snimp: "AU",
        Lich_Wraps: "AV",
        Wired_Wristguards: "AW",
        Aegis: "AX",
        Sword_and_Board: "AY",
        Bilious_Boots: "AZ",
        Bloodstained_Gloves: "BA",
        Unlucky_Coin: "BB",
        Eelimp_in_a_Bottle: "BC",
        Big_Cleaver: "BD",
        The_Globulator: "BE",
        Metal_Suit: "BF",
        Nozzled_Goggles: "BG",
        Sundering_Scythe: "BH",
        Sacrificial_Shank: "BI",
        Plague_Bringer: "BJ",
        Very_Large_Slime: "BK",
        Monkimp_Paw: "BL",
        Grounded_Crown: "BM",
        Fearsome_Piercer: "BN",
        Bag_of_Nails: "BO",
        Blessed_Protector: "BP",
        The_Doomspring: "BQ",
        Snimp__Fanged_Blade: "BR",
        Doppelganger_Signet: "BS",
        Wrath_Crafted_Hatchet: "BT",
        Basket_of_Souls: "BU",
        Goo_Golem: "BV",
        Omni_Enhancer: "BW",
        Stormbringer: "BX",
        Box_of_Spores: "BY",
        Nullifium_Armor: "BZ",
        Handful_of_Mold: "CA",
        Haunted_Harpoon: "CB",
    },

    ringMods: {
        attack: "A",
        health: "B",
        defense: "C",
        lifesteal: "D",
        dustMult: "E",
    },

    oneTimers: {
        Master_of_Arms: "A",
        Dusty_Tome: "B",
        Whirlwind_of_Arms: "C",
    },

    mutations: {
        Dust: "A",
        Dust2: "B",
    },
};
