export let ABItems = {
    //Starting items
    Menacing_Mask: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        description: function () {
            return ("-" +
                prettify((1 - this.trimpAttackSpeed()) * 100) +
                "% Huffy Attack Time, +" +
                prettify((1 - this.enemyAttackSpeed()) * -100) +
                "% Enemy Attack Time.");
        },
        upgrade: "-2% Huffy Attack Time, +2% Enemy Attack Time (compounding)",
        trimpAttackSpeed: function () {
            return Math.pow(0.98, this.level);
        },
        enemyAttackSpeed: function () {
            return 1.05 * Math.pow(1.02, this.level - 1);
        },
        doStuff: function () {
            autoBattle.trimp.attackSpeed *= this.trimpAttackSpeed();
            autoBattle.enemy.attackSpeed *= this.enemyAttackSpeed();
        },
        priceMod: 5,
    },
    Sword: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        description: function () {
            return "+" + this.effect() + " attack damage.";
        },
        upgrade: "+1 attack damage",
        effect: function () {
            return this.level;
        },
        doStuff: function () {
            autoBattle.trimp.attack += this.effect();
        },
        priceMod: 2.5,
    },
    Armor: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        description: function () {
            return "+" + prettify(this.effect()) + " base health.";
        },
        upgrade: "+20 base health",
        effect: function () {
            return 20 * this.level;
        },
        doStuff: function () {
            autoBattle.trimp.maxHealth += this.effect();
        },
        priceMod: 5,
    },
    Rusty_Dagger: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        description: function () {
            return ("Can create a Bleed on the Enemy for 10 seconds. +" +
                prettify(this.bleedMod() * 100) +
                "% Bleed Damage" +
                (this.level >= 5 ? ", +" + prettify(this.attack()) + " Attack" : "") +
                ". +" +
                prettify(this.bleedChance()) +
                "% Bleed Chance, doubled if the Enemy is Shocked or Poisoned.");
        },
        upgrade: "+10 Attack and +20% Bleed Damage per 5 levels. +5% Bleed Damage and +3% Bleed Chance",
        attack: function () {
            return Math.floor(this.level / 5) * 10;
        },
        bleedChance: function () {
            return 17 + 3 * this.level;
        },
        bleedMod: function () {
            var val = 0.1 + 0.05 * this.level;
            val += Math.floor(this.level / 5) * 0.2;
            return val;
        },
        doStuff: function () {
            autoBattle.trimp.attack += this.attack();
            autoBattle.trimp.bleedMod += this.bleedMod();
            if (autoBattle.trimp.bleedTime < 10000)
                autoBattle.trimp.bleedTime = 10000;
            autoBattle.trimp.bleedChance +=
                autoBattle.enemy.poison.time > 0 || autoBattle.enemy.shock.time > 0
                    ? this.bleedChance() * 2
                    : this.bleedChance();
        },
        startPrice: 25,
        priceMod: 4,
    },
    Fists_of_Goo: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        description: function () {
            return ("Can create a Poison on the Enemy for 10 seconds. +" +
                prettify(this.effect()) +
                " Poison Damage. +25% Poison Chance, doubled if the enemy is bleeding or shocked.");
        },
        upgrade: "+1 poison damage",
        effect: function () {
            return this.level;
        },
        doStuff: function () {
            autoBattle.trimp.poisonMod += this.effect();
            autoBattle.trimp.poisonChance +=
                autoBattle.enemy.shock.time > 0 || autoBattle.enemy.bleed.time > 0
                    ? 50
                    : 25;
            if (autoBattle.trimp.poisonTime < 10000)
                autoBattle.trimp.poisonTime = 10000;
        },
        priceMod: 6,
        startPrice: 50,
    },
    Battery_Stick: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        description: function () {
            return ("Can create a Shock on the Enemy for 10 seconds. +" +
                prettify(this.shockMod() * 100) +
                "% Shock Damage. +35% Shock Chance, doubled if the enemy is bleeding or poisoned.");
        },
        upgrade: "+10% Shock Damage",
        shockMod: function () {
            return 0.15 + 0.1 * this.level;
        },
        doStuff: function () {
            autoBattle.trimp.shockChance +=
                autoBattle.enemy.bleed.time > 0 || autoBattle.enemy.poison.time > 0
                    ? 70
                    : 35;
            autoBattle.trimp.shockMod += this.shockMod();
            autoBattle.trimp.shockTime = 10000;
        },
        startPrice: 25,
        priceMod: 4,
    },
    Pants: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        description: function () {
            return "+" + prettify(this.effect()) + " Defense.";
        },
        upgrade: "+1 Defense",
        effect: function () {
            return this.level;
        },
        doStuff: function () {
            autoBattle.trimp.defense += this.effect();
        },
    },
    //unlockables
    //raincoat, 75
    //pouch 78
    Chemistry_Set: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 81,
        description: function () {
            var stacks = this.poisonStack();
            return ("+50% Poison Chance if the Enemy is not already Poisoned. +" +
                this.defenseEffect() +
                " Defense if the Enemy is Poisoned. +" +
                prettify(this.poisonChance()) +
                "% Poison Chance. Poisons you inflict can stack " +
                stacks +
                " more time" +
                needAnS(stacks) +
                ".");
        },
        upgrade: "+1 Max Poison Stack per 4 levels. +1 Defense, +4% standard Poison Chance",
        defenseEffect: function () {
            return this.level;
        },
        poisonChance: function () {
            return 6 + this.level * 4;
        },
        poisonStack: function () {
            var levels = Math.floor(this.level / 4);
            return 1 + levels;
        },
        doStuff: function () {
            if (autoBattle.enemy.poison.time > 0)
                autoBattle.trimp.defense += this.defenseEffect();
            else
                autoBattle.trimp.poisonChance += 50;
            autoBattle.trimp.poisonChance += this.poisonChance();
            autoBattle.trimp.poisonStack += this.poisonStack();
        },
        priceMod: 4,
        startPrice: 200,
    },
    //bad medkit - 84
    Comfy_Boots: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 87,
        description: function () {
            return ("+" +
                prettify(this.defense()) +
                " Defense. +" +
                prettify(this.resistance()) +
                "% to all Resistances.");
        },
        upgrade: "+2 Defense, +5% Resist",
        defense: function () {
            return 2 + this.level * 2;
        },
        resistance: function () {
            return this.level * 5;
        },
        doStuff: function () {
            autoBattle.trimp.defense += this.defense();
            var res = this.resistance();
            autoBattle.trimp.bleedResist += res;
            autoBattle.trimp.poisonResist += res;
            autoBattle.trimp.shockResist += res;
        },
        startPrice: 430,
    },
    //Labcoat 90
    Lifegiving_Gem: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 93,
        description: function () {
            return ("Increases Dust gained from Enemies by " +
                prettify(this.effect() * 100) +
                "% PLUS your Lifesteal amount when the Enemy dies.");
        },
        upgrade: "+10% Dust Gained",
        effect: function () {
            return 0.2 + 0.1 * this.level;
        },
        dustIncrease: function () {
            return (this.effect() +
                Math.max(0, autoBattle.trimp.lifesteal - autoBattle.enemy.lifestealResist));
        },
        startPrice: 650,
        priceMod: 4,
    },
    Mood_Bracelet: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 95,
        description: function () {
            return ("-" +
                prettify((1 - this.effect()) * 100) +
                "% Attack Time and +" +
                prettify(this.defense()) +
                " Defense if the Enemy is not Bleeding.");
        },
        upgrade: "-3% Attack Time (compounding), +4 Defense",
        effect: function () {
            return 0.8765 * Math.pow(0.97, this.level);
        },
        defense: function () {
            return 6 + 4 * this.level;
        },
        doStuff: function () {
            if (autoBattle.enemy.bleed.time <= 0) {
                autoBattle.trimp.attackSpeed *= this.effect();
                autoBattle.trimp.defense += this.defense();
            }
        },
        priceMod: 4,
        startPrice: 1100,
    },
    Hungering_Mold: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 98,
        description: function () {
            return ("Heal for " +
                prettify(this.healAmt()) +
                " per stack of Poison whenever one of your Poisons deals damage. Your Poisons tick " +
                prettify((1 - this.tickMult()) * 100) +
                "% faster.");
        },
        upgrade: "+0.5 Heal on Poison Tick, +1% Poison Tick Speed",
        healAmt: function () {
            return 0.5 + 0.5 * this.level;
        },
        tickMult: function () {
            return 0.909 * Math.pow(0.99, this.level);
        },
        doStuff: function () {
            autoBattle.trimp.poisonTick *= this.tickMult();
            autoBattle.trimp.poisonHeal += this.healAmt();
        },
        priceMod: 5,
        startPrice: 2000,
    },
    Recycler: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 100,
        description: function () {
            return ("+" +
                prettify(this.effect() * 100) +
                "% Lifesteal. Huffy's Lifesteal heals twice as much off of Bleed damage.");
        },
        upgrade: "+5% Lifesteal",
        effect: function () {
            return 0.2 + 0.05 * this.level;
        },
        doStuff: function () {
            autoBattle.trimp.lifesteal += this.effect();
        },
        startPrice: 2800,
        priceMod: 5,
    },
    Shining_Armor: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 103,
        description: function () {
            return ("+" +
                prettify(this.defense()) +
                " Defense. +" +
                prettify(this.health()) +
                " Health.");
        },
        upgrade: "+6 defense, +100 health",
        defense: function () {
            return 14 + 6 * this.level;
        },
        health: function () {
            return 200 + this.level * 100;
        },
        doStuff: function () {
            autoBattle.trimp.defense += this.defense();
            autoBattle.trimp.maxHealth += this.health();
        },
        priceMod: 5,
        startPrice: 4000,
    },
    Shock_and_Awl: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 105,
        description: function () {
            return ("Can create a Shock on an enemy for 20 seconds. +" +
                prettify(this.attack()) +
                " Attack, +" +
                prettify(this.shockChance()) +
                "% Shock Chance, +" +
                prettify(this.shockMod() * 100) +
                "% Shock Damage. -25% Attack Time if the Enemy is not Shocked, +25% Lifesteal if the Enemy is Shocked.");
        },
        upgrade: "+4 Attack, +10% Shock Chance, +10% Shock Damage",
        attack: function () {
            return 6 + 4 * this.level;
        },
        shockChance: function () {
            return 20 + 10 * this.level;
        },
        shockMod: function () {
            return 0.4 + 0.1 * this.level;
        },
        doStuff: function () {
            if (autoBattle.trimp.shockTime < 20000)
                autoBattle.trimp.shockTime = 20000;
            autoBattle.trimp.shockMod += this.shockMod();
            autoBattle.trimp.shockChance += this.shockChance();
            autoBattle.trimp.attack += this.attack();
            if (autoBattle.enemy.shock.time <= 0)
                autoBattle.trimp.attackSpeed *= 0.75;
            else
                autoBattle.trimp.lifesteal += 0.25;
        },
        priceMod: 5,
        startPrice: 5750,
    },
    //spiked gloves - 108
    Tame_Snimp: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 110,
        description: function () {
            return ("Can create a Poison on the Enemy for 10 seconds. +" +
                prettify(this.poisonChance()) +
                "% Poison Chance, +" +
                prettify(this.poisonMod()) +
                " Poison Damage. Enemy Attack is reduced by 15% while the Enemy is Poisoned.");
        },
        upgrade: "+10% Poison Chance, +2 Poison Damage",
        poisonChance: function () {
            return 30 + 10 * this.level;
        },
        poisonMod: function () {
            return 5 + 2 * this.level;
        },
        doStuff: function () {
            if (autoBattle.enemy.poison.time > 0)
                autoBattle.enemy.attack *= 0.85;
            if (autoBattle.trimp.poisonTime < 10000)
                autoBattle.trimp.poisonTime = 10000;
            autoBattle.trimp.poisonChance += this.poisonChance();
            autoBattle.trimp.poisonMod += this.poisonMod();
        },
        priceMod: 5.5,
        startPrice: 15000,
    },
    Lich_Wraps: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 113,
        description: function () {
            return ("When Poisoned, Bleeding, or Shocked, gain +" +
                prettify(this.attack()) +
                " Attack, -15% Attack Time, +" +
                prettify(this.lifesteal() * 100) +
                "% Lifesteal, and take " +
                prettify((1 - this.damageTakenMult()) * 100) +
                "% less damage from all sources.");
        },
        upgrade: "+6 Attack, +6% Lifesteal, -3% damage taken (compounding, never reaching 75%)",
        damageTakenMult: function () {
            return (0.825 * Math.pow(0.93, this.level - 1)) / 1.5 + 0.25;
        },
        attack: function () {
            return 9 + 6 * this.level;
        },
        lifesteal: function () {
            return 0.09 + 0.06 * this.level;
        },
        doStuff: function () {
            if (autoBattle.trimp.bleed.time > 0 ||
                autoBattle.trimp.shock.time > 0 ||
                autoBattle.trimp.poison.time > 0) {
                autoBattle.trimp.damageTakenMult *= this.damageTakenMult();
                autoBattle.trimp.attack += this.attack();
                autoBattle.trimp.lifesteal += this.lifesteal();
                autoBattle.trimp.attackSpeed *= 0.85;
            }
        },
        priceMod: 4,
        startPrice: 25000,
    },
    Wired_Wristguards: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 115,
        description: function () {
            return ("+" +
                prettify(this.defense()) +
                " Defense, +" +
                prettify(this.shockChance()) +
                "% Shock Chance, +" +
                prettify(this.shockMod() * 100) +
                "% Shock Damage, +50% to all Resistances. If the Enemy is Shocked, increase its Attack Time by " +
                prettify((this.enemySpeed() - 1) * 100) +
                "%.");
        },
        upgrade: "+3 Defense, +15% Shock Chance, +15% Shock Damage, +2% Enemy Attack Time",
        defense: function () {
            return 7 + 3 * this.level;
        },
        shockChance: function () {
            return 25 + 15 * this.level;
        },
        shockMod: function () {
            return 0.25 + 0.15 * this.level;
        },
        enemySpeed: function () {
            return 1.18 + 0.02 * this.level;
        },
        doStuff: function () {
            autoBattle.trimp.defense += this.defense();
            autoBattle.trimp.shockChance += this.shockChance();
            autoBattle.trimp.shockMod += this.shockMod();
            autoBattle.trimp.shockResist += 50;
            autoBattle.trimp.poisonResist += 50;
            autoBattle.trimp.bleedResist += 50;
            if (autoBattle.enemy.shock.time > 0) {
                autoBattle.enemy.attackSpeed *= this.enemySpeed();
            }
        },
        startPrice: 44000,
        priceMod: 4.5,
    },
    Sword_and_Board: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 120,
        description: function () {
            return ("+" +
                prettify(this.attack()) +
                " Attack, +" +
                prettify(this.defense()) +
                " Defense, +" +
                prettify(this.health()) +
                " Health, +" +
                prettify(this.resists()) +
                "% to all Resistances.");
        },
        upgrade: "+5 Attack, +50 Health, +4 Defense, +10% Resists",
        attack: function () {
            return 10 + 5 * this.level;
        },
        defense: function () {
            return 6 + 4 * this.level;
        },
        health: function () {
            return 350 + 50 * this.level;
        },
        resists: function () {
            return 10 + 10 * this.level;
        },
        doStuff: function () {
            autoBattle.trimp.attack += this.attack();
            autoBattle.trimp.defense += this.defense();
            autoBattle.trimp.maxHealth += this.health();
            var resists = this.resists();
            autoBattle.trimp.shockResist += resists;
            autoBattle.trimp.poisonResist += resists;
            autoBattle.trimp.bleedResist += resists;
        },
        priceMod: 5,
        startPrice: 90000,
    },
    Bilious_Boots: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 122,
        description: function () {
            return ("+" +
                prettify(this.poisonMod()) +
                " Poison Damage, +1 Max Poison Stack, +" +
                prettify(this.health()) +
                " Health, +" +
                prettify(this.resists()) +
                "% to all Resistances.");
        },
        upgrade: "+3 Poison Damage, +50 Health, +10% Resists",
        poisonMod: function () {
            return 7 + 3 * this.level;
        },
        health: function () {
            return 150 + 50 * this.level;
        },
        resists: function () {
            return 10 + 10 * this.level;
        },
        doStuff: function () {
            var resists = this.resists();
            autoBattle.trimp.shockResist += resists;
            autoBattle.trimp.poisonResist += resists;
            autoBattle.trimp.bleedResist += resists;
            autoBattle.trimp.poisonMod += this.poisonMod();
            autoBattle.trimp.maxHealth += this.health();
            autoBattle.trimp.poisonStack++;
        },
        priceMod: 5,
        startPrice: 100000,
    },
    Bloodstained_Gloves: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 123,
        description: function () {
            return ("+" +
                prettify(this.bleedChance()) +
                "% to Bleed Chance, +" +
                prettify(this.attack()) +
                " Attack, -25% Enemy Attack Time, -25% Enemy Attack Damage. Fills up " +
                prettify(this.barFill() * 100) +
                "% of your Attack Speed bar whenever you cause or receive a Bleed.");
        },
        upgrade: "+5% Bleed Chance, +2 Attack, +5% bar filled on Bleed",
        attack: function () {
            return 6 + this.level * 2;
        },
        onBleed: function () {
            autoBattle.trimp.lastAttack +=
                autoBattle.trimp.attackSpeed * this.barFill();
        },
        bleedChance: function () {
            return 25 + 5 * this.level;
        },
        barFill: function () {
            return 0.2 + 0.05 * this.level;
        },
        doStuff: function () {
            autoBattle.trimp.bleedChance += this.bleedChance();
            autoBattle.enemy.attackSpeed *= 0.75;
            autoBattle.enemy.attack *= 0.75;
            autoBattle.trimp.attack += this.attack();
        },
        startPrice: 160000,
    },
    Unlucky_Coin: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 125,
        description: function () {
            return ("+" +
                prettify(this.attack()) +
                " Attack. +" +
                prettify(this.lifesteal() * 100) +
                "% Lifesteal if the Enemy is not Poisoned or Bleeding.");
        },
        upgrade: "+4 Attack, +10% Lifesteal",
        attack: function () {
            return 11 + this.level * 4;
        },
        lifesteal: function () {
            return 0.2 + this.level * 0.1;
        },
        doStuff: function () {
            autoBattle.trimp.attack += this.attack();
            if (autoBattle.enemy.bleed.time <= 0 &&
                autoBattle.enemy.poison.time <= 0) {
                autoBattle.trimp.lifesteal += this.lifesteal();
            }
        },
        priceMod: 5,
        startPrice: 400000,
    },
    Eelimp_in_a_Bottle: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 130,
        description: function () {
            return ("+" +
                prettify(this.shockChance()) +
                "% Shock Chance, +" +
                prettify(this.shockMod() * 100) +
                "% Shock Damage, +" +
                prettify(this.shockResist()) +
                "% Shock Resist. -" +
                prettify((1 - this.attackSpeed()) * 100) +
                "% Attack Time if the Enemy is Shocked. When you Shock an Enemy, they lose all progress towards their attack. +" +
                prettify(this.attack()) +
                " Attack for each time you've Shocked this Enemy (up to 10 times).");
        },
        upgrade: "+5% Shock Chance, +5% Shock Damage, -5% Attack Time, +5% Shock Resist, +1 Attack per Shock",
        attackSpeed: function () {
            return 0.9 * Math.pow(0.95, this.level);
        },
        shockChance: function () {
            return 35 + 5 * this.level;
        },
        shockMod: function () {
            return 0.65 + 0.1 * this.level;
        },
        shockResist: function () {
            return 10 + 5 * this.level;
        },
        attack: function () {
            return 2 + this.level;
        },
        doStuff: function () {
            autoBattle.trimp.shockMod += this.shockMod();
            autoBattle.trimp.shockChance += this.shockChance();
            if (autoBattle.enemy.shock.time >= 0)
                autoBattle.trimp.attackSpeed *= this.attackSpeed();
            autoBattle.trimp.attack +=
                Math.min(10, autoBattle.enemy.shock.count) * this.attack();
            autoBattle.trimp.shockResist += this.shockResist();
        },
        priceMod: 5,
        startPrice: 1000000,
    },
    Big_Cleaver: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 133,
        description: function () {
            return ("Can create a Bleed on the Enemy for 10 seconds. +100% Bleed Chance if the Enemy is at full Health, otherwise +25%. +" +
                prettify(this.attack()) +
                " Attack if the Enemy is Bleeding. +" +
                prettify(this.bleedMod() * 100) +
                "% Bleed Damage, +" +
                prettify(this.health()) +
                " Health.");
        },
        upgrade: "+2 Attack, +25% Bleed Damage, +100 Health",
        attack: function () {
            return 30 + this.level * 2;
        },
        bleedMod: function () {
            return 1 + 0.25 * this.level;
        },
        health: function () {
            return 500 + 100 * this.level;
        },
        doStuff: function () {
            if (autoBattle.enemy.health == autoBattle.enemy.maxHealth)
                autoBattle.trimp.bleedChance += 100;
            else
                autoBattle.trimp.bleedChance += 25;
            autoBattle.trimp.maxHealth += this.health();
            if (autoBattle.enemy.bleed.time > 0)
                autoBattle.trimp.attack += this.attack();
            autoBattle.trimp.bleedMod += this.bleedMod();
            if (autoBattle.trimp.bleedTime <= 10000)
                autoBattle.trimp.bleedTime = 10000;
        },
        priceMod: 4,
        startPrice: 3000000,
    },
    The_Globulator: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 135,
        description: function () {
            return ("+" +
                prettify(this.defense()) +
                " Defense and +" +
                prettify(this.health()) +
                " Max Health if the Enemy is Poisoned. On adding a new Poison Stack to an Enemy that hasn't had poisons expire, heal for half of this item's Max Health. If the Enemy is at Max Poison Stacks, non-Lifesteal healing effects on you are doubled. +" +
                prettify(this.poisonMod()) +
                " Poison Damage.");
        },
        upgrade: "+5 Defense, +500 Health, +10 Poison Damage",
        defense: function () {
            return 25 + 5 * this.level;
        },
        health: function () {
            return 500 + 500 * this.level;
        },
        poisonMod: function () {
            return 15 + 10 * this.level;
        },
        onPoisonStack: function (stacks) {
            if (stacks == 1)
                autoBattle.trimp.maxHealth += this.health();
            if (autoBattle.enemy.poison.expired)
                return;
            autoBattle.trimp.health += this.health() / 2;
            if (autoBattle.trimp.health > autoBattle.trimp.maxHealth)
                autoBattle.trimp.health = autoBattle.trimp.maxHealth;
        },
        doStuff: function () {
            if (autoBattle.enemy.poison.time > 0) {
                autoBattle.trimp.maxHealth += this.health();
                autoBattle.trimp.defense += this.defense();
            }
            autoBattle.trimp.poisonMod += this.poisonMod();
        },
        startPrice: 5e6,
        priceMod: 10,
    },
    Metal_Suit: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 138,
        description: function () {
            return ("+" +
                prettify(this.defense()) +
                " Defense, +" +
                prettify(this.health()) +
                " Health, +" +
                prettify(this.resist()) +
                "% Bleed Resist. If Huffy has an item that can create a Bleed, gain +" +
                prettify(this.attack()) +
                " Attack.");
        },
        upgrade: "+30 Defense, +1000 Health, +20% Bleed Resist, +5 Attack",
        attack: function () {
            return 10 + 5 * this.level;
        },
        defense: function () {
            return -10 + this.level * 30;
        },
        health: function () {
            return -500 + this.level * 1000;
        },
        resist: function () {
            return 30 + 20 * this.level;
        },
        doStuff: function () {
            if (autoBattle.items.Rusty_Dagger.equipped ||
                autoBattle.items.Big_Cleaver.equipped)
                autoBattle.trimp.attack += this.attack();
            autoBattle.trimp.maxHealth += this.health();
            autoBattle.trimp.defense += this.defense();
            autoBattle.trimp.bleedResist += this.resist();
        },
        priceMod: 10,
        startPrice: 6e6,
    },
    Nozzled_Goggles: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 140,
        description: function () {
            return ("The Enemy is always Shocked, taking at least " +
                prettify(this.shockMod() * 100) +
                "% more damage. +" +
                prettify(this.health()) +
                " Health, +" +
                prettify(this.resist()) +
                "% Poison Resist, +3 Maximum Poison Stacks.");
        },
        upgrade: "+20% PermaShock Damage, +500 Health, 20% Poison Resist",
        shockMod: function () {
            return 0.2 * this.level;
        },
        health: function () {
            return -500 + this.level * 1000;
        },
        resist: function () {
            return 20 * this.level;
        },
        doStuff: function () {
            var enemy = autoBattle.enemy;
            if (enemy.shock.time <= 0 || enemy.shock.mod < this.shockMod()) {
                enemy.shock.time = 9999999;
                enemy.shock.mod = this.shockMod();
            }
            autoBattle.trimp.maxHealth += this.health();
            autoBattle.trimp.poisonResist += this.resist();
            autoBattle.trimp.poisonStack += 3;
        },
        startPrice: 7e6,
        priceMod: 10,
    },
    Sundering_Scythe: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 143,
        description: function () {
            return ("-" +
                prettify((1 - this.attackTime()) * 100) +
                "% Attack Time, +" +
                prettify(this.attack()) +
                " Attack, +" +
                prettify(this.health()) +
                " Health, +" +
                prettify(this.lifesteal() * 100) +
                "% Lifesteal. Your Shocks last a maximum of 10 seconds, and your Bleeds can be reapplied when below 5 seconds.");
        },
        upgrade: "-5% Attack Time, +5 Attack, +250 Health, +5% Lifesteal",
        attackTime: function () {
            return 0.842 * Math.pow(0.95, this.level);
        },
        attack: function () {
            return 15 + 5 * this.level;
        },
        health: function () {
            return 500 + 250 * this.level;
        },
        lifesteal: function () {
            return 0.15 + 0.05 * this.level;
        },
        doStuff: function () {
            autoBattle.trimp.attackSpeed *= this.attackTime();
            autoBattle.trimp.attack += this.attack();
            autoBattle.trimp.maxHealth += this.health();
            autoBattle.trimp.lifesteal += this.lifesteal();
        },
        startPrice: 15e6,
        priceMod: 10,
    },
    //Shank 145
    Plague_Bringer: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 148,
        description: function () {
            return ("Your Poisons tick +" +
                prettify((1 - this.tickMult()) * 100) +
                "% faster. +" +
                prettify(this.eachPoison()) +
                " Poison Damage for every percentage point of Bleed or Shock resist on the Enemy. Heal for " +
                prettify(this.healAmt()) +
                " per stack of Poison when your Poisons deal damage.");
        },
        upgrade: "+2% Poison Tick Rate, +0.05 Poison Damage per Enemy Resist, +5 Heal on Poison Tick",
        tickMult: function () {
            return 0.816 * Math.pow(0.98, this.level);
        },
        eachPoison: function () {
            return 0.05 + 0.05 * this.level;
        },
        healAmt: function () {
            return 5 + 5 * this.level;
        },
        poisonMod: function () {
            var res = autoBattle.enemy.bleedResist + autoBattle.enemy.shockResist;
            return Math.floor(res * this.eachPoison());
        },
        doStuff: function () {
            autoBattle.trimp.poisonMod += this.poisonMod();
            autoBattle.trimp.poisonTick *= this.tickMult();
            autoBattle.trimp.poisonHeal += this.healAmt();
        },
        startPrice: 70e6,
        priceMod: 10,
    },
    Very_Large_Slime: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 150,
        description: function () {
            return ("Can create a Poison for 20 seconds. +" +
                prettify(this.poisonChance()) +
                "% Poison Chance, +" +
                prettify(this.poisonMod()) +
                " Poison Damage, +" +
                prettify(this.defense()) +
                " Defense, +" +
                prettify(this.health()) +
                " Health. Every third hit against an Enemy with Max Poison Stacks adds another Max Stack (up to +" +
                prettify(this.maxStacks()) +
                " Max Stacks).");
        },
        upgrade: "+15% Poison Chance, +20 Poison Damage, +50 Defense, +500 Health, +2 Max Stacks",
        poisonChance: function () {
            return 35 + 15 * this.level;
        },
        poisonMod: function () {
            return 10 + 20 * this.level;
        },
        defense: function () {
            return 50 + 50 * this.level;
        },
        health: function () {
            return 500 + 500 * this.level;
        },
        maxStacks: function () {
            return 8 + this.level * 2;
        },
        doStuff: function () {
            autoBattle.trimp.poisonChance += this.poisonChance();
            autoBattle.trimp.poisonMod += this.poisonMod();
            if (autoBattle.trimp.poisonTime < 20000)
                autoBattle.trimp.poisonTime = 20000;
            autoBattle.trimp.defense += this.defense();
            autoBattle.trimp.maxHealth += this.health();
            autoBattle.trimp.poisonStack += Math.min(this.maxStacks(), Math.floor(autoBattle.enemy.poison.hitsAtMax / 3));
        },
        startPrice: 100e6,
        priceMod: 10,
    },
    //Monkimp Paw, 155
    Grounded_Crown: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 160,
        description: function () {
            return ("+" +
                prettify(this.attack()) +
                " Attack, +" +
                prettify(this.shockMod() * 100) +
                "% Shock Damage, +" +
                prettify(this.defense()) +
                " Defense, +" +
                prettify(this.health()) +
                " Health. If the Enemy is Poisoned or Bleeding, Huffy loses 20% of his Max Health per second.");
        },
        upgrade: "+50 Attack, +50% Shock Damage, +50 Defense, +1000 Health",
        attack: function () {
            return 50 + 50 * this.level;
        },
        shockMod: function () {
            return 0.5 + 0.5 * this.level;
        },
        defense: function () {
            return 50 * this.level;
        },
        health: function () {
            return 500 + 1000 * this.level;
        },
        afterCheck: function () {
            if (autoBattle.enemy.poison.time > 0 ||
                autoBattle.enemy.bleed.time > 0) {
                var mod = 20 / autoBattle.frameTime;
                autoBattle.trimp.health -=
                    autoBattle.trimp.maxHealth * mod * autoBattle.trimp.damageTakenMult;
                if (autoBattle.trimp.health < 0.01)
                    autoBattle.trimp.health = 0;
            }
        },
        doStuff: function () {
            autoBattle.trimp.attack += this.attack();
            autoBattle.trimp.shockMod += this.shockMod();
            autoBattle.trimp.defense += this.defense();
            autoBattle.trimp.maxHealth += this.health();
        },
        startPrice: 650e6,
        priceMod: 10,
    },
    Fearsome_Piercer: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 165,
        description: function () {
            return ("+" +
                prettify(this.attack()) +
                " Attack, +" +
                prettify(this.lifesteal() * 100) +
                "% Lifesteal, +" +
                prettify(this.bleedMod() * 100) +
                "% Bleed Damage, +" +
                prettify(this.bleedChance()) +
                "% Bleed Chance. If you have an item that can cause a Bleed, the Enemy starts combat with 25% less Max Health.");
        },
        upgrade: "+75 Attack, +10% Lifesteal, +75% Bleed Damage, +50% Bleed Chance",
        attack: function () {
            return 125 + 75 * this.level;
        },
        lifesteal: function () {
            return 0.3 + 0.1 * this.level;
        },
        bleedMod: function () {
            return 0.25 + 0.75 * this.level;
        },
        bleedChance: function () {
            return 25 + 50 * this.level;
        },
        onEnemy: function () {
            if (autoBattle.items.Rusty_Dagger.equipped ||
                autoBattle.items.Big_Cleaver.equipped ||
                autoBattle.items.Bag_of_Nails.equipped) {
                autoBattle.enemy.baseHealth *= 0.75;
                autoBattle.enemy.maxHealth *= 0.75;
                autoBattle.enemy.health = autoBattle.enemy.maxHealth;
            }
        },
        doStuff: function () {
            autoBattle.trimp.attack += this.attack();
            autoBattle.trimp.lifesteal += this.lifesteal();
            autoBattle.trimp.bleedMod += this.bleedMod();
            autoBattle.trimp.bleedChance += this.bleedChance();
        },
        startPrice: 1.5e9,
        priceMod: 10,
    },
    Bag_of_Nails: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 168,
        startPrice: 2.7e9,
        priceMod: 10,
        description: function () {
            return ("Can create a Bleed on the Enemy for 10 seconds. Enemies are unaffected by your Slow Aura, but deal 25% less damage while Bleeding. +" +
                prettify(this.attack()) +
                " Attack, +" +
                prettify(this.bleedMod() * 100) +
                "% Bleed Damage, +" +
                prettify(this.health()) +
                " Health.");
        },
        upgrade: "+100 Attack, +75% Bleed Damage, +500 Health",
        attack: function () {
            return 150 + this.level * 100;
        },
        bleedMod: function () {
            return 1.25 + 0.75 * this.level;
        },
        health: function () {
            return 500 + 500 * this.level;
        },
        doStuff: function () {
            if (autoBattle.enemy.bleed.time > 0) {
                autoBattle.enemy.attack *= 0.75;
                autoBattle.enemy.noSlow = true;
            }
            else
                autoBattle.enemy.noSlow = false;
            autoBattle.trimp.attack += this.attack();
            autoBattle.trimp.bleedMod += this.bleedMod();
            autoBattle.trimp.maxHealth += this.health();
            if (autoBattle.trimp.bleedTime <= 10000)
                autoBattle.trimp.bleedTime = 10000;
        },
    },
    Blessed_Protector: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 170,
        description: function () {
            return ("+" +
                prettify(this.health()) +
                " Health, +" +
                prettify(this.defense()) +
                " Defense, +" +
                prettify(this.lifesteal() * 100) +
                "% Lifesteal. Huffy gains 0.5% increased Attack for each % of his missing Health. When Huffy is below 50% Health, take 30% less damage from all sources. ");
        },
        upgrade: "+1000 Health, +100 Defense, +25% Lifesteal",
        health: function () {
            return 1000 + 1000 * this.level;
        },
        defense: function () {
            return 100 + 100 * this.level;
        },
        lifesteal: function () {
            return 0.25 + 0.25 * this.level;
        },
        afterCheck: function () {
            var healthPct = autoBattle.trimp.health / autoBattle.trimp.maxHealth;
            if (healthPct < 0.5) {
                autoBattle.trimp.damageTakenMult *= 0.7;
            }
            if (healthPct < 1) {
                var boost = 1 - healthPct;
                boost = 1 + boost * 0.5;
                autoBattle.trimp.attack *= boost;
            }
        },
        doStuff: function () {
            autoBattle.trimp.maxHealth += this.health();
            autoBattle.trimp.defense += this.defense();
            autoBattle.trimp.lifesteal += this.lifesteal();
        },
        startPrice: 4e9,
        priceMod: 10,
    },
    The_Doomspring: {
        description: function () {
            var stack = prettify((1 - this.attackTime()) * 100);
            return ("+" +
                prettify(this.health()) +
                " Health, -" +
                stack +
                "% Attack Time. For every 15000 damage taken this battle, -" +
                stack +
                "% more Attack Time. Stacks up to " +
                this.stacks() +
                " times.");
        },
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 180,
        upgrade: "-5% Attack Time, +1500 Health, +1 stacks",
        attackTime: function () {
            return 0.842 * Math.pow(0.95, this.level);
        },
        health: function () {
            return 1500 + 1500 * this.level;
        },
        stacks: function () {
            return 2 + this.level;
        },
        doStuff: function () {
            var stacks = Math.floor(autoBattle.trimp.dmgTaken / 15000) + 1;
            var maxStacks = this.stacks();
            if (stacks > maxStacks)
                stacks = maxStacks;
            autoBattle.trimp.attackSpeed *= Math.pow(this.attackTime(), stacks);
            autoBattle.trimp.maxHealth += this.health();
        },
        dustType: "shards",
        startPrice: 22,
        priceMod: 15,
    },
    Snimp__Fanged_Blade: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 185,
        description: function () {
            return ("+" +
                prettify(this.attack()) +
                " Attack, +" +
                this.poisonStack() +
                " Max Poison Stacks. If the enemy is Poisoned, +" +
                prettify(this.bleedMod() * 100) +
                "% Bleed Damage. If the enemy is Bleeding, +" +
                prettify(this.poisonMod()) +
                " Poison Damage.");
        },
        upgrade: "+250 Attack, +5 Max Poison Stacks, +200% Bleed Damage, +250 Poison Damage",
        attack: function () {
            return 250 + 250 * this.level;
        },
        poisonMod: function () {
            return 250 * this.level;
        },
        bleedMod: function () {
            return 1 + 2 * this.level;
        },
        poisonStack: function () {
            return 5 * this.level;
        },
        doStuff: function () {
            autoBattle.trimp.attack += this.attack();
            autoBattle.trimp.poisonStack += this.poisonStack();
            if (autoBattle.enemy.poison.time > 0)
                autoBattle.trimp.bleedMod += this.bleedMod();
            if (autoBattle.enemy.bleed.time > 0)
                autoBattle.trimp.poisonMod += this.poisonMod();
        },
        dustType: "shards",
        startPrice: 159,
        priceMod: 15,
    },
    //Dopp signet 190
    Wrath_Crafted_Hatchet: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 195,
        description: function () {
            return ("+" +
                prettify(this.attack()) +
                " Attack, +" +
                prettify(this.health()) +
                " Health, +" +
                prettify(this.defense()) +
                " Defense, -" +
                prettify((1 - this.attackTime()) * 100) +
                "% Attack Time.");
        },
        upgrade: "+750 Attack, +2000 Health, +200 Defense, -5% Attack Time",
        attack: function () {
            return 1250 + 750 * this.level;
        },
        attackTime: function () {
            return 0.842 * Math.pow(0.95, this.level);
        },
        health: function () {
            return 2000 + 2000 * this.level;
        },
        defense: function () {
            return 200 + 200 * this.level;
        },
        doStuff: function () {
            autoBattle.trimp.attack += this.attack();
            autoBattle.trimp.maxHealth += this.health();
            autoBattle.trimp.attackSpeed *= this.attackTime();
            autoBattle.trimp.defense += this.defense();
        },
        dustType: "shards",
        startPrice: 400,
        priceMod: 15,
    },
    //basket of souls 200
    Goo_Golem: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 205,
        description: function () {
            return ("+" +
                prettify(this.health()) +
                " Health, +" +
                prettify(this.poisonMod()) +
                " Poison Damage, +" +
                prettify(this.poisonStack()) +
                " Max Poison Stacks. If the Enemy is Poisoned, all damage Huffy takes is stored in the Golem, and Huffy takes 10% of the Golem's stored damage every second.");
        },
        upgrade: "+1000 Health, +400 Poison Damage, +5 Max Poison Stacks",
        health: function () {
            return 2000 + 1000 * this.level;
        },
        poisonMod: function () {
            return 400 * this.level;
        },
        poisonStack: function () {
            return 5 + 5 * this.level;
        },
        active: function () {
            if (this.equipped && autoBattle.enemy.poison.time > 0)
                return true;
            return false;
        },
        doStuff: function () {
            autoBattle.trimp.maxHealth += this.health();
            autoBattle.trimp.poisonMod += this.poisonMod();
            autoBattle.trimp.poisonStack += this.poisonStack();
            if (autoBattle.battleTime > autoBattle.trimp.lastGoo + 1000) {
                if (autoBattle.trimp.lastGoo == -1)
                    autoBattle.trimp.lastGoo = autoBattle.battleTime;
                else
                    autoBattle.trimp.lastGoo += 1000;
                var dmg = autoBattle.trimp.gooStored * 0.1;
                autoBattle.trimp.gooStored -= dmg;
                autoBattle.damageCreature(autoBattle.trimp, dmg, true);
            }
        },
        dustType: "shards",
        startPrice: 2500,
        priceMod: 15,
    },
    Omni_Enhancer: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 210,
        description: function () {
            return ("+" +
                prettify(this.attack()) +
                " Attack, +" +
                prettify(this.bleedMod() * 100) +
                "% Bleed Damage, +" +
                prettify(this.shockMod() * 100) +
                "% Shock Damage, +" +
                prettify(this.poisonMod()) +
                " Poison Damage, +1 Poison Stack Rate, and Poisons tick 10% faster.");
        },
        upgrade: "+2500 Attack, +300% Bleed Damage, +300% Shock Damage, +1000 Poison Damage",
        attack: function () {
            return 2500 + 2500 * this.level;
        },
        bleedMod: function () {
            return 4 + 3 * this.level;
        },
        shockMod: function () {
            return 4 + 3 * this.level;
        },
        poisonMod: function () {
            return 1000 * this.level;
        },
        doStuff: function () {
            autoBattle.trimp.attack += this.attack();
            autoBattle.trimp.bleedMod += this.bleedMod();
            autoBattle.trimp.shockMod += this.shockMod();
            autoBattle.trimp.poisonMod += this.poisonMod();
            autoBattle.trimp.poisonTick *= 0.9;
            autoBattle.trimp.poisonRate++;
        },
        dustType: "shards",
        startPrice: 6300,
        priceMod: 15,
    },
    //stormbringer 215
    Box_of_Spores: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 220,
        description: function () {
            return ("If the Enemy dies while Poisoned and not Bleeding, it drops " +
                this.dustMult() +
                "x more Dust.");
        },
        upgrade: "+1x Dust",
        dustMult: function () {
            return 4 + this.level;
        },
        dustType: "shards",
        startPrice: 60000,
        priceMod: 15,
    },
    //nullifium armor 225
    //handful of mold 230
    Haunted_Harpoon: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 235,
        description: function () {
            return ("+" +
                prettify(this.health()) +
                " Health. If the Enemy is Bleeding and has been alive for at least 5 seconds, Huffy gains " +
                prettify(this.attack()) +
                " Attack, and the Enemy takes an additional " +
                prettify(this.bleedTickMult() * 100) +
                "% of its Bleed damage every second.");
        },
        upgrade: "+10,000 Attack, +5000 Health, +100% of Bleed Damage taken per second",
        health: function () {
            return 5000 + 5000 * this.level;
        },
        bleedTickMult: function () {
            return 9 + this.level;
        },
        attack: function () {
            return 15000 + 10000 * this.level;
        },
        doStuff: function () {
            if (autoBattle.enemy.bleed.time > 0 && autoBattle.battleTime > 5000)
                autoBattle.trimp.attack += this.attack();
            autoBattle.trimp.maxHealth += this.health();
        },
        afterCheck: function () {
            if (autoBattle.enemy.bleed.time > 0 && autoBattle.battleTime > 5000) {
                var bdamage = autoBattle.getBleedDamage(autoBattle.enemy, autoBattle.trimp);
                var pct = this.bleedTickMult() * (autoBattle.frameTime / 1000);
                bdamage *= pct;
                autoBattle.damageCreature(autoBattle.enemy, bdamage);
            }
        },
        dustType: "shards",
        startPrice: 15e5,
        priceMod: 20,
    },
    //Final calc items
    //After all shock resist
    Stormbringer: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 215,
        description: function () {
            return ("The Enemy loses all Shock Resistance, adding it instead to Bleed Resistance. +" +
                prettify(this.shockMod() * 100) +
                "% Shock Damage, +" +
                prettify(this.poisonMod()) +
                " Poison Damage.");
        },
        upgrade: "+500% Shock Damage, +5000 Poison Damage",
        shockMod: function () {
            return 10 + 5 * this.level;
        },
        poisonMod: function () {
            return 5000 + 5000 * this.level;
        },
        doStuff: function () {
            autoBattle.enemy.bleedResist += autoBattle.enemy.shockResist;
            autoBattle.enemy.shockResist = 0;
            autoBattle.trimp.shockMod += this.shockMod();
            autoBattle.trimp.poisonMod += this.poisonMod();
        },
        dustType: "shards",
        startPrice: 20000,
        priceMod: 15,
    },
    Bad_Medkit: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 84,
        description: function () {
            return ("Causes Bleeds you generate from other items to last at least " +
                this.bleedTime() +
                " seconds. +" +
                prettify(this.bleedChance()) +
                "% Bleed Chance. +" +
                prettify(this.lifesteal() * 100) +
                "% Lifesteal if the enemy is Bleeding.");
        },
        upgrade: "+1s Minimum Bleed Time, +4% Bleed Chance, +2.5% Lifesteal",
        bleedTime: function () {
            return 11 + 1 * this.level;
        },
        lifesteal: function () {
            return 0.175 + 0.025 * this.level;
        },
        bleedChance: function () {
            return 21 + this.level * 4;
        },
        doStuff: function () {
            if (autoBattle.trimp.bleedTime > 0 &&
                autoBattle.trimp.bleedTime < this.bleedTime() * 1000)
                autoBattle.trimp.bleedTime = this.bleedTime() * 1000;
            if (autoBattle.enemy.bleed.time > 0)
                autoBattle.trimp.lifesteal += this.lifesteal();
            autoBattle.trimp.bleedChance += this.bleedChance();
        },
        startPrice: 300,
    },
    Putrid_Pouch: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 78,
        description: function () {
            return ("-10% Attack Time and +" +
                prettify(this.defense()) +
                " Defense if the Enemy is Poisoned. Causes Poisons you generate from other items to last at least " +
                prettify(this.poisonTime() / 1000) +
                " seconds. +" +
                prettify(this.poisonChance()) +
                "% Poison Chance.");
        },
        upgrade: "+1s Poison Duration, +6% Poison Chance, +3 Defense",
        poisonTime: function () {
            return 19000 + this.level * 1000;
        },
        poisonChance: function () {
            return 14 + this.level * 6;
        },
        defense: function () {
            return 7 + 3 * this.level;
        },
        doStuff: function () {
            if (autoBattle.enemy.poison.time > 0) {
                autoBattle.trimp.attackSpeed *= 0.9;
                autoBattle.trimp.defense += this.defense();
            }
            var poisonTime = this.poisonTime();
            if (autoBattle.trimp.poisonTime > 0 &&
                autoBattle.trimp.poisonTime < poisonTime)
                autoBattle.trimp.poisonTime = poisonTime;
            autoBattle.trimp.poisonChance += this.poisonChance();
        },
        startPrice: 150,
        priceMod: 4,
    },
    Raincoat: {
        //After all bleed chance
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 75,
        description: function () {
            return ("If you have a chance to cause Bleeding, gain +" +
                prettify(this.defense()) +
                " Defense, +" +
                prettify(this.health()) +
                " Health, +" +
                prettify(this.lifesteal() * 100) +
                "% Lifesteal, and +" +
                prettify(this.bleedDamage() * 100) +
                "% Bleed Damage.");
        },
        upgrade: "+2 defense, +20 health, +2.5% Lifesteal, +10% Bleed Damage",
        defense: function () {
            return 4 + this.level * 2;
        },
        health: function () {
            return 20 + 20 * this.level;
        },
        lifesteal: function () {
            return 0.125 + 0.025 * this.level;
        },
        bleedDamage: function () {
            return 0.2 + 0.1 * this.level;
        },
        doStuff: function () {
            var bleedChance = autoBattle.trimp.bleedChance;
            if (autoBattle.items.Sacrificial_Shank.equipped)
                bleedChance = Math.floor(bleedChance * 0.75);
            if (bleedChance > autoBattle.enemy.bleedResist &&
                autoBattle.trimp.bleedTime > 0 &&
                autoBattle.trimp.bleedMod > 0) {
                autoBattle.trimp.defense += this.defense();
                autoBattle.trimp.maxHealth += this.health();
                autoBattle.trimp.lifesteal += this.lifesteal();
                autoBattle.trimp.bleedMod += this.bleedDamage();
            }
        },
        startPrice: 100,
        priceMod: 4,
    },
    Labcoat: {
        //after all poison chance
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 90,
        description: function () {
            return ("If you have a chance to cause Poison, gain +" +
                prettify(this.health()) +
                " Health, -" +
                prettify((1 - this.attackTime()) * 100) +
                "% Attack Time, and +" +
                prettify(this.poisonMod()) +
                " Poison Damage.");
        },
        upgrade: "+25 Health, -1% Attack Time, +1 Poison Damage",
        health: function () {
            return 25 + 25 * this.level;
        },
        attackTime: function () {
            return Math.pow(0.99, this.level);
        },
        poisonMod: function () {
            return 1 + this.level;
        },
        doStuff: function () {
            var poisonChance = autoBattle.trimp.poisonChance;
            if (autoBattle.items.Sacrificial_Shank.equipped)
                poisonChance = Math.floor(poisonChance * 0.75);
            if (poisonChance > autoBattle.enemy.poisonResist &&
                autoBattle.trimp.poisonMod > 0 &&
                autoBattle.trimp.poisonTime > 0) {
                autoBattle.trimp.maxHealth += this.health();
                autoBattle.trimp.attackSpeed *= this.attackTime();
                autoBattle.trimp.poisonMod += this.poisonMod();
            }
        },
        startPrice: 1500,
        priceMod: 4.5,
    },
    Aegis: {
        //after all health
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 118,
        description: function () {
            return ("+" +
                this.defenseEffect() +
                " Defense. If Huffy's Health % is higher than Enemy Health %, gain +" +
                prettify(this.shockChance()) +
                "% Shock Chance, +" +
                prettify(this.shockMod() * 100) +
                "% Shock Damage, 15s Shock Time. Otherwise, this item's Defense is doubled and gain +" +
                prettify(this.lifestealEffect() * 100) +
                "% Lifesteal.");
        },
        upgrade: "+4 Defense, +10% Shock Chance, +10% Shock Damage, +10% Lifesteal",
        defenseEffect: function () {
            return 6 + 4 * this.level;
        },
        shockChance: function () {
            return 15 + 10 * this.level;
        },
        shockMod: function () {
            return 0.15 + 0.1 * this.level;
        },
        lifestealEffect: function () {
            return 0.05 + 0.1 * this.level;
        },
        doStuff: function () {
            var hufPct = autoBattle.trimp.health / autoBattle.trimp.maxHealth;
            var enemyPct = autoBattle.enemy.health / autoBattle.enemy.maxHealth;
            if (hufPct > enemyPct) {
                autoBattle.trimp.shockChance += this.shockChance();
                autoBattle.trimp.shockMod += this.shockMod();
                if (autoBattle.trimp.shockTime < 15000)
                    autoBattle.trimp.shockTime = 15000;
                autoBattle.trimp.defense += this.defenseEffect();
            }
            else {
                autoBattle.trimp.lifesteal += this.lifestealEffect();
                autoBattle.trimp.defense += this.defenseEffect() * 2;
            }
        },
        priceMod: 8,
        startPrice: 65000,
    },
    Sacrificial_Shank: {
        //after all status chances
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 145,
        enemyReduced: 0,
        description: function () {
            return ("Multiply Huffy's and the Enemy's highest status effect chance (before resists) by 0.75. -" +
                prettify((1 - this.attackTime()) * 100) +
                "% Attack Time, +" +
                prettify(this.resist()) +
                " to all Resists, and +" +
                prettify(this.lifesteal() * 100) +
                "% Lifesteal per 10% Huffy or Enemy status chance lost.");
        },
        upgrade: "-1% Attack Time, +1% Resists, +1% Lifesteal per 10% status chance lost",
        attackTime: function () {
            return Math.pow(0.99, this.level);
        },
        resist: function () {
            return 1 * this.level;
        },
        lifesteal: function () {
            return 0.01 * this.level;
        },
        onEnemy: function () {
            var toReduce = ["poisonChance", "bleedChance", "shockChance"];
            var totalReduce = 0;
            var highestElem = "";
            var highestChance = 0;
            for (var x = 0; x < toReduce.length; x++) {
                var name = toReduce[x];
                if (autoBattle.enemy[name] > highestChance) {
                    highestChance = autoBattle.enemy[name];
                    highestElem = name;
                }
            }
            var thisReduce = autoBattle.enemy[highestElem] * 0.25;
            if (thisReduce > 0) {
                autoBattle.enemy[highestElem] -= thisReduce;
                totalReduce += thisReduce;
            }
            this.enemyReduced = totalReduce;
        },
        doStuff: function () {
            var toReduce = ["poisonChance", "bleedChance", "shockChance"];
            var totalReduce = this.enemyReduced;
            var highestElem = "";
            var highestChance = 0;
            for (var x = 0; x < toReduce.length; x++) {
                var name = toReduce[x];
                if (autoBattle.trimp[name] > highestChance) {
                    highestChance = autoBattle.trimp[name];
                    highestElem = name;
                }
            }
            var thisReduce = autoBattle.trimp[highestElem] * 0.25;
            if (thisReduce > 0) {
                autoBattle.trimp[highestElem] -= thisReduce;
                totalReduce += thisReduce;
            }
            totalReduce = Math.floor(totalReduce / 10);
            if (totalReduce <= 0)
                return;
            autoBattle.trimp.attackSpeed *= Math.pow(this.attackTime(), totalReduce);
            autoBattle.trimp.lifesteal += this.lifesteal() * totalReduce;
            autoBattle.trimp.poisonResist += this.resist() * totalReduce;
            autoBattle.trimp.bleedResist += this.resist() * totalReduce;
            autoBattle.trimp.shockResist += this.resist() * totalReduce;
        },
        startPrice: 2500000,
        priceMod: 4,
    },
    Basket_of_Souls: {
        //after all additive lifesteal and health (before monkimp)
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 200,
        description: function () {
            return ("+" +
                prettify(this.health()) +
                " Health, +" +
                prettify(this.defense()) +
                " Defense, +" +
                prettify(this.lifesteal() * 100) +
                "% Lifesteal, +" +
                prettify(this.bleedMod() * 100) +
                "% Bleed Damage, +" +
                prettify(this.shockMod() * 100) +
                "% Shock Damage. Multiplies Huffy's Max Health by his Lifesteal value, then multiplies his Lifesteal by 0.5.");
        },
        upgrade: "+1000 Health, +300 Defense, +100% Lifesteal, +200% Bleed Damage, +200% Shock Damage",
        health: function () {
            return 2000 + 1000 * this.level;
        },
        defense: function () {
            return 300 + 200 * this.level;
        },
        lifesteal: function () {
            return 2 + this.level;
        },
        bleedMod: function () {
            return 3 + 2 * this.level;
        },
        shockMod: function () {
            return 3 + 2 * this.level;
        },
        doStuff: function () {
            autoBattle.trimp.maxHealth += this.health();
            autoBattle.trimp.defense += this.defense();
            autoBattle.trimp.lifesteal += this.lifesteal();
            autoBattle.trimp.bleedMod += this.bleedMod();
            autoBattle.trimp.shockMod += this.shockMod();
            if (autoBattle.items.Monkimp_Paw.equipped)
                autoBattle.trimp.lifesteal *= 0.75; //monkimp paw special interaction
            autoBattle.trimp.maxHealth *= autoBattle.trimp.lifesteal;
            autoBattle.trimp.lifesteal *= 0.5;
        },
        dustType: "shards",
        startPrice: 1000,
        priceMod: 15,
    },
    Monkimp_Paw: {
        //after basket of souls
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 155,
        description: function () {
            return ("+" +
                prettify(this.attack()) +
                " Attack, removes a fourth of your total Lifesteal.");
        },
        upgrade: "+100 Attack",
        attack: function () {
            return 100 * this.level;
        },
        doStuff: function () {
            autoBattle.trimp.attack += this.attack();
            if (!autoBattle.items.Basket_of_Souls.equipped)
                autoBattle.trimp.lifesteal *= 0.75; //basket of souls special interaction
            if (autoBattle.trimp.lifesteal < 0)
                autoBattle.trimp.lifesteal = 0;
        },
        startPrice: 200e6,
        priceMod: 10,
    },
    Spiked_Gloves: {
        //after all attack
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 108,
        description: function () {
            return "+" + this.formatEffect() + "% Attack damage.";
        },
        upgrade: "+5% attack damage",
        formatEffect: function () {
            return prettify(this.effect() * 100);
        },
        effect: function () {
            return 0.2 + 0.05 * this.level;
        },
        doStuff: function () {
            autoBattle.trimp.attack *= 1 + this.effect();
        },
        startPrice: 10000,
        priceMod: 6,
    },
    //after all attack and health
    Nullifium_Armor: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 225,
        description: function () {
            return ("Huffy gains +" +
                prettify((this.statMult() - 1) * 100) +
                "% Health, and +" +
                prettify((this.statMult() - 1) * 100) +
                "% Attack. If the Enemy is not Poisoned, gain " +
                prettify(this.lifesteal() * 100) +
                "% Lifesteal.");
        },
        upgrade: "+50% Attack, Health, and Lifesteal",
        statMult: function () {
            return 4.5 + this.level * 0.5;
        },
        lifesteal: function () {
            return 1.5 + this.level * 0.5;
        },
        doStuff: function () {
            if (autoBattle.enemy.poison.time <= 0)
                autoBattle.trimp.lifesteal += this.lifesteal();
            autoBattle.trimp.maxHealth *= this.statMult();
            autoBattle.trimp.attack *= this.statMult();
        },
        dustType: "shards",
        startPrice: 200000,
        priceMod: 20,
    },
    Doppelganger_Signet: {
        //actual final attack item
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 190,
        description: function () {
            return "Summon a Doppelganger which grants you 50% damage reduction, 2x Attack, and +1 Poison Stack Rate while it is alive. Your Doppelganger will explode after taking damage equal to your Max Health or if it would kill the Enemy, redealing all damage dealt so far this fight, and shredding 50% Enemy Defense.";
        },
        onDeath: function () {
            var damageDealt = autoBattle.enemy.dmgTaken;
            autoBattle.damageCreature(autoBattle.enemy, damageDealt, false, true);
            autoBattle.enemy.defense *= 0.5;
            autoBattle.trimp.doppDown = true;
        },
        doStuff: function () {
            if (autoBattle.trimp.doppDown)
                return;
            autoBattle.trimp.attack *= 2;
            autoBattle.trimp.damageTakenMult *= 0.5;
            autoBattle.trimp.poisonRate++;
            if (autoBattle.trimp.dmgTaken >= autoBattle.trimp.maxHealth ||
                autoBattle.enemy.dmgTaken >= autoBattle.enemy.health)
                this.onDeath();
        },
        noUpgrade: true,
        dustType: "shards",
    },
    //Final Poison Damage item
    Handful_of_Mold: {
        owned: false,
        equipped: false,
        hidden: false,
        level: 1,
        zone: 230,
        description: function () {
            return ("Huffy isn't excited about holding this item but can't deny the results. Multiplies the damage dealt by Poison ticks by " +
                this.poisonMult() +
                "x.");
        },
        upgrade: "+1x to Poison Damage multiplier",
        poisonMult: function () {
            return 2 + this.level;
        },
        doStuff: function () {
            autoBattle.trimp.poisonMod *= this.poisonMult();
        },
        startPrice: 5e5,
        priceMod: 20,
        dustType: "shards",
    },
};
