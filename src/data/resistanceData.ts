import { autoBattle } from "./object";

const enemy = {
    bleed: 0,
    poison: 0,
    resistBleed: 0,
    resistPoison: 0,
    resistShock: 0,
    shank: 0,
    shanked: 0,
    shock: 0,
};

const huffy = {
    bleedMax: 0,
    bleedMin: 0,
    canBleed: false,
    canPoison: false,
    canShock: false,
    poisonMax: 0,
    poisonMin: 0,
    resistAll: 0,
    resistBleed: 0,
    resistPoison: 0,
    resistShock: 0,
    shockMax: 0,
    shockMin: 0,
    warningAegis: false,
};

const modifierFunctions = {
    Rusty_Dagger() {
        const chance = autoBattle.items.Rusty_Dagger.bleedChance();
        huffy.bleedMin += chance;
        huffy.bleedMax += chance * 2;
        huffy.canBleed = true;
    },
    Fists_of_Goo() {
        huffy.canPoison = true;
        huffy.poisonMin += 25;
        huffy.poisonMax += 50;
    },
    Battery_Stick() {
        huffy.canShock = true;
        huffy.shockMin += 35;
        huffy.shockMax += 70;
    },
    Chemistry_Set() {
        const chance = autoBattle.items.Chemistry_Set.poisonChance();
        huffy.poisonMin += chance;
        huffy.poisonMax += chance + 50;
    },
    Comfy_Boots() {
        huffy.resistAll += autoBattle.items.Comfy_Boots.resistance();
    },
    Shock_and_Awl() {
        const chance = autoBattle.items.Shock_and_Awl.shockChance();
        huffy.canShock = true;
        huffy.shockMin += chance;
        huffy.shockMax += chance;
    },
    Tame_Snimp() {
        const chance = autoBattle.items.Tame_Snimp.poisonChance();
        huffy.canPoison = true;
        huffy.poisonMin += chance;
        huffy.poisonMax += chance;
    },
    Wired_Wristguards() {
        const chance = autoBattle.items.Wired_Wristguards.shockChance();
        huffy.shockMin += chance;
        huffy.shockMax += chance;
        huffy.resistAll += 50;
    },
    Sword_and_Board() {
        huffy.resistAll += autoBattle.items.Sword_and_Board.resists();
    },
    Bilious_Boots() {
        huffy.resistAll += autoBattle.items.Bilious_Boots.resists();
    },
    Bloodstained_Gloves() {
        const chance = autoBattle.items.Bloodstained_Gloves.bleedChance();
        huffy.bleedMin += chance;
        huffy.bleedMax += chance;
    },
    Eelimp_in_a_Bottle() {
        const chance = autoBattle.items.Eelimp_in_a_Bottle.shockChance();
        huffy.shockMin += chance;
        huffy.shockMax += chance;
        huffy.resistShock += autoBattle.items.Eelimp_in_a_Bottle.shockResist();
    },
    Big_Cleaver() {
        huffy.bleedMin += 25;
        huffy.bleedMax += 100;
        huffy.canBleed = true;
    },
    Metal_Suit() {
        huffy.resistBleed += autoBattle.items.Metal_Suit.resist();
    },
    Nozzled_Goggles() {
        huffy.resistPoison += autoBattle.items.Nozzled_Goggles.resist();
    },
    Very_Large_Slime() {
        const chance = autoBattle.items.Very_Large_Slime.poisonChance();
        huffy.canPoison = true;
        huffy.poisonMin += chance;
        huffy.poisonMax += chance;
    },
    Fearsome_Piercer() {
        const chance = autoBattle.items.Fearsome_Piercer.bleedChance();
        huffy.bleedMin += chance;
        huffy.bleedMax += chance;
    },
    Bag_of_Nails() {
        huffy.canBleed = true;
    },
    Bad_Medkit() {
        const chance = autoBattle.items.Bad_Medkit.bleedChance();
        huffy.bleedMin += chance;
        huffy.bleedMax += chance;
    },
    Putrid_Pouch() {
        const chance = autoBattle.items.Putrid_Pouch.poisonChance();
        huffy.poisonMin += chance;
        huffy.poisonMax += chance;
    },
    Aegis() {
        const chance = autoBattle.items.Aegis.shockChance();
        if (
            autoBattle.items.Basket_of_Souls.equipped ||
            autoBattle.items.Nullifium_Armor.equipped
        ) {
            huffy.shockMin += chance;
            huffy.warningAegis = true;
        }
        huffy.shockMax += chance;
    },
};
