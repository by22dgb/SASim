import { u2Mutations } from "./mutations.js";
export let autoBattle = {
    // Manually set thingys
    usingRealTimeOffline: false,
    scruffyLvl21: false,
    fluffyExp2: 0,
    // Controller stuff, it will change these to something meaningful on import
    onEnemyDied: function () { },
    onTrimpDied: function () { },
    // GS stuff
    frameTime: 300,
    speed: 1,
    enemyLevel: 1,
    maxEnemyLevel: 1,
    autoLevel: false, // Changed from true
    dust: 0,
    shards: 0,
    shardDust: 0,
    trimp: null,
    enemy: null,
    seed: 4568654,
    enemiesKilled: 0,
    sessionEnemiesKilled: 0,
    sessionTrimpsKilled: 0,
    maxItems: 4,
    notes: "&nbsp;",
    popupMode: "items",
    battleTime: 0,
    lastSelect: "",
    lastActions: [],
    activeContract: "",
    lootAvg: {
        accumulator: 0,
        counter: 0,
    },
    presets: {
        names: ["Preset 1", "Preset 2", "Preset 3"],
        p1: [],
        p2: [],
        p3: [],
    },
    rings: {
        level: 1,
        mods: [],
    },
    template: function () {
        return {
            level: 1,
            isTrimp: false,
            baseHealth: 50,
            health: 50,
            maxHealth: 50,
            baseAttack: 5,
            attack: 5,
            baseAttackSpeed: 5000,
            attackSpeed: 5000,
            lastAttack: 0,
            shockChance: 0,
            shockMod: 0,
            bleedChance: 0,
            bleedMod: 0,
            bleedTime: 0,
            hadBleed: false,
            poisonChance: 0,
            poisonTime: 0,
            poisonMod: 0,
            poisonStack: 2,
            poisonRate: 1,
            poisonTick: 1000,
            poisonHeal: 0,
            defense: 0,
            lifesteal: 0,
            shockResist: 0,
            poisonResist: 0,
            bleedResist: 0,
            lifestealResist: 0,
            slowAura: 1,
            damageTakenMult: 1,
            enrageMult: 1.25,
            enrageFreq: 60,
            explodeDamage: 0,
            explodeFreq: -1,
            lastExplode: 0,
            berserkMod: -1,
            berserkStack: 0,
            ethChance: 0,
            dmgTaken: 0,
            dustMult: 0,
            gooStored: 0,
            lastGoo: -1,
            immune: "",
            bleed: {
                time: 0,
                mod: 0,
            },
            poison: {
                time: 0,
                mod: 0,
                lastTick: 0,
                stacks: 0,
                expired: false,
                hitsAtMax: 0,
            },
            shock: {
                time: 0,
                mod: 0,
                count: 0,
                timeApplied: 0,
            },
        };
    },
    unlockAllItems: function () {
        for (var item in this.items) {
            this.items[item].owned = true;
        }
    },
    resetAll: function () {
        this.dust = 0;
        this.shards = 0;
        this.trimp = null;
        this.enemy = null;
        this.enemiesKilled = 0;
        this.resetStats();
        this.resetCombat();
    },
    getItemOrder: function () {
        var items = [];
        for (var item in this.items) {
            items.push({
                name: item,
                zone: this.items[item].zone ? this.items[item].zone : 0,
            });
        }
        function itemSort(a, b) {
            if (a.zone > b.zone)
                return 1;
            if (a.zone < b.zone)
                return -1;
        }
        items.sort(itemSort);
        return items;
    },
    getContracts: function () {
        var items = this.getItemOrder();
        var contracts = [];
        for (var x = 0; x < items.length; x++) {
            if (!this.items[items[x].name].owned) {
                contracts.push(items[x].name);
                if (contracts.length >= 3)
                    return contracts;
            }
        }
        return contracts;
    },
    contractPrice: function (item) {
        var itemObj = this.items[item];
        var dif = itemObj.zone - 75;
        var total = 100 * Math.pow(1.2023, dif);
        if (itemObj.dustType == "shards")
            total /= 1e9;
        return total;
    },
    oneTimerPrice: function (item) {
        var itemObj = this.oneTimers[item];
        var allItems = this.getItemOrder();
        var index = itemObj.requiredItems - 1;
        if (itemObj.useShards)
            index++;
        if (index <= 6)
            return 10000;
        var lastItem = allItems[index];
        var contractPrice = this.contractPrice(lastItem.name);
        if (itemObj.useShards)
            return Math.ceil(contractPrice / 2);
        return Math.ceil(contractPrice * 1000) / 10;
    },
    items: {
        //Starting items
        Menacing_Mask: {
            owned: true,
            equipped: false,
            hidden: false,
            level: 1,
            description: function(){
                return "使怒怒的攻击间隔-" + prettify((1 - this.trimpAttackSpeed()) * 100) + "%，敌人的攻击间隔+" + prettify((1 - this.enemyAttackSpeed()) * -100) + "%。";
            },
            upgrade: "每级使怒怒的攻击间隔-2%，敌人的攻击间隔+2%(相互叠乘)",
            trimpAttackSpeed: function(){
                return Math.pow(0.98, this.level);
            },
            enemyAttackSpeed: function(){ 
                return 1.05 * Math.pow(1.02, (this.level - 1));
            },
            doStuff: function(){
                autoBattle.trimp.attackSpeed *= this.trimpAttackSpeed();
                autoBattle.enemy.attackSpeed *= this.enemyAttackSpeed();
            },
            priceMod: 5
        },
        Sword: {
            owned: true,
            equipped: true,
            hidden: false,
            level: 1,
            description: function(){
                return "使怒怒的攻击力+" + this.effect() + "。";
            },
            upgrade: "每级使怒怒的攻击力+1",
            effect: function(){
                return this.level;
            },
            doStuff: function(){
                autoBattle.trimp.attack += this.effect();
            },
            priceMod: 2.5
        },
        Armor: {
            owned: true,
            equipped: false,
            hidden: false,
            level: 1,
            description: function(){
                return "使怒怒的基础生命值+" + prettify(this.effect()) + "。";
            },
            upgrade: "每级使怒怒的基础生命值+20",
            effect: function(){
                return 20 * this.level;
            },
            doStuff: function(){
                autoBattle.trimp.maxHealth += this.effect();
            },
            priceMod: 5
        },
        Rusty_Dagger: {
            owned: true,
            equipped: false,
            hidden: false,
            level: 1,
            description: function () {
                return ("可以使敌人流血，持续10秒。使怒怒的流血伤害+" +
                    prettify(this.bleedMod() * 100) +
                    "%" +
                    (this.level >= 5 ? "，攻击力+" + prettify(this.attack()) : "") +
                    "。使怒怒触发流血的概率+" +
                    prettify(this.bleedChance()) +
                    "%，如果敌人震荡或中毒了，则使概率翻倍。");
            },
            upgrade: "每5级使怒怒的攻击力+10，流血伤害+20%。每级使怒怒的流血伤害+5%，触发流血的概率+3%",
            attack: function () {
                return Math.floor(this.level / 5) * 10;
            },
            bleedChance: function(){
                return 17 + (3 * this.level);
            },
            bleedMod: function(){
                var val = 0.1 + (0.05 * this.level);
                val += (Math.floor(this.level / 5) * 0.2);
                return val;
            },
            doStuff: function(){
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
            priceMod: 4
        },
        Fists_of_Goo: {
            owned: true,
            equipped: false,
            hidden: false,
            level: 1,
            description: function(){
                return "可以使敌人中毒，持续10秒。使怒怒的中毒伤害+" + prettify(this.effect()) + "。使怒怒触发中毒的概率+25%，如果敌人流血或震荡了，则使概率翻倍。"
            },
            upgrade: "每级使怒怒的中毒伤害+1",
            effect: function(){
                return this.level;
            },
            doStuff: function(){
                autoBattle.trimp.poisonMod += this.effect();
                autoBattle.trimp.poisonChance +=
                    autoBattle.enemy.shock.time > 0 || autoBattle.enemy.bleed.time > 0 ? 50 : 25;
                if (autoBattle.trimp.poisonTime < 10000)
                    autoBattle.trimp.poisonTime = 10000;
            },
            priceMod: 6,
            startPrice: 50
        },
        Battery_Stick: {
            owned: true,
            equipped: false,
            hidden: false,
            level: 1,
            description: function () {
                return ("可以使敌人震荡，持续10秒。使怒怒的震荡伤害+" +
                    prettify(this.shockMod() * 100) +
                    "%。使怒怒触发震荡的概率+35%，如果敌人流血或中毒了，则使概率翻倍。");
            },
            upgrade: "每级使怒怒的震荡伤害+10%",
            shockMod: function () {
                return 0.15 + 0.1 * this.level;
            },
            doStuff: function () {
                autoBattle.trimp.shockChance +=
                    autoBattle.enemy.bleed.time > 0 || autoBattle.enemy.poison.time > 0 ? 70 : 35;
                autoBattle.trimp.shockMod += this.shockMod();
                autoBattle.trimp.shockTime = 10000;
            },
            startPrice: 25,
            priceMod: 4
        },
        Pants: {
            owned: true,
            equipped: true,
            hidden: false,
            level: 1,
            description: function(){
                return "使怒怒的防御力+" + prettify(this.effect()) + "。"
            },
            upgrade: "每级使怒怒的防御力+1",
            effect: function(){
                return this.level;
            },
            doStuff: function(){
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
            description: function(){
                var stacks = this.poisonStack();
                return "如果敌人未中毒，则使怒怒触发中毒的概率+50%。如果敌人中毒了，则使怒怒的防御力+" + this.defenseEffect() + "。使怒怒触发中毒的概率+" + prettify(this.poisonChance()) + "%。怒怒触发的中毒可以多叠加" + stacks + "层。";
            },
            upgrade: "每4级使中毒层数的上限+1。每级使怒怒的防御力+1，怒怒触发中毒的基础概率+4%",
            defenseEffect: function(){
                return this.level;
            },
            poisonChance: function(){
                return 6 + (this.level * 4);
            },
            poisonStack: function(){
                var levels = Math.floor(this.level / 4);
                return 1 + levels;
            },
            doStuff: function(){
                if (autoBattle.enemy.poison.time > 0) autoBattle.trimp.defense += this.defenseEffect();
                else autoBattle.trimp.poisonChance += 50;
                autoBattle.trimp.poisonChance += this.poisonChance();
                autoBattle.trimp.poisonStack += this.poisonStack();
            },
            priceMod: 4,
            startPrice: 200
        },
        //bad medkit - 84
        Comfy_Boots: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 87,
            description: function () {
                return ("使怒怒的防御力+" + prettify(this.defense()) + "。所有抗性+" + prettify(this.resistance()) + "%。");
            },
            upgrade: "每级使怒怒的防御力+2，所有抗性+5%",
            defense: function(){
                return 2 + (this.level * 2);
            },
            resistance: function(){
                return (this.level * 5);
            },
            doStuff: function(){
                autoBattle.trimp.defense += this.defense();
                var res = this.resistance();
                autoBattle.trimp.bleedResist += res;
                autoBattle.trimp.poisonResist += res;
                autoBattle.trimp.shockResist += res;
            },
            startPrice: 430
        },
        //Labcoat 90
        Lifegiving_Gem: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 93,
            description: function(){
                return "使敌人多掉落" + prettify(this.effect() * 100) + "%魔尘，该数值还会*加*上*敌人死亡时怒怒的吸血数值。"
            },
            upgrade: "每级使敌人多掉落10%魔尘",
            effect: function(){
                return 0.2 + (0.1 * this.level);
            },
            dustIncrease: function () {
                return this.effect() + Math.max(0, autoBattle.trimp.lifesteal - autoBattle.enemy.lifestealResist);
            },
            startPrice: 650,
            priceMod: 4
        },
        Mood_Bracelet: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 95,
            description: function(){
                return "如果敌人未流血，则使怒怒的攻击间隔-" + prettify((1 - this.effect()) * 100) + "%，防御力+" + prettify(this.defense()) + "。"
            },
            upgrade: "每级使怒怒的攻击间隔-3%(相互叠乘)，防御力+4",
            effect: function(){
                return 0.8765 * Math.pow(0.97, this.level);
            },
            defense: function(){
                return 6 + (4 * this.level);
            },
            doStuff: function(){
                if (autoBattle.enemy.bleed.time <= 0){
                    autoBattle.trimp.attackSpeed *= this.effect();
                    autoBattle.trimp.defense += this.defense();
                }
            },
            priceMod: 4,
            startPrice: 1100
        },
        Hungering_Mold: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 98,
            description: function(){
                return "当怒怒触发中毒造成伤害时，每层中毒使怒怒的生命值恢复" + prettify(this.healAmt()) + "。怒怒的中毒触发速度+" + prettify((1 - this.tickMult()) * 100) + "%。";
            },
            upgrade: "每级使怒怒的生命值恢复量+0.5，中毒触发速度+1%",
            healAmt: function(){
                return 0.5 + (0.5 * this.level);
            },
            tickMult: function(){
                return 0.909 * Math.pow(0.99, this.level);
            },
            doStuff: function(){
                autoBattle.trimp.poisonTick *= this.tickMult();
                autoBattle.trimp.poisonHeal += this.healAmt();
            },
            priceMod: 5,
            startPrice: 2000
        },
        Recycler: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 100,
            description: function(){
                return "使怒怒的吸血+" + prettify(this.effect() * 100) + "%。怒怒因敌人流血而吸血恢复的生命值翻倍。";
            },
            upgrade: "每级使怒怒的吸血+5%",
            effect: function(){
                return 0.2 + (0.05 * this.level);
            },
            doStuff: function(){
                autoBattle.trimp.lifesteal += this.effect();
            },
            startPrice: 2800,
            priceMod: 5
        },
        Shining_Armor: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 103,
            description: function () {
                return "使怒怒的防御力+" + prettify(this.defense()) + "。使怒怒的生命值+" + prettify(this.health()) + "。";
            },
            upgrade: "每级使怒怒的防御力+6，生命值+100",
            defense: function(){
                return 14 + (6 * this.level);
            },
            health: function(){
                return 200 + (this.level * 100);
            },
            doStuff: function(){
                autoBattle.trimp.defense += this.defense();
                autoBattle.trimp.maxHealth += this.health();
            },
            priceMod: 5,
            startPrice: 4000
        },
        Shock_and_Awl:{
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 105,
            description: function(){
                return "可以使敌人震荡，持续20秒。使怒怒的攻击力+" + prettify(this.attack()) + "，触发震荡的概率+" + prettify(this.shockChance()) + "%，震荡伤害+" + prettify(this.shockMod() * 100) + "%。如果敌人未震荡，则使怒怒的攻击间隔-25%，如果敌人震荡了，则使怒怒的吸血+25%。";
            },
            upgrade: "每级使怒怒的攻击力+4，触发震荡的概率+10%，震荡伤害+10%",
            attack: function(){
                return 6 + (4 * this.level);
            },
            shockChance: function(){
                return 20 + (10 * this.level);
            },
            shockMod: function(){
                return .40 + (.1 * this.level);
            },
            doStuff: function(){
                if (autoBattle.trimp.shockTime < 20000) autoBattle.trimp.shockTime = 20000;
                autoBattle.trimp.shockMod += this.shockMod();
                autoBattle.trimp.shockChance += this.shockChance();
                autoBattle.trimp.attack += this.attack();
                if (autoBattle.enemy.shock.time <= 0) autoBattle.trimp.attackSpeed *= 0.75;
                else autoBattle.trimp.lifesteal += 0.25;
            },
            priceMod: 5,
            startPrice: 5750
        },
        //spiked gloves - 108
        Tame_Snimp: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 110,
            description: function(){
                return "可以使敌人中毒，持续10秒。使怒怒触发中毒的概率+" + prettify(this.poisonChance()) + "%，中毒伤害+" + prettify(this.poisonMod()) + "。如果敌人中毒了，则使它的攻击力减少15%。";
            },
            upgrade: "每级使怒怒触发中毒的概率+10%，中毒伤害+2",
            poisonChance: function(){
                return 30 + (10 * this.level);
            },
            poisonMod: function(){
                return 5 + (2 * this.level);
            },
            doStuff: function(){
                if (autoBattle.enemy.poison.time > 0) autoBattle.enemy.attack *= 0.85;
                if (autoBattle.trimp.poisonTime < 10000) autoBattle.trimp.poisonTime = 10000;
                autoBattle.trimp.poisonChance += this.poisonChance();
                autoBattle.trimp.poisonMod += this.poisonMod();
            },
            priceMod: 5.5,
            startPrice: 15000
        },
        Lich_Wraps: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 113,
            description: function () {
                return ("如果怒怒中毒、流血或震荡了，则使它的攻击力+" +
                    prettify(this.attack()) +
                    "，攻击间隔-15%，吸血+" +
                    prettify(this.lifesteal() * 100) +
                    "%，受到的伤害-" +
                    prettify((1 - this.damageTakenMult()) * 100) +
                    "%。");
            },
            upgrade: "每级使怒怒的攻击力+6，吸血+6%，受到的伤害-3%(相互叠乘，最终会逼近75%)",
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
                if (autoBattle.trimp.bleed.time > 0 || autoBattle.trimp.shock.time > 0 || autoBattle.trimp.poison.time > 0) {
                    autoBattle.trimp.damageTakenMult *= this.damageTakenMult();
                    autoBattle.trimp.attack += this.attack();
                    autoBattle.trimp.lifesteal += this.lifesteal();
                    autoBattle.trimp.attackSpeed *= 0.85;
                }
            },
            priceMod: 4,
            startPrice: 25000

        },
        Wired_Wristguards: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 115,
            description: function(){
                return "使怒怒的防御力+" + prettify(this.defense()) + "，触发震荡的概率+" + prettify(this.shockChance()) + "%，震荡伤害+" + prettify(this.shockMod() * 100) + "%，所有抗性+50%。如果敌人震荡了，则使它的攻击间隔+" + prettify((this.enemySpeed() - 1) * 100) + "%。";
            },
            upgrade: "每级使怒怒的防御力+3，触发震荡的概率+15%，震荡伤害+15%，敌人的攻击间隔+2%",
            defense: function(){
                return 7 + (3 * this.level);
            },
            shockChance: function(){
                return 25 + (15 * this.level);
            },
            shockMod: function(){
                return 0.25 + (0.15 * this.level);
            },
            enemySpeed: function(){
                return 1.18 + (0.02 * this.level);
            },
            doStuff: function(){
                autoBattle.trimp.defense += this.defense();
                autoBattle.trimp.shockChance += this.shockChance();
                autoBattle.trimp.shockMod += this.shockMod();
                autoBattle.trimp.shockResist += 50;
                autoBattle.trimp.poisonResist += 50;
                autoBattle.trimp.bleedResist += 50;
                if (autoBattle.enemy.shock.time > 0){
                    autoBattle.enemy.attackSpeed *= this.enemySpeed();
                }
            },
            startPrice: 44000,
            priceMod: 4.5
        },

        Sword_and_Board: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 120,
            description: function(){
                return "使怒怒的攻击力+" + prettify(this.attack()) + "，防御力+" + prettify(this.defense()) + "，生命值+" + prettify(this.health()) + "，所有抗性+" + prettify(this.resists()) + "%。";
            },
            upgrade: "每级使怒怒的攻击力+5，防御力+4，生命值+50，所有抗性+10%",
            attack: function(){
                return 10 + (5 * this.level);
            },
            defense: function(){
                return 6 + (4 * this.level);
            },
            health: function(){
                return 350 + (50 * this.level);
            },
            resists: function(){
                return 10 + (10 * this.level);
            },
            doStuff: function(){
                autoBattle.trimp.attack += this.attack();
                autoBattle.trimp.defense += this.defense();
                autoBattle.trimp.maxHealth += this.health();
                var resists = this.resists();
                autoBattle.trimp.shockResist += resists;
                autoBattle.trimp.poisonResist += resists;
                autoBattle.trimp.bleedResist += resists;
            },
            priceMod: 5,
            startPrice: 90000
        },
        Bilious_Boots: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 122,
            description: function(){
                return "使怒怒的中毒伤害+" + prettify(this.poisonMod()) + "，中毒可以多叠加1层，生命值+" + prettify(this.health()) + "，所有抗性+" + prettify(this.resists()) + "%。";
            },
            upgrade: "每级使怒怒的中毒伤害+3，生命值+50，所有抗性+10%",
            poisonMod: function(){
                return 7 + (3 * this.level);
            },
            health: function(){
                return 150 + (50 * this.level);
            },
            resists: function(){
                return 10 + (10 * this.level);
            },
            doStuff: function(){
                var resists = this.resists();
                autoBattle.trimp.shockResist += resists;
                autoBattle.trimp.poisonResist += resists;
                autoBattle.trimp.bleedResist += resists;
                autoBattle.trimp.poisonMod += this.poisonMod();
                autoBattle.trimp.maxHealth += this.health();
                autoBattle.trimp.poisonStack++;
            },
            priceMod: 5,
            startPrice: 100000
        },
        Bloodstained_Gloves: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 123,
            description: function(){
                return "使怒怒触发流血的概率+" + prettify(this.bleedChance()) + "%，攻击力+" + prettify(this.attack()) + "。使敌人的攻击间隔-25%，攻击力-25%。每次怒怒或敌人触发流血时，使怒怒的攻击进度条填充" + prettify(this.barFill() * 100) + "%。";
            },
            upgrade: "每级使怒怒触发流血的概率+5%，攻击力+2，攻击进度条多填充5%(最高为160%)",
            attack: function () {
                return 6 + this.level * 2;
            },
            onBleed: function () {
                autoBattle.trimp.lastAttack += autoBattle.trimp.attackSpeed * this.barFill();
            },
            bleedChance: function(){
                return 25 + (5 * this.level);
            },
            barFill: function () {
                var fill = 0.2 + 0.05 * this.level;
                if (fill > 1.6)
                    fill = 1.6;
                return fill;
            },
            doStuff: function(){
                autoBattle.trimp.bleedChance += this.bleedChance();
                autoBattle.enemy.attackSpeed *= 0.75;
                autoBattle.enemy.attack *= 0.75;
                autoBattle.trimp.attack += this.attack();
            },
            startPrice: 160000
        },
        Unlucky_Coin: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 125,
            description: function(){
                return "使怒怒的攻击力+" + prettify(this.attack()) + "。如果敌人未中毒和流血，则使怒怒的吸血+" + prettify(this.lifesteal() * 100) + "%。";
            },
            upgrade: "每级使怒怒的攻击力+4，吸血+10%",
            attack: function(){
                return 11 + (this.level * 4);
            },
            lifesteal: function(){
                return 0.2 + (this.level * .1);
            },
            doStuff: function(){
                autoBattle.trimp.attack += this.attack();
                if (autoBattle.enemy.bleed.time <= 0 && autoBattle.enemy.poison.time <= 0) {
                    autoBattle.trimp.lifesteal += this.lifesteal();
                }
            },
            priceMod: 5,
            startPrice: 400000
        },
        Eelimp_in_a_Bottle: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 130,
            description: function(){
                return "使怒怒触发震荡的概率+" + prettify(this.shockChance()) + "%，震荡伤害+" + prettify(this.shockMod() * 100) + "%，震荡抗性+" + prettify(this.shockResist()) + "%。如果敌人震荡了，则使怒怒的攻击间隔-" + prettify((1 - this.attackSpeed()) * 100) + "%。每次怒怒触发震荡时，使敌人的攻击进度条归零。每当怒怒对同一个敌人触发震荡时，使怒怒的攻击力+" + prettify(this.attack()) + "(最高为10次)。";
            },
            upgrade: "每级使怒怒触发震荡的概率+5%，震荡伤害+5%，震荡抗性+5%，攻击间隔-5%，攻击力多+1",
            attackSpeed: function(){
                return 0.9 * Math.pow(0.95, this.level);
            },
            shockChance: function(){
                return 35 + (5 * this.level);
            },
            shockMod: function(){
                return .65 + (.1 * this.level);
            },
            shockResist: function(){
                return 10 + (5 * this.level);
            },
            attack: function(){
                return 2 + this.level;
            },
            doStuff: function(){
                autoBattle.trimp.shockMod += this.shockMod();
                autoBattle.trimp.shockChance += this.shockChance();
                if (autoBattle.enemy.shock.time >= 0)
                    autoBattle.trimp.attackSpeed *= this.attackSpeed();
                autoBattle.trimp.attack += Math.min(10, autoBattle.enemy.shock.count) * this.attack();
                autoBattle.trimp.shockResist += this.shockResist();
            },
            priceMod: 5,
            startPrice: 1000000
        },        
        Big_Cleaver: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 133,
            description: function(){
                return "可以使敌人流血，持续10秒。如果敌人的生命值全满，则使怒怒触发流血的概率+100%，否则使怒怒触发流血的概率+25%。如果敌人流血了，则使怒怒的攻击力+" + prettify(this.attack()) + "。使怒怒的流血伤害+" + prettify(this.bleedMod() * 100) + "%，生命值+" + prettify(this.health()) + "。";
            },
            upgrade: "每级使怒怒的攻击力+2，流血伤害+25%，生命值+100",
            attack: function(){
                return 30 + (this.level * 2);
            },
            bleedMod: function(){
                return 1 + (0.25 * this.level);
            },
            health: function(){
                return 500 + (100 * this.level);
            },
            doStuff: function(){
                if (autoBattle.enemy.health == autoBattle.enemy.maxHealth) autoBattle.trimp.bleedChance += 100;
                else autoBattle.trimp.bleedChance += 25;
                autoBattle.trimp.maxHealth += this.health();
                if (autoBattle.enemy.bleed.time > 0) autoBattle.trimp.attack += this.attack();
                autoBattle.trimp.bleedMod += this.bleedMod();
                if (autoBattle.trimp.bleedTime <= 10000) autoBattle.trimp.bleedTime = 10000;
            },
            priceMod: 4,
            startPrice: 3000000
        },
        The_Globulator: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 135,
            description: function(){
                return "如果敌人中毒了，则使怒怒的防御力+" + prettify(this.defense()) + "，生命值+" + prettify(this.health()) + "。如果该敌人从未有中毒失效过，则怒怒触发中毒时，使您恢复该物品一半生命值数值的生命值。如果该敌人的中毒层数达到上限，则使非吸血的生命值恢复手段恢复的怒怒生命值翻倍。使怒怒的中毒伤害+" + prettify(this.poisonMod()) + "。"
            },
            upgrade: "每级使怒怒的防御力+5，生命值+500，中毒伤害+10",
            defense: function(){
                return 25 + (5 * this.level);
            },
            health: function(){
                return 500 + (500 * this.level);
            },
            poisonMod: function(){
                return 15 + (10 * this.level);
            },
            onPoisonStack: function(stacks){
                if (stacks == 1) autoBattle.trimp.maxHealth += this.health();
                if (autoBattle.enemy.poison.expired) return;
                autoBattle.trimp.health += (this.health() / 2);
                if (autoBattle.trimp.health > autoBattle.trimp.maxHealth) autoBattle.trimp.health = autoBattle.trimp.maxHealth;
            },
            doStuff: function(){
                if (autoBattle.enemy.poison.time > 0){
                    autoBattle.trimp.maxHealth += this.health();
                    autoBattle.trimp.defense += this.defense();
                }
                autoBattle.trimp.poisonMod += this.poisonMod();
            },
            startPrice: 5e6,
            priceMod: 10
        },
        Metal_Suit: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 138,
            description: function () {
                return ("使怒怒的防御力+" +
                    prettify(this.defense()) +
                    "，生命值+" +
                    prettify(this.health()) +
                    "，流血抗性+" +
                    prettify(this.resist()) +
                    "%。如果怒怒装备了可以使敌人流血的物品，则使怒怒的攻击力+" +
                    prettify(this.attack()) +
                    "。");
            },
            upgrade: "每级使怒怒的防御力+30，生命值+1000，流血抗性+20%，攻击力+5",
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
                if (autoBattle.items.Rusty_Dagger.equipped || autoBattle.items.Big_Cleaver.equipped)
                    autoBattle.trimp.attack += this.attack();
                autoBattle.trimp.maxHealth += this.health();
                autoBattle.trimp.defense += this.defense();
                autoBattle.trimp.bleedResist += this.resist();
            },
            priceMod: 10,
            startPrice: 6e6
        },
        Nozzled_Goggles: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 140,
            description: function(){
                return "使敌人常时震荡，至少多受到" + prettify(this.shockMod() * 100) + "%伤害。使怒怒的生命值+" + prettify(this.health()) + "，中毒抗性+" + prettify(this.resist()) +  "%，中毒可以多叠加3层。";
            },
            upgrade: "每级使被常时震荡的敌人受到的伤害+20%。每级使怒怒的生命值+1000，中毒抗性+20%",
            shockMod: function(){
                return (0.2 * this.level);
            },
            health: function(){
                return (-500 + (this.level * 1000));
            },
            resist: function(){
                return (20 * this.level);
            },
            doStuff: function(){
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
            priceMod: 10
        },
        Sundering_Scythe: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 143,
            description: function(){
                return "使怒怒的攻击间隔-" + prettify((1 - this.attackTime()) * 100) + "%，攻击力+" + prettify(this.attack()) + "，生命值+" + prettify(this.health()) + "，吸血+" + prettify(this.lifesteal() * 100) + "%。使怒怒触发的震荡最多持续10秒，触发的流血在持续时间低于5秒时可以重新触发。";
            },
            upgrade: "每级使怒怒的攻击间隔-5%，攻击力+5，生命值+250，吸血+5%",
            attackTime: function(){
                return 0.842 * Math.pow(0.95, this.level);
            },
            attack: function(){
                return 15 + (5 * this.level);
            },
            health: function(){
                return 500 + (250 * this.level);
            },
            lifesteal: function(){
                return 0.15 + (0.05 * this.level);
            },
            doStuff: function(){
                autoBattle.trimp.attackSpeed *= this.attackTime();
                autoBattle.trimp.attack += this.attack();
                autoBattle.trimp.maxHealth += this.health();
                autoBattle.trimp.lifesteal += this.lifesteal();
            },
            startPrice: 15e6,
            priceMod: 10
        },
        //Shank 145
        Plague_Bringer: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 148,
            description: function(){
                return "使怒怒的中毒触发速度+" + prettify((1 - this.tickMult()) * 100) + "%。敌人每有1%的流血或震荡抗性，就使怒怒的中毒伤害+" + prettify(this.eachPoison()) + "。当怒怒触发中毒造成伤害时，每层中毒使怒怒的生命值恢复" + prettify(this.healAmt()) + "。" 
            },
            upgrade: "每级使怒怒的中毒触发速度+2%，中毒伤害+0.05，每层中毒生命值多恢复5",
            tickMult: function(){
                return 0.816 * Math.pow(0.98, this.level);
            },
            eachPoison: function(){
                return 0.05 + (0.05 * this.level);
            },
            healAmt: function(){
                return 5 + (5 * this.level);
            },
            poisonMod: function(){
                var res = autoBattle.enemy.bleedResist + autoBattle.enemy.shockResist;
                return Math.floor(res * this.eachPoison());
            },
            doStuff: function(){
                autoBattle.trimp.poisonMod += this.poisonMod();
                autoBattle.trimp.poisonTick *= this.tickMult();
                autoBattle.trimp.poisonHeal += this.healAmt();
            },
            startPrice: 70e6,
            priceMod: 10
        },
        Very_Large_Slime: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 150,
            description: function(){
                return "可以使敌人中毒，持续20秒。使怒怒触发中毒的概率+" + prettify(this.poisonChance()) + "%，中毒伤害+" + prettify(this.poisonMod()) + "，防御力+" + prettify(this.defense()) + "，生命值+" + prettify(this.health()) + "。每当怒怒对同一个中毒层数达到上限的敌人进行3次攻击，将使中毒层数的上限再+1层(层数上限最多+" + prettify(this.maxStacks()) + "层)。"; 
            },
            upgrade: "每级使怒怒触发中毒的概率+15%，中毒伤害+20，防御力+50，生命值+500，中毒层数的上限+2层",
            poisonChance: function(){
                return 35 + (15 * this.level);
            },
            poisonMod: function(){
                return 10 + (20 * this.level);
            },
            defense: function(){
                return 50 + (50 * this.level);
            },
            health: function(){
                return 500 + (500 * this.level);
            },
            maxStacks: function(){
                return 8 + (this.level * 2);
            },
            doStuff: function(){
                autoBattle.trimp.poisonChance += this.poisonChance();
                autoBattle.trimp.poisonMod += this.poisonMod();
                if (autoBattle.trimp.poisonTime < 20000) autoBattle.trimp.poisonTime = 20000;
                autoBattle.trimp.defense += this.defense();
                autoBattle.trimp.maxHealth += this.health();
                autoBattle.trimp.poisonStack += Math.min(this.maxStacks(), Math.floor(autoBattle.enemy.poison.hitsAtMax / 3));
            },
            startPrice: 100e6,
            priceMod: 10
        },
        //Monkimp Paw, 155
        Grounded_Crown: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 160,
            description: function(){
                return "使怒怒的攻击力+" + prettify(this.attack()) + "，震荡伤害+" + prettify(this.shockMod() * 100) + "%，防御力+" + prettify(this.defense()) + "，生命值+" + prettify(this.health()) + "。如果敌人中毒或流血了，则怒怒每秒失去上限20%的生命值。";
            },
            upgrade: "每级使怒怒的攻击力+50，震荡伤害+50%，防御力+50，生命值+1000",
            attack: function(){
                return 50 + (50 * this.level);
            },
            shockMod: function(){
                return 0.5 + (0.5 * this.level);
            },
            defense: function(){
                return (50 * this.level);
            },
            health: function(){
                return 500 + (1000 * this.level);
            },
            afterCheck: function () {
                if (autoBattle.enemy.poison.time > 0 || autoBattle.enemy.bleed.time > 0) {
                    var mod = 20 / autoBattle.frameTime;
                    autoBattle.trimp.health -= autoBattle.trimp.maxHealth * mod * autoBattle.trimp.damageTakenMult;
                    if (autoBattle.trimp.health < 0.01)
                        autoBattle.trimp.health = 0;
                }
            },
            doStuff: function(){
                
                autoBattle.trimp.attack += this.attack();
                autoBattle.trimp.shockMod += this.shockMod();
                autoBattle.trimp.defense += this.defense();
                autoBattle.trimp.maxHealth += this.health();
            },
            startPrice: 650e6,
            priceMod: 10
        },
        Fearsome_Piercer: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 165,
            description: function () {
                return ("使怒怒的攻击力+" +
                    prettify(this.attack()) +
                    "，吸血+" +
                    prettify(this.lifesteal() * 100) +
                    "%，流血伤害+" +
                    prettify(this.bleedMod() * 100) +
                    "%，触发流血的概率+" +
                    prettify(this.bleedChance()) +
                    "%。如果怒怒装备了可以使敌人流血的物品，则使敌人在进入战斗前生命值上限-25%。");
            },
            upgrade: "每级使怒怒的攻击力+75，吸血+10%，流血伤害+75%，触发流血的概率+50%",
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
                    autoBattle.items.Bag_of_Nails.equipped ||
                    autoBattle.items.Doppelganger_Diadem.equipped) {
                    autoBattle.enemy.baseHealth *= 0.75;
                    autoBattle.enemy.maxHealth *= 0.75;
                    autoBattle.enemy.health = autoBattle.enemy.maxHealth;
                }
            },
            doStuff: function(){
                autoBattle.trimp.attack += this.attack();
                autoBattle.trimp.lifesteal += this.lifesteal();
                autoBattle.trimp.bleedMod += this.bleedMod();
                autoBattle.trimp.bleedChance += this.bleedChance();
            },
            startPrice: 1.5e9,
            priceMod: 10
        },
        Bag_of_Nails: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 168,
            startPrice: 2.7e9,
            priceMod: 10,
            description: function(){
                return "可以使敌人流血，持续10秒。使怒怒的减速气场无效。当敌人流血时，使它们的攻击力-25%。使怒怒的攻击力+" + prettify(this.attack()) + "，流血伤害+" + prettify(this.bleedMod() * 100) + "%，生命值+" + prettify(this.health()) + "。"
            },
            upgrade: "每级使怒怒的攻击力+100，流血伤害+75%，生命值+500",
            attack: function(){
                return 150 + (this.level * 100);
            },
            bleedMod: function(){
                return 1.25 + (0.75 * this.level);
            },
            health: function(){
                return 500 + (500 * this.level);
            },
            doStuff: function(){
                if (autoBattle.enemy.bleed.time > 0){
                    autoBattle.enemy.attack *= 0.75;
                    autoBattle.enemy.noSlow = true;
                }
                else autoBattle.enemy.noSlow = false;
                autoBattle.trimp.attack += this.attack();
                autoBattle.trimp.bleedMod += this.bleedMod();
                autoBattle.trimp.maxHealth += this.health();
                if (autoBattle.trimp.bleedTime <= 10000) autoBattle.trimp.bleedTime = 10000;
            }
        },
        Blessed_Protector: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 170,
            description: function(){
                return "使怒怒的生命值+" + prettify(this.health()) + "，防御力+" + prettify(this.defense()) + "，吸血+" + prettify(this.lifesteal() * 100) + "%。怒怒每失去1%生命值，就使它的攻击力+0.5%。当怒怒的生命值低于50%时，使它受到的伤害-30%。" 
            },
            upgrade: "每级使怒怒的生命值+1000，防御力+100，吸血+25%",
            health: function(){
                return 1000 + (1000 * this.level);
            },
            defense: function(){
                return 100 + (100 * this.level);
            },
            lifesteal: function(){
                return 0.25 + (0.25 * this.level);
            },
            afterCheck: function () {
                if (autoBattle.trimp.health <= 0)
                    return;
                var healthPct = autoBattle.trimp.health / autoBattle.trimp.maxHealth;
                if (healthPct < 0.5){
                    autoBattle.trimp.damageTakenMult *= 0.7;
                }
                if (healthPct < 1){
                    var boost = (1 - healthPct);
                    boost = (1 + (boost * 0.5));
                    autoBattle.trimp.attack *= boost;
                }
            },
            doStuff: function(){
                autoBattle.trimp.maxHealth += this.health();
                autoBattle.trimp.defense += this.defense();
                autoBattle.trimp.lifesteal += this.lifesteal();
            },
            startPrice: 4e9,
            priceMod: 10
        },
        The_Doomspring:{
            description: function(){
                var stack = prettify((1 - this.attackTime()) * 100);
                return "使怒怒的生命值+" + prettify(this.health()) + "，攻击间隔-" + stack + "%。每当怒怒在与同一个敌人战斗中受到15000伤害，就使怒怒的攻击间隔-" + stack + "%。最高可以减少" + this.stacks() + "次。";
            },
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 180,
            upgrade: "每级使怒怒的生命值+1500，攻击间隔-5%，最高可以减少的次数多1次",
            attackTime: function(){
                return 0.842 * Math.pow(0.95, this.level);
            },
            health: function(){
                return 1500 + (1500 * this.level);
            },
            stacks: function(){
                return 2 + this.level;
            },
            doStuff: function(){
                var stacks = Math.floor(autoBattle.trimp.dmgTaken / 15000) + 1;
                var maxStacks = this.stacks();
                if (stacks > maxStacks) stacks = maxStacks;
                autoBattle.trimp.attackSpeed *= Math.pow(this.attackTime(), stacks);
                autoBattle.trimp.maxHealth += this.health();
            },
            dustType: "shards",
            startPrice: 22,
            priceMod: 15
        },
        Snimp__Fanged_Blade: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 185,
            description: function(){
                return "使怒怒的攻击力+" + prettify(this.attack()) + "，中毒层数的上限+" + this.poisonStack() + "。如果敌人中毒了，则使怒怒的流血伤害+" + prettify(this.bleedMod() * 100) + "%。如果敌人流血了，则使怒怒的中毒伤害+" + prettify(this.poisonMod()) + "。";
            },
            upgrade: "每级使怒怒的攻击力+250，中毒层数的上限+5，流血伤害+200%，中毒伤害+250",
            attack: function(){
                return 250 + (250 * this.level);
            },
            poisonMod: function(){
                return 250 * this.level;
            },
            bleedMod: function(){
                return 1 + (2 * this.level);
            },
            poisonStack: function(){
                return 5 * this.level;
            },
            doStuff: function(){
                autoBattle.trimp.attack += this.attack();
                autoBattle.trimp.poisonStack += this.poisonStack();
                if (autoBattle.enemy.poison.time > 0) autoBattle.trimp.bleedMod += this.bleedMod();
                if (autoBattle.enemy.bleed.time > 0) autoBattle.trimp.poisonMod += this.poisonMod();
            },
            dustType: "shards",
            startPrice: 159,
            priceMod: 15
        },
        //Dopp signet 190
        Wrath_Crafted_Hatchet:{
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 195,
            description: function(){
                return "使怒怒的攻击力+" + prettify(this.attack()) + "，生命值+" + prettify(this.health()) + "，防御力+" + prettify(this.defense()) + "，攻击间隔-" + prettify((1 - this.attackTime()) * 100) + "%。";
            },
            upgrade: "每级使怒怒的攻击力+750，生命值+2000，防御力+200，攻击间隔-5%",
            attack: function(){
                return 1250 + (750 * this.level);
            },
            attackTime: function(){
                return 0.842 * Math.pow(0.95, this.level);
            },
            health: function(){
                return 2000 + (2000 * this.level);
            },
            defense: function(){
                return 200 + (200 * this.level);
            },
            doStuff: function(){
                autoBattle.trimp.attack += this.attack();
                autoBattle.trimp.maxHealth += this.health();
                autoBattle.trimp.attackSpeed *= this.attackTime();
                autoBattle.trimp.defense += this.defense();
            },
            dustType: "shards",
            startPrice: 400,
            priceMod: 15
        },
        //basket of souls 200
        Goo_Golem: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 205,
            description: function(){
                return "使怒怒的生命值+" + prettify(this.health()) + "，中毒伤害+" + prettify(this.poisonMod()) + "，中毒层数的上限+" + prettify(this.poisonStack()) + "。如果敌人中毒了，则将怒怒受到的伤害存至魔像中，使怒怒每秒受到伤害，该伤害的数值为魔像存储总伤害的10%。";
            },
            upgrade: "每级使怒怒的生命值+1000，中毒伤害+400，中毒层数的上限+5",
            health: function(){
                return 2000 + (1000 * this.level);
            },
            poisonMod: function(){
                return 400 * this.level;
            },
            poisonStack: function(){
                return 5 + (5 * this.level);
            },
            active: function(){
                if (this.equipped && autoBattle.enemy.poison.time > 0) return true;
                return false;
            },
            doStuff: function(){
                autoBattle.trimp.maxHealth += this.health();
                autoBattle.trimp.poisonMod += this.poisonMod();
                autoBattle.trimp.poisonStack += this.poisonStack();
                if (autoBattle.battleTime > autoBattle.trimp.lastGoo + 1000){     
                    if (autoBattle.trimp.lastGoo == -1) autoBattle.trimp.lastGoo = autoBattle.battleTime;
                    else autoBattle.trimp.lastGoo += 1000;
                    var dmg = autoBattle.trimp.gooStored * 0.1;
                    autoBattle.trimp.gooStored -= dmg;
                    autoBattle.damageCreature(autoBattle.trimp, dmg, true);
                }
            },
            dustType: "shards",
            startPrice: 2500,
            priceMod: 15
        },
        Omni_Enhancer: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 210,
            description: function(){
                return "使怒怒的攻击力+" + prettify(this.attack()) + "，流血伤害+" + prettify(this.bleedMod() * 100) + "%，震荡伤害+" + prettify(this.shockMod() * 100) + "%，中毒伤害+" + prettify(this.poisonMod()) + "，中毒层数叠加数+1，中毒触发速度+10%。";
            },
            upgrade: "每级使怒怒的攻击力+2500，流血伤害+300%，震荡伤害+300%，中毒伤害+1000",
            attack: function(){
                return 2500 + (2500 * this.level);
            },
            bleedMod: function(){
                return 4 + (3 * this.level);
            },
            shockMod: function(){
                return 4 + (3 * this.level);
            },
            poisonMod: function(){
                return (1000 * this.level);
            },
            doStuff: function(){
                autoBattle.trimp.attack += this.attack();
                autoBattle.trimp.bleedMod += this.bleedMod();
                autoBattle.trimp.shockMod += this.shockMod();
                autoBattle.trimp.poisonMod += this.poisonMod();
                autoBattle.trimp.poisonTick *= 0.9;
                autoBattle.trimp.poisonRate++;
            },
            dustType: "shards",
            startPrice: 6300,
            priceMod: 15
        },
        //stormbringer 215
        Box_of_Spores: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 220,
            description: function () {
                return "如果击杀敌人时它中毒了，且从未有流血生效过，则多掉落" + this.dustMult() + "倍魔尘。";
            },
            upgrade: "每级使敌人多掉落1倍魔尘",
            dustMult: function(){
                return 4 + this.level;
            },
            dustType: "shards",
            startPrice: 60000,
            priceMod: 15
        },
        //nullifium armor 225
        //Myco Mitts 230
        Haunted_Harpoon: { 
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 235,
            description: function(){
                return "使怒怒的生命值+" + prettify(this.health()) + "。如果敌人流血了，且至少经过5秒，则使怒怒的攻击力+" + prettify(this.attack()) + "，且敌人每秒额外受到流血伤害" + prettify(this.bleedTickMult() * 100) + "%数值的伤害。"
            },
            upgrade: "每级使怒怒的攻击力+10000，生命值+5000，每秒额外受到流血伤害的数值再+100%",
            health: function(){
                return 5000 + (5000 * this.level);
            },
            bleedTickMult: function(){
                return 9 + this.level;
            },
            attack: function(){
                return 15000 + (10000 * this.level);
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
            priceMod: 20
        },
        //Dopp Diadem 250
        //Final calc items
        //After all shock resist
        Stormbringer: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 215,
            description: function(){
                return "敌人的震荡抗性归零，但流血抗性增加相应的数值。使怒怒的震荡伤害+" + prettify(this.shockMod() * 100) + "%，中毒伤害+" + prettify(this.poisonMod()) + "。";
            },
            upgrade: "每级使怒怒的震荡伤害+500%，中毒伤害+5000",
            shockMod: function(){
                return 10 + (5 * this.level);
            },
            poisonMod: function(){
                return 5000 + (5000 * this.level);
            },
            doStuff: function(){
                autoBattle.enemy.bleedResist += autoBattle.enemy.shockResist;
                autoBattle.enemy.shockResist = 0;
                autoBattle.trimp.shockMod += this.shockMod();
                autoBattle.trimp.poisonMod += this.poisonMod();
            },
            dustType: "shards",
            startPrice: 20000,
            priceMod: 15
        },
        Bad_Medkit: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 84,
            description: function () {
                return ("其他物品触发流血时，流血至少持续" +
                    this.bleedTime() +
                    "秒。使怒怒触发流血的概率+" +
                    prettify(this.bleedChance()) +
                    "%。如果敌人流血了，则使怒怒的吸血+" +
                    prettify(this.lifesteal() * 100) +
                    "%。");
            },
            upgrade: "每级使敌人的流血持续时间+1秒，怒怒触发流血的概率+4%，怒怒的吸血+2.5%",
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
                if (autoBattle.trimp.bleedTime > 0 && autoBattle.trimp.bleedTime < this.bleedTime() * 1000)
                    autoBattle.trimp.bleedTime = this.bleedTime() * 1000;
                if (autoBattle.enemy.bleed.time > 0)
                    autoBattle.trimp.lifesteal += this.lifesteal();
                autoBattle.trimp.bleedChance += this.bleedChance();
            },
            startPrice: 300
        },
        Putrid_Pouch: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 78,
            description: function(){
                return "如果敌人中毒了，则使怒怒的攻击间隔-10%，防御力+" + prettify(this.defense()) + "。其他物品触发中毒时，中毒至少持续" + prettify(this.poisonTime() / 1000) + "秒。使怒怒触发中毒的概率+" + prettify(this.poisonChance()) + "%。";
            },
            upgrade: "每级使敌人的中毒持续时间+1秒，怒怒触发中毒的概率+6%，怒怒的防御力+3",
            poisonTime: function(){
                return 19000 + (this.level * 1000);
            },
            poisonChance: function(){
                return 14 + (this.level * 6);
            },
            defense: function(){
                return 7 + (3 * this.level);
            },
            doStuff: function(){
                if (autoBattle.enemy.poison.time > 0){
                    autoBattle.trimp.attackSpeed *= 0.9;
                    autoBattle.trimp.defense += this.defense();
                }
                var poisonTime = this.poisonTime();
                if (autoBattle.trimp.poisonTime > 0 && autoBattle.trimp.poisonTime < poisonTime)
                    autoBattle.trimp.poisonTime = poisonTime;
                autoBattle.trimp.poisonChance += this.poisonChance();
            },
            startPrice: 150,
            priceMod: 4
        },
        Raincoat: { //After all bleed chance
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 75,
            description: function(){
                return "如果怒怒有概率触发流血，则使怒怒的防御力+" + prettify(this.defense()) + "，生命值+" + prettify(this.health()) + "，吸血+" + prettify(this.lifesteal() * 100) + "%，流血伤害+" + prettify(this.bleedDamage() * 100) + "%。";
            },
            upgrade: "每级使怒怒的防御力+2，生命值+20，吸血+2.5%，流血伤害+10%",
            defense: function(){
                return 4 + (this.level * 2);
            },
            health: function(){
                return 20 + (20 * this.level);
            },
            lifesteal: function(){
                return 0.125 + (0.025 * this.level)
            },
            bleedDamage: function(){
                return 0.2 + (0.1 * this.level);
            },
            doStuff: function(){
                var bleedChance = autoBattle.trimp.bleedChance;
                if (autoBattle.items.Sacrificial_Shank.equipped)
                    bleedChance = Math.floor(bleedChance * 0.75);
                if (bleedChance > autoBattle.enemy.bleedResist &&
                    (autoBattle.trimp.bleedTime > 0 || autoBattle.items.Doppelganger_Diadem.equipped) &&
                    autoBattle.trimp.bleedMod > 0) {
                    autoBattle.trimp.defense += this.defense();
                    autoBattle.trimp.maxHealth += this.health();
                    autoBattle.trimp.lifesteal += this.lifesteal();
                    autoBattle.trimp.bleedMod += this.bleedDamage();
                }
            },
            startPrice: 100,
            priceMod: 4
        },
        Labcoat: { //after all poison chance
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 90,
            description: function(){
                return "如果怒怒有概率触发中毒，则使怒怒的生命值+" + prettify(this.health()) + "，攻击间隔-" + prettify((1 - this.attackTime()) * 100) + "%，中毒伤害+" + prettify(this.poisonMod()) + "。";
            },
            upgrade: "每级使怒怒的生命值+25，攻击间隔-1%，中毒伤害+1",
            health: function(){
                return 25 + (25 * this.level);
            },
            attackTime: function(){
                return Math.pow(0.99, this.level);
            },
            poisonMod: function(){
                return 1 + this.level;
            },
            doStuff: function(){
                var poisonChance = autoBattle.trimp.poisonChance;
                if (autoBattle.items.Sacrificial_Shank.equipped) poisonChance = Math.floor(poisonChance * 0.75);
                if (poisonChance > autoBattle.enemy.poisonResist && autoBattle.trimp.poisonMod > 0 && autoBattle.trimp.poisonTime > 0){
                    autoBattle.trimp.maxHealth += this.health();
                    autoBattle.trimp.attackSpeed *= this.attackTime();
                    autoBattle.trimp.poisonMod += this.poisonMod();
                }
            },
            startPrice: 1500,
            priceMod: 4.5
        },
        Aegis: { //after all health
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 118,
            description: function(){
                return "使怒怒的防御力+" + this.defenseEffect() + "。如果怒怒的生命值与生命值上限的比例高于敌人，则使怒怒触发震荡的概率+" + prettify(this.shockChance()) + "%，怒怒的震荡伤害+" + prettify(this.shockMod() * 100) + "%，震荡至少持续15秒。否则使该物品的防御力翻倍，怒怒的吸血+" + prettify(this.lifestealEffect() * 100) + "%。";
            },
            upgrade: "每级使怒怒的防御力+4，触发震荡的概率+10%，震荡伤害+10%，吸血+10%",
            defenseEffect: function(){
                return 6 + (4 * this.level);
            },
            shockChance: function(){
                return 15 + (10 * this.level);
            },
            shockMod: function(){
                return 0.15 + (0.1 * this.level);
            },
            lifestealEffect: function(){
                return 0.05 + (0.1 * this.level);
            },
            doStuff: function(){
                var hufPct = autoBattle.trimp.health / autoBattle.trimp.maxHealth;
                var enemyPct = autoBattle.enemy.health / autoBattle.enemy.maxHealth;
                if (hufPct > enemyPct){
                    autoBattle.trimp.shockChance += this.shockChance();
                    autoBattle.trimp.shockMod += this.shockMod();
                    if (autoBattle.trimp.shockTime < 15000) autoBattle.trimp.shockTime = 15000;
                    autoBattle.trimp.defense += this.defenseEffect();
                }
                else{
                    autoBattle.trimp.lifesteal += this.lifestealEffect();
                    autoBattle.trimp.defense += (this.defenseEffect() * 2);
                }
            },
            priceMod: 8,
            startPrice: 65000,
        },
        Sacrificial_Shank: { //after all status chances
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 145,
            enemyReduced: 0,
            description: function () {
                return ("使怒怒和敌人(在计算抗性之前)触发概率最高的异常状态，其触发概率变为原来的0.75倍。每因此使怒怒或敌人减少10%的触发概率，就使怒怒的攻击间隔-" +
                    prettify((1 - this.attackTime()) * 100) +
                    "%，所有抗性+" +
                    prettify(this.resist()) +
                    "%，吸血+" +
                    prettify(this.lifesteal() * 100) +
                    "%。");
            },
            upgrade: "每因该物品使怒怒或敌人减少10%的触发概率，每级就使怒怒的攻击间隔-1%，所有抗性+1%，吸血+1%",
            attackTime: function () {
                return Math.pow(0.99, this.level);
            },
            resist: function(){
                return (1 * this.level);
            },
            lifesteal: function(){
                return (0.01 * this.level);
            },
            onEnemy: function(){
                var toReduce = ["poisonChance", "bleedChance", "shockChance"];
                var totalReduce = 0;
                var highestElem = "";
                var highestChance = 0;
                for (var x = 0; x < toReduce.length; x++){
                    var name = toReduce[x];
                    if (autoBattle.enemy[name] > highestChance) {
                        highestChance = autoBattle.enemy[name];
                        highestElem = name;
                    }
                }
                var thisReduce = autoBattle.enemy[highestElem] * 0.25;
                if (thisReduce > 0){
                    autoBattle.enemy[highestElem] -= thisReduce;
                    totalReduce += thisReduce;
                }
                this.enemyReduced = totalReduce;
            },
            doStuff: function(){
                var toReduce = ["poisonChance", "bleedChance", "shockChance"];
                var totalReduce = this.enemyReduced;
                var highestElem = "";
                var highestChance = 0;
                for (var x = 0; x < toReduce.length; x++){
                    var name = toReduce[x];
                    if (autoBattle.trimp[name] > highestChance) {
                        highestChance = autoBattle.trimp[name];
                        highestElem = name;
                    }
                }
                var thisReduce = autoBattle.trimp[highestElem] * 0.25;
                if (thisReduce > 0){
                    autoBattle.trimp[highestElem] -= thisReduce;
                    totalReduce += thisReduce;
                }
                totalReduce = Math.floor(totalReduce / 10);
                if (totalReduce <= 0) return;
                autoBattle.trimp.attackSpeed *= Math.pow(this.attackTime(), totalReduce);
                autoBattle.trimp.lifesteal += (this.lifesteal() * totalReduce);
                autoBattle.trimp.poisonResist += (this.resist() * totalReduce);
                autoBattle.trimp.bleedResist += (this.resist() * totalReduce);
                autoBattle.trimp.shockResist += (this.resist() * totalReduce);
            },
            startPrice: 2500000,
            priceMod: 4
        },
        Basket_of_Souls: { //after all additive lifesteal and health (before monkimp)
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 200,
            description: function(){
                return "使怒怒的生命值+" + prettify(this.health()) + "，防御力+" + prettify(this.defense()) + "，吸血+" + prettify(this.lifesteal() * 100) + "%，流血伤害+" + prettify(this.bleedMod() * 100) + "%，震荡伤害+" + prettify(this.shockMod() * 100) + "%。使怒怒的生命值上限变为它吸血数值的倍数，然后使它的吸血减半。"
            },
            upgrade: "每级使怒怒的生命值+1000，防御力+300，吸血+100%，流血伤害+200%，震荡伤害+200%",
            health: function(){
                return 2000 + (1000 * this.level);
            },
            defense: function(){
                return 300 + (200 * this.level);
            },
            lifesteal: function(){
                return 2 + (this.level);
            },
            bleedMod: function(){
                return 3 + (2 * this.level);
            },
            shockMod: function(){
                return 3 + (2 * this.level);
            },
            doStuff: function(){
                autoBattle.trimp.maxHealth += this.health();
                autoBattle.trimp.defense += this.defense();
                autoBattle.trimp.lifesteal += this.lifesteal();
                autoBattle.trimp.bleedMod += this.bleedMod();
                autoBattle.trimp.shockMod += this.shockMod();
                if (autoBattle.items.Monkimp_Paw.equipped) autoBattle.trimp.lifesteal *= 0.75; //monkimp paw special interaction
                autoBattle.trimp.maxHealth *= autoBattle.trimp.lifesteal;
                autoBattle.trimp.lifesteal *= 0.5;
            },
            dustType: "shards",
            startPrice: 1000,
            priceMod: 15
            
        },
        Monkimp_Paw: { //after basket of souls
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 155,
            description: function () {
                return "使怒怒的攻击力+" + prettify(this.attack()) + "，使怒怒的吸血减少为原来的75%。";
            },
            upgrade: "每级使怒怒的攻击力+100",
            attack: function(){
                return (100 * this.level);
            },
            doStuff: function(){
                autoBattle.trimp.attack += this.attack();
                if (!autoBattle.items.Basket_of_Souls.equipped) autoBattle.trimp.lifesteal *= 0.75; //basket of souls special interaction
                if (autoBattle.trimp.lifesteal < 0) autoBattle.trimp.lifesteal = 0;
            },
            startPrice: 200e6,
            priceMod: 10
        },
        Spiked_Gloves: { //after all attack
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 108,
            description: function(){
                return "使怒怒的攻击力+" + this.formatEffect() + "%。";
            },
            upgrade: "每级使怒怒的攻击力+5%",
            formatEffect: function(){
                return prettify(this.effect() * 100);
            },
            effect: function(){
                return .2 + (0.05 * this.level);
            },
            doStuff: function(){
                autoBattle.trimp.attack *= (1 + this.effect());
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
            description: function(){
            return "使怒怒的生命值+" + prettify((this.statMult() -1) * 100) + "%，攻击力+" + prettify((this.statMult() -1) * 100) + "%。如果敌人未中毒，则使怒怒的吸血+" + prettify(this.lifesteal() * 100) + "%。";
            },
            upgrade: "每级使怒怒的生命值、攻击力和吸血+50%",
            statMult: function(){
                return 4.5 + (this.level * 0.5);
            },
            lifesteal: function(){
                return 1.5 + (this.level * 0.5);
            },
            doStuff: function(){
                if (autoBattle.enemy.poison.time <= 0) autoBattle.trimp.lifesteal += this.lifesteal();
                autoBattle.trimp.maxHealth *= this.statMult();
                autoBattle.trimp.attack *= this.statMult();
            },
            dustType: "shards",
            startPrice: 200000,
            priceMod: 20
        },
        Doppelganger_Diadem: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 250,
            description: function () {
                return "可以使敌人流血，持续10秒。如果怒怒装备了分身纹章，则使攻击力翻倍，如果分身存在，再使攻击力翻倍。使分身的生命值+50%，且每次战斗中可以复活一次。";
            },
            doStuff: function () {
                if (autoBattle.trimp.bleedTime <= 10000)
                    autoBattle.trimp.bleedTime = 10000;
                if (autoBattle.items.Doppelganger_Signet.equipped) {
                    autoBattle.trimp.attack *= 2;
                    if (!autoBattle.trimp.doppDown)
                        autoBattle.trimp.attack *= 2;
                    if (typeof autoBattle.trimp.doppLives === "undefined")
                        autoBattle.trimp.doppLives = 1;
                }
            },
            noUpgrade: true,
            dustType: "shards",
        },
        Doppelganger_Signet: {
            //actual final attack item
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 190,
            longText: true,
            description: function(){
                return "召唤一个分身，在分身存在期间，使怒怒受到的伤害-50%，攻击力翻倍，且中毒层数叠加数+1。分身会在受到等于生命值上限的伤害或可以击杀敌人时爆炸，对敌人造成伤害，该伤害的数值为本次战斗怒怒造成的伤害，并使敌人的防御力-50%。";
            },
            onDeath: function(){
                var damageDealt = autoBattle.enemy.dmgTaken;
                autoBattle.damageCreature(autoBattle.enemy, damageDealt, false, true);
                autoBattle.enemy.defense *= 0.5;
                if (autoBattle.trimp.doppLives)
                    autoBattle.trimp.doppLives--;
                else
                    autoBattle.trimp.doppDown = true;
            },
            doppHealth: function () {
                var healthAmt = autoBattle.trimp.maxHealth;
                if (autoBattle.items.Doppelganger_Diadem.equipped) {
                    healthAmt *= 1.5;
                    if (!autoBattle.trimp.doppLives)
                        healthAmt *= 2;
                }
                return healthAmt;
            },
            explodeDmg: function () {
                var damageAmt = autoBattle.enemy.dmgTaken;
                if (autoBattle.items.Doppelganger_Diadem.equipped && autoBattle.trimp.doppLives == 1)
                    damageAmt *= 3;
                return damageAmt;
            },
            doStuff: function(){
                if (autoBattle.trimp.doppDown) return;
                autoBattle.trimp.attack *= 2;
                autoBattle.trimp.damageTakenMult *= 0.5;
                autoBattle.trimp.poisonRate++;
                if (autoBattle.trimp.dmgTaken >= this.doppHealth() || this.explodeDmg() >= autoBattle.enemy.health)
                    this.onDeath();
            },
            noUpgrade: true,
            dustType: "shards"
        },
        //Final Poison Damage item
        Myco_Mitts: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 230,
            description: function () {
                return "使怒怒触发中毒时造成的伤害变为" + this.poisonMult() + "倍。";
            },
            upgrade: "每级使触发中毒时造成的伤害倍率+1",
            poisonMult: function(){
                return 2 + this.level;
            },
            doStuff: function(){
                autoBattle.trimp.poisonMod *= this.poisonMult();
            },
            startPrice: 5e5,
            priceMod: 20,
            dustType: "shards",
        },
        Gaseous_Greataxe: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 260,
            dustMult: function () {
                var mult = 0.75 + (this.level - 1) * 0.01;
                if (mult > 1)
                    mult = 1;
                return mult;
            },
            description: function () {
                return ("使怒怒的中毒伤害乘以流血伤害和震荡伤害中较高者的数值。使中毒层数叠加数翻倍。使怒怒触发的中毒可以多叠加" +
                    prettify(this.maxStacks()) +
                    "层。每10秒再使中毒层数的上限增加该层数的10%，并使中毒伤害+10%(相互叠乘)。使魔尘和晶块的获取量-" +
                    Math.round((1 - this.dustMult()) * 100) +
                    "%。");
            },
            upgrade: "每级使该装备怒怒触发的中毒可以多叠加的层数+20%(相互叠乘)，获取量减少的数值-1%",
            maxStacks: function () {
                return Math.floor(100 * Math.pow(1.2, this.level - 1));
            },
            doStuff: function () {
                var higherMod = autoBattle.trimp.shockMod > autoBattle.trimp.bleedMod
                    ? autoBattle.trimp.shockMod
                    : autoBattle.trimp.bleedMod;
                if (higherMod < 1)
                    higherMod = 1;
                autoBattle.trimp.poisonMod *= higherMod;
                var timeStacks = Math.floor(autoBattle.battleTime / 10000);
                autoBattle.trimp.poisonMod *= Math.pow(1.1, timeStacks);
                autoBattle.trimp.poisonStack += Math.floor(this.maxStacks() * ((timeStacks + 10) * 0.1));
                autoBattle.trimp.poisonRate *= 2;
            },
            dustType: "shards",
            startPrice: 1e10,
            priceMod: 20,
        },
        The_Fibrillator: {
            owned: false,
            equipped: false,
            hidden: false,
            level: 1,
            zone: 270,
            description: function () {
                return ("使怒怒的攻击力和中毒伤害变为" +
                    prettify(this.shockMod()) +
                    "倍。当前敌人单次震荡中每经过10秒，就使该物品的攻击力和中毒伤害加成倍率+" +
                    prettify(this.shockMod() - 1) +
                    "。使怒怒触发的震荡最少持续30秒(效果优先级高于撕裂之镰)。使怒怒的生命值变为" +
                    prettify(this.healthMod()) +
                    "倍。");
            },
            upgrade: "每级使攻击力和中毒伤害加成倍率增加的数值+0.05，怒怒的生命值倍率+0.25倍",
            shockMod: function () {
                return 1.1 + (this.level - 1) * 0.05;
            },
            healthMod: function () {
                return 2 + (this.level - 1) * 0.25;
            },
            doStuff: function () {
                autoBattle.trimp.maxHealth *= this.healthMod();
                var shockSeconds = 0;
                if (autoBattle.enemy.shock.time > 0) {
                    shockSeconds = (autoBattle.battleTime - autoBattle.enemy.shock.timeApplied) / 1000;
                    shockSeconds = Math.floor(shockSeconds / 10);
                    var shockMod = this.shockMod();
                    var toAdd = (shockMod - 1) * shockSeconds;
                    toAdd += shockMod;
                    autoBattle.trimp.attack *= toAdd;
                    autoBattle.trimp.poisonMod *= toAdd;
                }
            },
            dustType: "shards",
            startPrice: 1e12,
            priceMod: 20,
        },
    },
    bonuses: {
        Extra_Limbs: {
            description: function () {
                return "Huffy can equip 1 additional item.<br/><br/>";
            },
            level: 0,
            price: 100,
            priceMod: 100,
        },
        Radon: {
            description: function () {
                return "Increase all Radon earned by +10% per level.<br/>";
            },
            getMult: function () {
                return 1 + this.level * 0.1;
            },
            level: 0,
            price: 30000,
            priceMod: 3,
            max: 50,
        },
        Stats: {
            description: function () {
                return "Increases Attack and Health in U2 by +10% per level.<br/>";
            },
            getMult: function () {
                return 1 + this.level * 0.1;
            },
            level: 0,
            price: 20000,
            priceMod: 3,
            max: 50,
        },
        Scaffolding: {
            description: function () {
                return "Each level adds +100% Housing and increases the bonus of all other Scaffolds by 10%.";
            },
            getMult: function () {
                return 1 + this.level * Math.pow(1.1, this.level - 1);
            },
            level: 0,
            price: 50,
            useShards: true,
            priceMod: 10,
            max: 18,
        },
    },
    oneTimers: {
        Gathermate: {
            get description() {
                return "Gather 5% more Food, Wood, and Metal in U2 for each Spire Assault level cleared.";
            },
            owned: false,
            getMult: function () {
                return 1 + 0.05 * (autoBattle.maxEnemyLevel - 1);
            },
            requiredItems: 7,
        },
        Smithriffic: {
            description: "Get an extra Smithy when completing Melting Point.",
            owned: false,
            requiredItems: 11,
        },
        Championism: {
            description: "Unlock a new Perk!",
            owned: false,
            onPurchase: function () {
                game.portal.Championism.radLocked = false;
            },
            requiredItems: 15,
        },
        Master_of_Arms: {
            description: "使怒怒的生命值增加200，攻击力增加10，中毒伤害增加2。",
            owned: false,
            requiredItems: 19,
        },
        Artisan: {
            get description() {
                return ("All U2 Equipment costs 1% less for each SA level cleared. (Currently " +
                    prettify((1 - this.getMult()) * 100) +
                    "% cheaper)");
            },
            owned: false,
            getMult: function () {
                return Math.pow(0.99, autoBattle.maxEnemyLevel - 1);
            },
            requiredItems: 21,
        },
        Battlescruff: {
            description: "Increases all Scruffy XP gained by +2% for each Spire Assault level cleared.",
            owned: false,
            requiredItems: 23,
        },
        Collectology: {
            description: "Collectors add 2 Hubs each PLUS another extra Hub for every 30 Spire Assault levels cleared.",
            owned: false,
            requiredItems: 28,
            getHubs: function () {
                return 2 + Math.floor((autoBattle.maxEnemyLevel - 1) / 30);
            },
        },
        Dusty_Tome: {
            description: "每通过1级尖塔突击，就使魔尘的获取量增加5%。",
            owned: false,
            requiredItems: 32,
        },
        Whirlwind_of_Arms: {
            description: "使怒怒的生命值增加1000，攻击力增加25，中毒伤害增加10。",
            owned: false,
            requiredItems: 34,
        },
        Nullicious: {
            description: "Increase the base Nu value of U2 Heirlooms by 0.5% per Spire Assault level cleared.",
            owned: false,
            requiredItems: 36,
            getMult: function () {
                return 1 + (autoBattle.maxEnemyLevel - 1) * 0.005;
            },
        },
        Suprism: {
            description: "Increases Prismatic Shield by 3% per Spire Assault level cleared.",
            getMult: function () {
                return (autoBattle.maxEnemyLevel - 1) * 0.03;
            },
            owned: false,
            requiredItems: 39,
        },
        The_Ring: {
            description: "Unlock The Ring.",
            owned: false,
            requiredItems: 42,
            useShards: true,
            onPurchase: function () {
                document.getElementById("autoBattleRingBtn").style.display = "inline-block";
            },
        },
        Mass_Hysteria: {
            description: "Frenzy is always active.",
            owned: false,
            requiredItems: 45,
            useShards: true,
        },
        Burstier: {
            description: "Gamma Burst requires 1 fewer attack before triggering.",
            owned: false,
            requiredItems: 48,
            useShards: true,
        },
        Expanding_Tauntimp: {
            description: "Starting after your next Portal, U2 Tauntimps will increase all Trimps gained by " +
                "prettify(game.badGuys.Tauntimp.expandingBase() * 100) " +
                "% per run instead of adding flat housing.",
            owned: false,
            requiredItems: 51,
            useShards: true,
        },
        More_Expansion: {
            description: "Unlock the Expansion Perk, further increasing the power of your Tauntimps",
            owned: false,
            requiredItems: 53,
            owned: false,
            useShards: true,
            onPurchase: function () {
                game.portal.Expansion.radLocked = false;
            },
        },
    },
    fight: function () {
        if (!this.trimp || !this.enemy)
            this.resetCombat();
        this.enemy.lastAttack += this.frameTime;
        this.trimp.lastAttack += this.frameTime;
        this.enemy.maxHealth = this.enemy.baseHealth;
        this.trimp.maxHealth = this.trimp.baseHealth;
        this.enemy.attackSpeed = this.enemy.baseAttackSpeed;
        this.trimp.attackSpeed = this.trimp.baseAttackSpeed;
        this.trimp.attack = this.trimp.baseAttack;
        this.enemy.attack = this.enemy.baseAttack;
        this.trimp.shockChance = 0;
        this.trimp.shockMod = 0;
        this.trimp.shockTime = 0;
        this.trimp.bleedChance = 0;
        this.trimp.bleedMod = 0;
        this.trimp.bleedTime = 0;
        this.trimp.poisonChance = 0;
        this.trimp.poisonTime = 0;
        this.trimp.poisonMod = 0;
        this.trimp.poisonStack = 2;
        this.trimp.poisonTick = 1000;
        this.trimp.poisonHeal = 0;
        this.trimp.poisonRate = 1;
        this.trimp.shockResist = 0;
        this.trimp.poisonResist = 0;
        this.trimp.bleedResist = 0;
        this.trimp.defense = 0;
        this.trimp.lifesteal = 0;
        this.trimp.damageTakenMult = 1;
        this.trimp.slowAura = 1;
        this.trimp.dustMult = 0;
        this.checkItems();
        if (this.enemy.immune != "") {
            this.trimp[this.enemy.immune + "Chance"] = 0;
        }
        var trimpAttackTime = this.trimp.attackSpeed;
        if (this.trimp.lastAttack >= trimpAttackTime) {
            this.trimp.lastAttack -= trimpAttackTime;
            this.attack(this.trimp, this.enemy);
        }
        this.checkPoison(this.trimp);
        if (this.trimp.bleed.time > 0)
            this.trimp.bleed.time -= this.frameTime;
        if (this.trimp.shock.time > 0)
            this.trimp.shock.time -= this.frameTime;
        if (this.enemy.health <= 0) {
            this.enemyDied();
            return;
        }
        if (this.trimp.health <= 0) {
            this.trimpDied();
            return;
        }
        if (!this.enemy.noSlow)
            this.enemy.attackSpeed *= this.trimp.slowAura;
        var enemyAttackTime = this.enemy.attackSpeed;
        if (this.enemy.lastAttack >= enemyAttackTime) {
            this.enemy.lastAttack -= enemyAttackTime;
            this.attack(this.enemy, this.trimp);
        }
        if (this.enemy.explodeFreq != -1) {
            this.enemy.lastExplode += this.frameTime;
            if (this.enemy.lastExplode >= this.enemy.explodeFreq) {
                this.enemy.lastExplode -= this.enemy.explodeFreq;
                var dmg = this.enemy.explodeDamage * this.getAttack(this.enemy) - this.trimp.defense;
                this.damageCreature(this.trimp, dmg);
            }
        }
        this.checkPoison(this.enemy);
        if (this.enemy.bleed.time > 0)
            this.enemy.bleed.time -= this.frameTime;
        if (this.enemy.shock.time > 0 && this.enemy.shock.time != 9999999)
            this.enemy.shock.time -= this.frameTime;
        if (this.trimp.health > this.trimp.maxHealth)
            this.trimp.health = this.trimp.maxHealth;
        if (this.enemy.health > this.enemy.maxHealth)
            this.enemy.health = this.enemy.maxHealth;
        if (this.trimp.health <= 0) {
            this.trimpDied();
            return;
        }
        if (this.enemy.health <= 0) {
            this.enemyDied();
            return;
        }
    },
    checkItems: function () {
        if (this.oneTimers.Master_of_Arms.owned) {
            this.trimp.maxHealth += 200;
            this.trimp.attack += 10;
            this.trimp.poisonMod += 2;
        }
        if (this.oneTimers.Whirlwind_of_Arms.owned) {
            this.trimp.maxHealth += 1000;
            this.trimp.attack += 25;
            this.trimp.poisonMod += 10;
        }
        for (var x = 0; x < this.rings.mods.length; x++) {
            var modObj = this.ringStats[this.rings.mods[x]];
            modObj.doStuff(this.getRingStatAmt(modObj));
        }
        var ringDmg = this.getRingStatusDamage();
        if (ringDmg > 0) {
            ringDmg /= 100;
            this.trimp.bleedMod += ringDmg;
            this.trimp.shockMod += ringDmg;
            this.trimp.poisonMod += this.getRingPoisonDamage();
        }
        var ringChance = this.getRingStatusChance();
        if (ringChance > 0) {
            this.trimp.bleedChance += ringChance;
            this.trimp.shockChance += ringChance;
            this.trimp.poisonChance += ringChance;
        }
        for (var item in this.items) {
            var itemObj = this.items[item];
            if (!itemObj.equipped)
                continue;
            if (itemObj.doStuff)
                itemObj.doStuff();
        }
        if (this.items.Sundering_Scythe.equipped && this.trimp.shockTime > 10000)
            this.trimp.shockTime = 10000;
        if (this.items.The_Fibrillator.equipped && this.trimp.shockTime > 0 && this.trimp.shockTime < 30000)
            this.trimp.shockTime = 30000;
        if (this.items.Blessed_Protector.equipped)
            this.items.Blessed_Protector.afterCheck(); //after anything that might hurt huffy
        if (this.items.Grounded_Crown.equipped)
            this.items.Grounded_Crown.afterCheck(); //just deals damage
        if (this.items.Haunted_Harpoon.equipped)
            this.items.Haunted_Harpoon.afterCheck(); //after anything that might increase the damage of huffy's bleeds
        this.trimp.attackSpeed *= this.enemy.slowAura;
        if (this.trimp.attackSpeed <= 500) {
            this.trimp.slowAura += (500 - this.trimp.attackSpeed) / 1000;
            this.trimp.attackSpeed = 500;
        }
    },
    damageCreature: function (creature, dmg, fromGoo, ignoreEth) {
        dmg *= creature.damageTakenMult;
        if (creature.isEthereal && !ignoreEth)
            creature.health += dmg;
        else {
            if (!fromGoo && creature.isTrimp && this.items.Goo_Golem.equipped && this.items.Goo_Golem.active()) {
                creature.gooStored += dmg;
            }
            else {
                creature.health -= dmg;
                creature.dmgTaken += dmg;
            }
        }
        return dmg;
    },
    checkPoison: function (creature) {
        var opponent = creature.isTrimp ? this.enemy : this.trimp;
        if (creature.poison.time > 0) {
            creature.poison.lastTick += this.frameTime;
            var tickTime = opponent.poisonTick;
            if (creature.poison.lastTick >= tickTime) {
                var shockMod = 1;
                if (creature.shock.time > 0) {
                    shockMod += creature.shock.mod;
                }
                creature.poison.lastTick -= tickTime;
                creature.poison.time -= tickTime;
                var dmg = creature.poison.mod * creature.poison.stacks * shockMod;
                dmg = this.damageCreature(creature, dmg);
                if (opponent.poisonHeal) {
                    var healFor = opponent.poisonHeal * creature.poison.stacks;
                    if (this.items.The_Globulator.equipped)
                        healFor *= 2;
                    this.trimp.health += healFor;
                    if (this.trimp.health > this.trimp.maxHealth)
                        this.trimp.health = this.trimp.maxHealth;
                }
                if (creature.poison.time <= 0) {
                    creature.poison.time = 0;
                    creature.poison.mod = 0;
                    creature.poison.lastTick = 0;
                    creature.poison.stacks = 0;
                    creature.poison.expired = true;
                    creature.poison.hitsAtMax = 0;
                }
            }
        }
    },
    getAttack: function (fighterObj) {
        if (fighterObj.isTrimp)
            return fighterObj.attack;
        return fighterObj.attack * this.getEnrageMult() * this.getBerserkMult();
    },
    getBerserkMult: function () {
        if (this.enemy.berserkMod == -1)
            return 1;
        return Math.pow(this.enemy.berserkMod, Math.floor(this.enemy.berserkStack / this.enemy.berserkEvery));
    },
    rollDamage: function (attacker) {
        var baseAttack = this.getAttack(attacker);
        var attack = baseAttack * 0.2;
        var roll = Math.floor(Math.random() * 201);
        roll -= 100;
        roll /= 100;
        return baseAttack + attack * roll;
    },
    attack: function (attacker, defender) {
        var damage = this.rollDamage(attacker);
        var shockMod = 1;
        if (defender.shock.time > 0) {
            shockMod = 1 + defender.shock.mod;
            damage *= shockMod;
        }
        damage -= defender.defense;
        if (damage < 0)
            damage = 0;
        damage = this.damageCreature(defender, damage);
        var atkLifesteal = attacker.lifesteal - defender.lifestealResist;
        if (atkLifesteal > 0) {
            attacker.health += damage * atkLifesteal;
            if (attacker.health > attacker.maxHealth)
                attacker.health = attacker.maxHealth;
        }
        if (attacker.bleed.time > 0) {
            var bdamage = this.getBleedDamage(attacker, defender);
            bdamage = this.damageCreature(attacker, bdamage);
            var defLifesteal = defender.lifesteal - attacker.lifestealResist;
            if (defLifesteal > 0) {
                var healAmt = bdamage * defLifesteal;
                if (defender.isTrimp && this.items.Recycler.equipped)
                    healAmt *= 2;
                defender.health += healAmt;
                if (defender.health > defender.maxHealth)
                    defender.health = defender.maxHealth;
            }
            if (attacker.bleed.time <= 0) {
                attacker.bleed.time = 0;
                attacker.bleed.mod = 0;
            }
        }
        var bleedChance = attacker.bleedChance - defender.bleedResist;
        if (bleedChance > 0 &&
            attacker.bleedMod > 0 &&
            attacker.bleedTime > 0 &&
            (defender.bleed.time <= 0 || (this.items.Sundering_Scythe.equipped && defender.bleed.time <= 5000))) {
            var roll = Math.floor(Math.random() * 100);
            if (roll < bleedChance) {
                if (this.items.Bloodstained_Gloves.equipped)
                    this.items.Bloodstained_Gloves.onBleed();
                if (this.items.Bag_of_Nails.equipped)
                    this.enemy.noSlow = true;
                if (defender.bleed.mod < attacker.bleedMod)
                    defender.bleed.mod = 1 + attacker.bleedMod;
                if (defender.bleed.time < attacker.bleedTime)
                    defender.bleed.time = attacker.bleedTime;
                if (defender.bleed.time > 0)
                    defender.hadBleed = true;
            }
        }
        var poisonChance = attacker.poisonChance - defender.poisonResist;
        if (poisonChance > 0 && attacker.poisonMod > 0 && attacker.poisonTime > 0) {
            var roll = Math.floor(Math.random() * 100);
            if (roll < poisonChance) {
                if (defender.poison.time < attacker.poisonTime)
                    defender.poison.time = attacker.poisonTime;
                var stackRate = attacker.poisonRate;
                for (var x = 0; x < stackRate; x++) {
                    defender.poison.mod = attacker.poisonMod;
                    if (defender.poison.stacks < attacker.poisonStack) {
                        defender.poison.stacks++;
                        if (attacker.isTrimp && this.items.The_Globulator.equipped)
                            this.items.The_Globulator.onPoisonStack(defender.poison.stacks);
                    }
                    else
                        defender.poison.hitsAtMax++;
                }
            }
        }
        var shockChance = attacker.shockChance - defender.shockResist;
        if (shockChance > 0 &&
            attacker.shockMod > 0 &&
            attacker.shockTime > 0 &&
            (defender.shock.time <= 0 || (defender.shock.time == 9999999 && attacker.shockMod > defender.shock.mod))) {
            var roll = Math.floor(Math.random() * 100);
            if (roll < shockChance) {
                if (attacker.isTrimp && this.items.Eelimp_in_a_Bottle.equipped)
                    defender.lastAttack = 0;
                defender.shock.time = attacker.shockTime;
                defender.shock.timeApplied = autoBattle.battleTime;
                defender.shock.mod = attacker.shockMod;
                defender.shock.count++;
            }
        }
        if (attacker.berserkMod != -1)
            attacker.berserkStack++;
        if (attacker.ethChance > 0) {
            var ethRoll = Math.floor(Math.random() * 100);
            if (ethRoll < attacker.ethChance)
                attacker.isEthereal = true;
            else
                attacker.isEthereal = false;
        }
    },
    getBleedDamage: function (attacker, defender) {
        var attackerShock = 1;
        if (attacker.shock.time > 0) {
            attackerShock = 1 + attacker.shock.mod;
        }
        var bdamage = this.getAttack(defender) * attacker.bleed.mod * attackerShock;
        bdamage -= attacker.defense;
        return bdamage;
    },
    resetCombat: function (resetStats) {
        this.trimp = this.template();
        this.trimp.isTrimp = true;
        this.enemy = this.template();
        this.battleTime = 0;
        this.checkItems();
        this.trimp.health = this.trimp.maxHealth;
        this.enemy.level = this.enemyLevel;
        var atkSpdLevel = Math.min(this.enemyLevel, 29);
        this.enemy.baseAttackSpeed *= Math.pow(0.98, atkSpdLevel);
        if (this.enemyLevel >= 30) {
            atkSpdLevel = this.enemyLevel - 29;
            this.enemy.slowAura = Math.pow(1.01, atkSpdLevel);
        }
        this.enemy.baseHealth *= Math.pow(1.205, this.enemyLevel);
        this.enemy.baseAttack += 2 * (this.enemyLevel - 1);
        this.enemy.baseAttack *= Math.pow(1.04, this.enemyLevel);
        if (this.enemyLevel >= 50) {
            var newLev = this.enemyLevel - 49;
            this.enemy.baseHealth *= Math.pow(1.1, newLev);
            this.enemy.baseAttack *= Math.pow(1.1, newLev);
        }
        this.enemy.defense += 0.5 * this.enemyLevel;
        this.enemy.poisonResist += this.enemyLevel;
        this.enemy.bleedResist += this.enemyLevel;
        this.enemy.shockResist += this.enemyLevel;
        if (this.enemyLevel >= 15)
            this.enemy.lifestealResist += 0.03 * (this.enemy.level - 14);
        if (this.enemyLevel >= 30)
            this.enemy.enrageMult = 1.5;
        this.setProfile();
        this.enemy.maxHealth = this.enemy.baseHealth;
        this.enemy.health = this.enemy.baseHealth;
        if (this.items.Fearsome_Piercer.equipped)
            this.items.Fearsome_Piercer.onEnemy();
        if (this.items.Sacrificial_Shank.equipped)
            this.items.Sacrificial_Shank.onEnemy();
        this.fight();
        if (resetStats)
            this.resetStats();
    },
    setProfile: function () {
        this.profile = "";
        if (this.enemyLevel == 1)
            return;
        var seed = this.seed;
        seed += 100 * this.enemyLevel;
        if (this.enemyLevel >= 51)
            seed += 3125; //Generated with Shold brain RNG
        var doubleResist = true;
        if (this.enemyLevel > 50) {
            doubleResist = getRandomIntSeeded(seed++, 0, 100);
            doubleResist = doubleResist < 20;
        }
        if (this.enemyLevel <= 50)
            doubleResist = true;
        var effects = ["Healthy", "Fast", "Strong", "Defensive"];
        if (this.enemyLevel > 5) {
            effects.push("Poisoning", "Bloodletting", "Shocking", "Lifestealing");
        }
        if (this.enemyLevel > 10) {
            effects.push("Poison Resistant", "Shock Resistant", "Bleed Resistant");
        }
        if (this.enemyLevel > 20) {
            effects.push("Enraging");
        }
        if (this.enemyLevel > 50) {
            effects.push("Explosive", "Berserking", "Slowing", "Ethereal");
        }
        var effectsCount;
        if (this.enemyLevel < 25)
            effectsCount = Math.ceil((this.enemyLevel + 1) / 5);
        else
            effectsCount = 4 + Math.ceil((this.enemyLevel - 19) / 10);
        var selectedEffects = [];
        var selectedEffectsCount = [];
        var maxEffectStack = 1;
        maxEffectStack += Math.floor(this.enemyLevel / 10);
        var healthMult = 1;
        var attackMult = 1;
        for (var x = 0; x < effectsCount; x++) {
            var roll = getRandomIntSeeded(seed++, 0, effects.length);
            var effect = effects[roll];
            if (x == 0 && this.enemyLevel > 150) {
                var immunities = ["Poison Immune", "Shock Immune", "Bleed Immune"];
                effect = immunities[(this.enemyLevel - 151) % 3];
            }
            if (!doubleResist && effect.search("Resistant") != -1) {
                var offset = this.enemyLevel % 3;
                roll = getRandomIntSeeded(seed++, 0, 100);
                if (roll >= 40) {
                    if (offset == 0)
                        effect = "Poison Resistant";
                    if (offset == 1)
                        effect = "Shock Resistant";
                    if (offset == 2)
                        effect = "Bleed Resistant";
                }
            }
            var checkSelected = selectedEffects.indexOf(effect);
            if (checkSelected == -1) {
                selectedEffects.push(effect);
                selectedEffectsCount.push(1);
                checkSelected = selectedEffects.length - 1;
            }
            else {
                selectedEffectsCount[checkSelected]++;
            }
            if (selectedEffectsCount[checkSelected] >= maxEffectStack) {
                effects.splice(effects.indexOf(effect), 1);
            }
            var totalStacks = selectedEffectsCount[checkSelected];
            var repeatMod = 1;
            if (totalStacks > 1) {
                repeatMod *= Math.pow(0.5, totalStacks - 1);
            }
            switch (effect) {
                case "Healthy":
                    var mod = this.enemyLevel / 30;
                    healthMult += Math.min(1, mod);
                    if (selectedEffectsCount[checkSelected] >= 4)
                        effects.splice(effects.indexOf(effect), 1);
                    break;
                case "Strong":
                    var mod = this.enemyLevel / 30;
                    attackMult += Math.min(1, mod);
                    if (selectedEffectsCount[checkSelected] >= 4)
                        effects.splice(effects.indexOf(effect), 1);
                    break;
                case "Fast":
                    var mod = Math.pow(0.98, this.enemyLevel);
                    this.enemy.baseAttackSpeed *= Math.max(0.5, mod);
                    if (selectedEffectsCount[checkSelected] >= 2)
                        effects.splice(effects.indexOf(effect), 1);
                    break;
                case "Poisoning":
                    this.enemy.poisonChance += Math.ceil(this.enemyLevel * 3 * repeatMod);
                    this.enemy.poisonMod += Math.ceil((this.enemyLevel / 5) * repeatMod);
                    if (this.enemyLevel >= 30)
                        this.enemy.poisonMod += this.enemyLevel - 29;
                    if (totalStacks == 1)
                        this.enemy.poisonStack += Math.floor(this.enemyLevel / 10);
                    else
                        this.enemy.poisonStack++;
                    this.enemy.poisonTime = 2500 + Math.ceil(this.enemyLevel / 5) * 2500;
                    break;
                case "Bloodletting":
                    this.enemy.bleedChance += Math.ceil(this.enemyLevel * 3 * repeatMod);
                    this.enemy.bleedMod += Math.ceil(Math.min(2, this.enemyLevel / 20) * repeatMod);
                    this.enemy.bleedTime = 8000;
                    break;
                case "Shocking":
                    this.enemy.shockChance += Math.ceil(this.enemyLevel * 3 * repeatMod);
                    this.enemy.shockMod += Math.ceil(Math.min(2.5, this.enemyLevel / 15) * repeatMod);
                    this.enemy.shockTime = 8000;
                    break;
                case "Poison Resistant":
                    this.enemy.poisonResist += 10 * this.enemyLevel;
                    effects.splice(effects.indexOf(effect), 1);
                    if (!doubleResist || selectedEffects.indexOf("Bleed Resistant") != -1)
                        effects.splice(effects.indexOf("Shock Resistant"), 1);
                    if (!doubleResist || selectedEffects.indexOf("Shock Resistant") != -1)
                        effects.splice(effects.indexOf("Bleed Resistant"), 1);
                    break;
                case "Bleed Resistant":
                    this.enemy.bleedResist += 10 * this.enemyLevel;
                    effects.splice(effects.indexOf(effect), 1);
                    if (!doubleResist || selectedEffects.indexOf("Poison Resistant") != -1)
                        effects.splice(effects.indexOf("Shock Resistant"), 1);
                    if (!doubleResist || selectedEffects.indexOf("Shock Resistant") != -1)
                        effects.splice(effects.indexOf("Poison Resistant"), 1);
                    break;
                case "Shock Resistant":
                    this.enemy.shockResist += 10 * this.enemyLevel;
                    effects.splice(effects.indexOf(effect), 1);
                    if (!doubleResist || selectedEffects.indexOf("Bleed Resistant") != -1)
                        effects.splice(effects.indexOf("Poison Resistant"), 1);
                    if (!doubleResist || selectedEffects.indexOf("Poison Resistant") != -1)
                        effects.splice(effects.indexOf("Bleed Resistant"), 1);
                    break;
                case "Poison Immune":
                    this.enemy.immune = "poison";
                    effects.splice(effects.indexOf("Poison Resistant"), 1);
                    break;
                case "Shock Immune":
                    this.enemy.immune = "shock";
                    effects.splice(effects.indexOf("Shock Resistant"), 1);
                    break;
                case "Bleed Immune":
                    this.enemy.immune = "bleed";
                    effects.splice(effects.indexOf("Bleed Resistant"), 1);
                    break;
                case "Defensive":
                    this.enemy.defense += Math.ceil(this.enemy.level * 0.75 * Math.pow(1.05, this.enemy.level));
                    break;
                case "Lifestealing":
                    this.enemy.lifesteal += Math.min(1, this.enemyLevel / 50);
                    break;
                case "Enraging":
                    this.enemy.enrageFreq -= 10;
                    this.enemy.enrageMult += 0.1;
                    if (selectedEffectsCount[checkSelected] >= 2)
                        effects.splice(effects.indexOf(effect), 1);
                    break;
                case "Slowing":
                    this.enemy.slowAura += 0.1;
                    break;
                case "Explosive":
                    var count = selectedEffectsCount[checkSelected];
                    if (count >= 3)
                        effects.splice(effects.indexOf(effect), 1);
                    if (count == 1) {
                        this.enemy.explodeDamage = 1.5;
                        this.enemy.explodeFreq = 20000;
                    }
                    else {
                        this.enemy.explodeDamage += 0.3;
                        this.enemy.explodeFreq -= 5000;
                    }
                    effects.splice(effects.indexOf("Berserking"));
                    effects.splice(effects.indexOf("Ethereal"));
                    break;
                case "Berserking":
                    var count = selectedEffectsCount[checkSelected];
                    if (count >= 3)
                        effects.splice(effects.indexOf(effect), 1);
                    if (count == 1) {
                        this.enemy.berserkMod = 1.05;
                        this.enemy.berserkEvery = 4;
                    }
                    else {
                        this.enemy.berserkMod += 0.05;
                        this.enemy.berserkEvery--;
                    }
                    effects.splice(effects.indexOf("Explosive"));
                    effects.splice(effects.indexOf("Ethereal"));
                    break;
                case "Ethereal":
                    var count = selectedEffectsCount[checkSelected];
                    if (count >= 3)
                        effects.splice(effects.indexOf(effect), 1);
                    if (count == 1) {
                        this.enemy.ethChance = 10;
                    }
                    else {
                        this.enemy.ethChance += 5;
                    }
                    effects.splice(effects.indexOf("Explosive"));
                    effects.splice(effects.indexOf("Berserking"));
                    break;
            }
        }
        this.enemy.baseHealth *= healthMult;
        this.enemy.baseAttack *= attackMult;
        for (var x = 0; x < selectedEffects.length; x++) {
            this.profile += selectedEffects[x];
            if (selectedEffectsCount[x] > 1)
                this.profile += " x" + selectedEffectsCount[x] + "";
            this.profile += ", ";
        }
        this.profile = this.profile.substring(0, this.profile.length - 2);
    },
    trimpDied: function () {
        this.sessionTrimpsKilled++;
        this.lootAvg.counter += this.battleTime;
        this.onTrimpDied(); // notify controller
        this.resetCombat();
    },
    getDustMult: function () {
        var amt = 1;
        if (this.items.Lifegiving_Gem.equipped) {
            amt *= 1 + this.items.Lifegiving_Gem.dustIncrease();
        }
        if (this.items.Gaseous_Greataxe.equipped) {
            amt *= this.items.Gaseous_Greataxe.dustMult();
        }
        amt += this.trimp.dustMult;
        if (this.oneTimers.Dusty_Tome.owned) {
            amt *= 1 + 0.05 * (this.maxEnemyLevel - 1);
        }
        if (u2Mutations.tree.Dust.purchased) {
            var mutMult = 1.25;
            if (u2Mutations.tree.Dust2.purchased) {
                mutMult += 0.25;
            }
            amt *= mutMult;
        }
        if (this.items.Box_of_Spores.equipped && !this.enemy.hadBleed && this.enemy.poison.time > 0) {
            amt *= this.items.Box_of_Spores.dustMult();
        }
        if (this.scruffyLvl21)
            amt *= 5; //don't even look at this line, just move on
        return amt;
    },
    getEnrageMult: function () {
        var enrages = Math.floor(this.battleTime / (this.enemy.enrageFreq * 1000));
        if (enrages < 1)
            return 1;
        return Math.pow(this.enemy.enrageMult, enrages);
    },
    getDustReward: function () {
        var amt = (1 + (this.enemy.level - 1) * 5) * Math.pow(1.19, this.enemy.level - 1);
        if (this.enemy.level >= 50)
            amt *= Math.pow(1.1, this.enemy.level - 49);
        amt *= this.getDustMult();
        return amt;
    },
    enemyDied: function () {
        //this.notes += "Enemy Died. "
        this.sessionEnemiesKilled++;
        var amt = this.getDustReward();
        this.dust += amt;
        if (this.enemyLevel > 50) {
            this.shardDust += amt;
            if (this.shardDust >= 1e9) {
                var shardAmt = Math.floor(this.shardDust / 1e9);
                this.shards += shardAmt;
                this.shardDust -= 1e9 * shardAmt;
            }
        }
        this.lootAvg.accumulator += amt;
        this.lootAvg.counter += this.battleTime;
        this.onEnemyDied(); // notify controller
        this.resetCombat();
    },
    nextLevelCount: function () {
        if (this.enemyLevel < 20)
            return 10 * this.enemyLevel;
        return 190 + 15 * (this.enemyLevel - 19);
    },
    update: function () {
        this.fight();
        this.battleTime += this.frameTime;
    },
    getDustPs: function () {
        var dps = 0;
        if (this.lootAvg.accumulator == 0) {
            if (!this.enemy)
                return 0;
            if (this.sessionTrimpsKilled > 0)
                return 0;
            if (this.enemy.health >= this.enemy.maxHealth)
                return 0;
            if (this.enemy.health <= 0 || this.trimp.health <= 0)
                return 0;
            var enPct = this.enemy.health / this.enemy.maxHealth;
            var tpPct = this.trimp.health / this.trimp.maxHealth;
            if (enPct > tpPct)
                return 0;
            var reward = this.getDustReward();
            dps = 1000 * ((reward * (1 - enPct)) / this.battleTime);
        }
        else
            dps = 1000 * (this.lootAvg.accumulator / this.lootAvg.counter);
        if (dps < 0.01)
            dps = 0;
        return dps;
    },
    resetStats: function () {
        this.sessionEnemiesKilled = 0;
        this.sessionTrimpsKilled = 0;
        this.lootAvg.accumulator = 0;
        this.lootAvg.counter = 0;
        this.battleTime = 0;
    },
    //popup stuff
    equip: function (item) {
        var itemObj = this.items[item];
        if (!itemObj)
            return;
        itemObj.equipped = !itemObj.equipped;
    },
    countEquippedItems: function () {
        var count = 0;
        for (var ck in this.items) {
            if (this.items[ck].equipped)
                count++;
        }
        return count;
    },
    countOwnedItems: function () {
        var count = 0;
        for (var ck in this.items) {
            if (this.items[ck].owned)
                count++;
        }
        return count;
    },
    getBonusCost: function (what) {
        var bonus = this.bonuses[what];
        return Math.ceil(bonus.price * Math.pow(bonus.priceMod, bonus.level));
    },
    upgradeCost: function (item) {
        var itemObj = this.items[item];
        if (!itemObj)
            return;
        var priceMod = 3;
        if (itemObj.priceMod)
            priceMod = itemObj.priceMod;
        var startPrice = 5;
        if (itemObj.startPrice)
            startPrice = itemObj.startPrice;
        return startPrice * Math.pow(priceMod, itemObj.level - 1);
    },
    upgrade: function (item) {
        var itemObj = this.items[item];
        if (!itemObj)
            return;
        var cost = this.upgradeCost(item);
        var currency = this.items[item].dustType == "shards" ? this.shards : this.dust;
        if (currency < cost)
            return;
        this.saveLastAction("upgrade", item);
        if (this.items[item].dustType == "shards")
            this.shards -= cost;
        else
            this.dust -= cost;
        itemObj.level++;
    },
    getFreshRings: function () {
        return {
            level: 1,
            mods: [],
        };
    },
    getRingStatusDamage: function () {
        if (!this.oneTimers.The_Ring.owned)
            return 0;
        return this.rings.level * 25 * Math.pow(1.5, Math.floor(this.rings.level / 10));
    },
    getRingPoisonDamage: function () {
        if (!this.oneTimers.The_Ring.owned)
            return 0;
        return this.rings.level * 15 * Math.pow(5, Math.floor(this.rings.level / 10));
    },
    getRingStatusChance: function () {
        if (this.rings.level < 10)
            return 0;
        var calcLevel = this.rings.level - 9;
        return calcLevel * 20 * Math.pow(1.25, Math.floor(calcLevel / 10));
    },
    getRingStatAmt: function (modObj) {
        return modObj.baseGain * this.rings.level * Math.pow(modObj.perTen, Math.floor(this.rings.level / 10));
    },
    getRingSlots: function () {
        var amt = Math.floor(this.rings.level / 15) + 1;
        if (amt > 3)
            amt = 3;
        return amt;
    },
    levelRing: function () {
        var cost = this.getRingLevelCost();
        if (this.shards < cost)
            return;
        this.saveLastAction("ring", null, cost);
        this.shards -= cost;
        this.rings.level++;
        var slots = this.getRingSlots();
        if (this.rings.mods.length < slots) {
            var availableMods = this.getAvailableRingMods();
            var randomMod = availableMods[Math.floor(Math.random() * availableMods.length)];
            this.rings.mods.push(randomMod);
        }
    },
    getAvailableRingMods: function () {
        var availableMods = [];
        var keys = Object.keys(autoBattle.ringStats);
        for (var x = 0; x < keys.length; x++) {
            if (this.rings.mods.indexOf(keys[x]) == -1)
                availableMods.push(keys[x]);
        }
        return availableMods;
    },
    changeRing: function (elem, slot, useValue) {
        var availableMods = this.getAvailableRingMods();
        if (!useValue)
            useValue = elem.value;
        if (availableMods.indexOf(useValue) == -1)
            return;
        if (slot > this.getRingSlots() - 1)
            return;
        this.rings.mods[slot] = useValue;
        this.resetCombat();
    },
    getRingLevelCost: function () {
        return Math.ceil(15 * Math.pow(2, this.rings.level));
    },
    ringStats: {
        attack: {
            formatEffect: function (amt) {
                return "+ " + prettify(amt) + " Attack";
            },
            name: "Attack",
            doStuff: function (amt) {
                autoBattle.trimp.attack += amt;
            },
            baseGain: 50,
            perTen: 5,
        },
        health: {
            formatEffect: function (amt) {
                return "+ " + prettify(amt) + " Health";
            },
            name: "Health",
            doStuff: function (amt) {
                autoBattle.trimp.maxHealth += amt;
            },
            baseGain: 200,
            perTen: 5,
        },
        defense: {
            formatEffect: function (amt) {
                return "+ " + prettify(amt) + " Defense";
            },
            name: "Defense",
            doStuff: function (amt) {
                autoBattle.trimp.defense += amt;
            },
            baseGain: 25,
            perTen: 2.5,
        },
        lifesteal: {
            formatEffect: function (amt) {
                return "+ " + prettify(amt) + "% Lifesteal";
            },
            name: "Lifesteal",
            doStuff: function (amt) {
                amt /= 100;
                autoBattle.trimp.lifesteal += amt;
            },
            baseGain: 2.5,
            perTen: 4,
        },
        dustMult: {
            formatEffect: function (amt) {
                return "+ " + prettify(amt) + "% Dust Mult";
            },
            name: "Dust Mult",
            doStuff: function (amt) {
                amt /= 100;
                autoBattle.trimp.dustMult += amt;
            },
            baseGain: 5,
            perTen: 2,
        },
    },
    getCurrencyName: function (item) {
        var curName = this.items[item].dustType ? this.items[item].dustType : "dust";
        return curName.charAt(0).toUpperCase() + curName.slice(1);
    },
    hideMode: false,
    getEffects: function (level) {
        if (level == 1)
            return;
        let seed = this.seed;
        seed += 100 * level;
        if (level >= 51)
            seed += 3125; //Generated with Shold brain RNG
        let doubleResist = true;
        if (level > 50) {
            doubleResist = getRandomIntSeeded(seed++, 0, 100);
            doubleResist = doubleResist < 20;
        }
        if (level <= 50)
            doubleResist = true;
        let effects = ["Healthy", "Fast", "Strong", "Defensive"];
        if (level > 5) {
            effects.push("Poisoning", "Bloodletting", "Shocking", "Lifestealing");
        }
        if (level > 10) {
            effects.push("Poison Resistant", "Shock Resistant", "Bleed Resistant");
        }
        if (level > 20) {
            effects.push("Enraging");
        }
        if (level > 50) {
            effects.push("Explosive", "Berserking", "Slowing", "Ethereal");
        }
        let effectsCount;
        if (level < 25)
            effectsCount = Math.ceil((level + 1) / 5);
        else
            effectsCount = 4 + Math.ceil((level - 19) / 10);
        let selectedEffects = [];
        let selectedEffectsCount = [];
        let maxEffectStack = 1;
        maxEffectStack += Math.floor(level / 10);
        for (let x = 0; x < effectsCount; x++) {
            let roll = getRandomIntSeeded(seed++, 0, effects.length);
            let effect = effects[roll];
            if (x == 0 && this.enemyLevel > 150) {
                var immunities = ["Poison Immune", "Shock Immune", "Bleed Immune"];
                effect = immunities[(this.enemyLevel - 151) % 3];
            }
            if (!doubleResist && effect.search("Resistant") != -1) {
                let offset = level % 3;
                roll = getRandomIntSeeded(seed++, 0, 100);
                if (roll >= 40) {
                    if (offset == 0)
                        effect = "Poison Resistant";
                    if (offset == 1)
                        effect = "Shock Resistant";
                    if (offset == 2)
                        effect = "Bleed Resistant";
                }
            }
            let checkSelected = selectedEffects.indexOf(effect);
            if (checkSelected == -1) {
                selectedEffects.push(effect);
                selectedEffectsCount.push(1);
                checkSelected = selectedEffects.length - 1;
            }
            else {
                selectedEffectsCount[checkSelected]++;
            }
            if (selectedEffectsCount[checkSelected] >= maxEffectStack) {
                effects.splice(effects.indexOf(effect), 1);
            }
            let count;
            switch (effect) {
                case "Healthy":
                    if (selectedEffectsCount[checkSelected] >= 4)
                        effects.splice(effects.indexOf(effect), 1);
                    break;
                case "Strong":
                    if (selectedEffectsCount[checkSelected] >= 4)
                        effects.splice(effects.indexOf(effect), 1);
                    break;
                case "Fast":
                    if (selectedEffectsCount[checkSelected] >= 2)
                        effects.splice(effects.indexOf(effect), 1);
                    break;
                case "Poison Resistant":
                    effects.splice(effects.indexOf(effect), 1);
                    if (!doubleResist || selectedEffects.indexOf("Bleed Resistant") != -1)
                        effects.splice(effects.indexOf("Shock Resistant"), 1);
                    if (!doubleResist || selectedEffects.indexOf("Shock Resistant") != -1)
                        effects.splice(effects.indexOf("Bleed Resistant"), 1);
                    break;
                case "Bleed Resistant":
                    effects.splice(effects.indexOf(effect), 1);
                    if (!doubleResist || selectedEffects.indexOf("Poison Resistant") != -1)
                        effects.splice(effects.indexOf("Shock Resistant"), 1);
                    if (!doubleResist || selectedEffects.indexOf("Shock Resistant") != -1)
                        effects.splice(effects.indexOf("Poison Resistant"), 1);
                    break;
                case "Shock Resistant":
                    effects.splice(effects.indexOf(effect), 1);
                    if (!doubleResist || selectedEffects.indexOf("Bleed Resistant") != -1)
                        effects.splice(effects.indexOf("Poison Resistant"), 1);
                    if (!doubleResist || selectedEffects.indexOf("Poison Resistant") != -1)
                        effects.splice(effects.indexOf("Bleed Resistant"), 1);
                    break;
                case "Poison Immune":
                    effects.splice(effects.indexOf("Poison Resistant"), 1);
                    break;
                case "Shock Immune":
                    effects.splice(effects.indexOf("Shock Resistant"), 1);
                    break;
                case "Bleed Immune":
                    effects.splice(effects.indexOf("Bleed Resistant"), 1);
                    break;
                case "Enraging":
                    if (selectedEffectsCount[checkSelected] >= 2)
                        effects.splice(effects.indexOf(effect), 1);
                    break;
                case "Explosive":
                    count = selectedEffectsCount[checkSelected];
                    if (count >= 3)
                        effects.splice(effects.indexOf(effect), 1);
                    effects.splice(effects.indexOf("Berserking"));
                    effects.splice(effects.indexOf("Ethereal"));
                    break;
                case "Berserking":
                    count = selectedEffectsCount[checkSelected];
                    if (count >= 3)
                        effects.splice(effects.indexOf(effect), 1);
                    effects.splice(effects.indexOf("Explosive"));
                    effects.splice(effects.indexOf("Ethereal"));
                    break;
                case "Ethereal":
                    count = selectedEffectsCount[checkSelected];
                    if (count >= 3)
                        effects.splice(effects.indexOf(effect), 1);
                    effects.splice(effects.indexOf("Explosive"));
                    effects.splice(effects.indexOf("Berserking"));
                    break;
            }
        }
        const profile = new Map();
        for (let x = 0; x < selectedEffects.length; x++) {
            profile.set(selectedEffects[x], selectedEffectsCount[x]);
        }
        return profile;
    },
};
/*
const prettify = (num) => {
    return num.toLocaleString("en-US", {
        maximumSignificantDigits: 4,
        notation: "compact",
        compactDisplay: "short",
    });
};
*/
// Functions from other trimps scripts.
const seededRandom = (seed) => {
    let x = Math.sin(seed++) * 10000;
    return parseFloat((x - Math.floor(x)).toFixed(7));
};
const getRandomIntSeeded = (seed, minIncl, maxExcl) => {
    let toReturn = Math.floor(seededRandom(seed) * (maxExcl - minIncl)) + minIncl;
    return toReturn === maxExcl ? minIncl : toReturn;
};
export function prettify(number) {
    var numberTmp = number;
    if (!isFinite(number))
        return "♾️";
    if (number >= 1000 && number < 10000)
        return Math.floor(number);
    if (number == 0)
        return prettifySub(0);
    if (number < 0)
        return "-" + prettify(-number);
    if (number < 0.005)
        return (+number).toExponential(2);
    var base = Math.floor(Math.log(number) / Math.log(1000));
    if (base <= 0)
        return prettifySub(number);
    var exponent = parseFloat(numberTmp).toExponential(2);
    exponent = exponent.replace("+", "");
    return exponent;
}
function prettifySub(number) {
    number = parseFloat(number);
    var floor = Math.floor(number);
    if (number === floor)
        // number is an integer, just show it as-is
        return number;
    var precision = 3 - floor.toString().length; // use the right number of digits
    return number.toFixed(precision);
}
function needAnS(number) {
    //this will save so many lines if I don't forget about it
    return number == 1 ? "" : "s";
}
