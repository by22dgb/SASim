/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com

*/

var cnItems = {
    _OTHER_: [],
    //#region 主界面
    'Limbs used': '物品装备上限',
    'Max enemy level': '敌人等级上限',
    'Set level': '需模拟的敌人等级',
    'Import save': '导入存档',
    'Reset to save!': '重置为存档的状态！',
    '▶ Run the simulation!\n ': '▶ 开始模拟！',
    '■ Stop!': '■ 停止模拟！',
    'Auto run!\n ': '自动开始模拟！',
    ' Stop after\n ': '模拟次数上限：',
    ' hour(s) or\n ': '小时或',
    ' fight(s)': '次战斗',
    'Build cost': '物品总花费',
    ' dust,\n ': '魔尘，',
    ' shards.': '晶块',
    'Simulation': '模拟情况',
    'Time spent': '花费时间',
    'Time processed': '已模拟时间',
    'Enemies killed': '敌人击杀数',
    'Trimps killed [WR]': '战斗失利数[胜率]',
    'Clearing time': '通过时间',
    'Remaining time': '剩余时间',
    'Game': '游戏内',
    'Dust': '魔尘',
    'Shards': '晶块',
    'Base (use for sheet and stuff': '基础值(用于表格等',
    'Info': '信息',
    'Average fight time': '平均每场战斗时间',
    'Average kill time': '平均击杀时间',
    'Average enemy health left': '敌人平均剩余生命值',
    'Average enemy health left on loses': '失利时敌人平均剩余生命值',
    'Best fight': '最佳战斗结果',
    'Any of the below buttons might take a while to\n                                run!': '以下计算可能需要花费一定时间！',
    'Less random Ethereal!': '实际模拟空灵(而非随机模拟)！',
    'Best upgrades!': '最佳升级',
    'Best downgrades!': '最佳降级',
    'Best ring mods': '最佳灵戒词缀',
    'Time to afford!': '计算花费的时间！',
    'Uses the results from your latest simulation.': '将使用最近一次模拟的数据进行计算。',
    'Infinity': '无限',
    'Complete.': '已完成。',
    'u borked it': '中止',
    'Item ±1 level': '欲升降级的物品',
    '~+': '变化',
    'Time until profit': '回本需时',
    'Obtaining build stats...': '获取战斗数据中……',
    'You can never afford this upgrade.': '您永远无法购买它。',
    'You can afford this upgrade now.': '您现在就可以购买它。',
    'Dust/s': '每秒魔尘获取量',
    'Kill Time': '击杀时间',
    'Menacing Mask': '恐吓面具',
    'Sword': '剑',
    'Armor': '护甲',
    'Rusty Dagger': '锈色利刃',
    'Fists of Goo': '粘液拳头',
    'Battery Stick': '电池棍',
    'Pants': '裤子',
    'Raincoat': '雨衣',
    'Putrid Pouch': '酸腐小袋',
    'Chemistry Set': '化学装置',
    'Bad Medkit': '恶之医疗箱',
    'Comfy Boots': '舒适之靴',
    'Labcoat': '实验服',
    'Lifegiving Gem': '生命宝石',
    'Mood Bracelet': '情绪手镯',
    'Hungering Mold': '饥饿霉菌',
    'Recycler': '回收装置',
    'Shining Armor': '闪耀护甲',
    'Shock and Awl': '震慑套装',
    'Spiked Gloves': '尖刺手套',
    'Tame Snimp': '驯服的脆皮蛇',
    'Lich Wraps': '巫妖披肩',
    'Wired Wristguards': '通电护腕',
    'Aegis': '宙斯盾',
    'Sword and Board': '剑刃守护',
    'Bilious Boots': '邪恶之靴',
    'Bloodstained Gloves': '染血手套',
    'Unlucky Coin': '不幸之币',
    'Eelimp in a Bottle': '瓶中脆皮鳗',
    'Big Cleaver': '巨型切割者',
    'The Globulator': '枯荣之球',
    'Metal Suit': '金属外衣',
    'Nozzled Goggles': '护目镜',
    'Sundering Scythe': '撕裂之镰',
    'Sacrificial Shank': '祭祀之腿',
    'Plague Bringer': '瘟疫使者',
    'Very Large Slime': '巨型史莱姆',
    'Monkimp Paw': '脆皮猴之爪',
    'Grounded Crown': '理性之冠',
    'Fearsome Piercer': '恐惧之锥',
    'Bag of Nails': '锐钉之袋',
    'Blessed Protector': '神圣守护',
    'The Doomspring': '毁灭之簧',
    'Snimp  Fanged Blade': '脆皮毒牙之刃',
    'Doppelganger Signet': '分身纹章',
    'Wrath Crafted Hatchet': '狂怒手斧',
    'Basket of Souls': '灵魂之篮',
    'Goo Golem': '粘液魔像',
    'Omni Enhancer': '全领域强化器',
    'Stormbringer': '兴风者',
    'Box of Spores': '孢子盒',
    'Nullifium Armor': '虚物护甲',
    'Myco Mitts': '真菌手套',
    'Haunted Harpoon': '闹鬼鱼叉',
    'Ring': '灵戒',
    'Master of Arms': '武器大师',
    'Dusty Tome': '尘之卷轴',
    'Whirlwind of Arms': '武器旋风',
    'The Ring': '灵戒',
    'attack': '攻击力',
    'health': '生命值',
    'defense': '防御力',
    'lifesteal': '吸血',
    'dustMult': '魔尘获取倍率',
    'Attack': '攻击力',
    'Health': '生命值',
    'Defense': '防御力',
    'Lifesteal': '吸血',
    'DustMult': '魔尘获取倍率',
    'Dusty': '尘起尘落',
    'Dustier': '风尘仆仆',
    'Next Limb': '下级一臂之力',
    'Unlock the Ring': '解锁灵戒',
    //#endregion 主界面

    //原样
    '': '',
    '': '',
}


//需处理的前缀
var cnPrefix = {
    "(-": "(-",
    "(+": "(+",
    "(": "(",
    "-": "-",
    "+": "+",
    ": ": "：",
    "\n": "",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
}

//需处理的后缀
var cnPostfix = {
    ":": "：",
    "：": "：",
    ": ": "：",
    "： ": "：",
    ")": ")",
    "%": "%",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    "\n": "",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^x?\d+(\.\d+)?(e[+\-]?\d+)?\s*\-?$/, //12.34e+4
    /^\s*$/, //纯空格
    /^(.*)[\u4E00-\u9FFF]+(.*)$/, //不抓取中文
];

var cnExcludePostfix = [
    /:?\s*x?\d+(\.\d+)?(e[+\-]?\d+)?\s*$/, //12.34e+4
    /:?\s*x?\d+(\.\d+)?[A-Za-z]{0,2}$/, //: 12.34K, x1.5
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
var cnRegReplace = new Map([
]);