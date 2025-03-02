/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com

*/

var cnItems = {
    _OTHER_: [],
    //#region 主界面
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
    'Doppelganger Diadem': '分身王冠',
    'Doppelganger Signet': '分身纹章',
    'Wrath Crafted Hatchet': '狂怒手斧',
    'Basket of Souls': '灵魂之篮',
    'Goo Golem': '粘液魔像',
    'Omni Enhancer': '全领域强化器',
    'Stormbringer': '兴风者',
    'Box of Spores': '孢子盒',
    'Nullifium Armor': '虚物护甲',
    'Myco Mitts': '真菌手套',
    'Gaseous Greataxe': '气态巨斧',
    'The Fibrillator': '电击震荡器',
    'Haunted Harpoon': '闹鬼鱼叉',
    'Master of Arms': '武器大师',
    'Dusty Tome': '尘之卷轴',
    'Whirlwind of Arms': '武器旋风',
    'Attack': '攻击力',
    'Health': '生命值',
    'Defense': '防御力',
    'Lifesteal': '吸血',
    'Dusty': '尘起尘落',
    'Huffy earns 25% more Dust from all sources.': '怒怒的魔尘获取量增加25%。',
    'Dustier': '风尘仆仆',
    'Huffy earns an additional 25% Dust from all sources.': '怒怒的魔尘获取量再增加25%。',
    'Scruffy teaches Huffy how to find 5x Dust from SA enemies.': '污污可以教会怒怒如何更好地获取魔尘，尖塔突击敌人掉落的魔尘变为5倍。',
    'Build cost': '物品总花费',
    'Build cost:': '物品总花费：',
    ' Dust  ': '魔尘 ',
    'Shards': '晶块',
    'Shards:': '晶块：',
    'Limbs': '物品装备数量',
    'Limbs:': '物品装备数量：',
    'Max enemy level': '敌人等级上限',
    'Max enemy level:': '敌人等级上限：',
    'Set level': '需模拟的敌人等级',
    'Set level:': '需模拟的敌人等级：',
    'None': '无',
    'Healthy': '健康',
    'Fast': '快速',
    'Strong': '强壮',
    'Defensive': '守势',
    'Poisoning': '有毒',
    'Bloodletting': '出血',
    'Shocking': '震撼',
    'Lifestealing': '吸血',
    'Poison Resistant': '毒抗',
    'Shock Resistant': '震抗',
    'Bleed Resistant': '血抗',
    'Enraging': '激怒',
    'Explosive': '爆裂',
    'Berserking': '狂暴',
    'Slowing': '减速',
    'Ethereal': '空灵',
    'Poison Immune': '毒免',
    'Shock Immune': '震免',
    'Bleed Immune': '血免',
    'Huffy': '怒怒',
    'Poison chance': '触发中毒的概率',
    'Poison chance:': '触发中毒的概率：',
    'Bleed chance': '触发流血的概率',
    'Bleed chance:': '触发流血的概率：',
    'Shock chance': '触发震荡的概率',
    'Shock chance:': '触发震荡的概率：',
    'Shank reduces': '祭祀之腿的效果',
    'Poison': '中毒',
    'Bleed': '流血',
    'Shock': '震荡',
    'Enemy': '敌人',
    'Poison resist': '中毒抗性',
    'Poison resist:': '中毒抗性：',
    'Bleed resist': '流血抗性',
    'Bleed resist:': '流血抗性：',
    'Shock resist': '震荡抗性',
    'Shock resist:': '震荡抗性：',
    'Time to afford!': '计算花费的时间!',
    'You can afford this': '您',
    'You can afford this from 0 dust/shards in': '您从零开始购买它需要',
    'You can afford this from 0 dust/shards in:': '您从零开始购买它需要：',
    'The Ring': '灵戒',
    'Unlock the Ring': '解锁灵戒',
    'Extra Limbs': '下级一臂之力',
    'Radon': '下级氡',
    'Stats': '下级属性',
    'Scaffolding': '下级脚手架',
    'Paste a save or a build from the community sheet (copy items or the\n                                                        entire row).': '粘贴存档或装备代码。',
    'Reset!': '重置!',
    '▶ Run!': '▶ 开始模拟!',
    '■ Stop!': '■ 停止模拟!',
    'Auto run!': '自动开始模拟!',
    'Simulate': '模拟',
    'Simulate:': '模拟：',
    'hour(s).': '小时。',
    'Time processed': '模拟时间',
    'Time processed:': '模拟时间：',
    'Enemies killed': '敌人击杀数',
    'Enemies killed:': '敌人击杀数：',
    'Trimps killed [WR]': '战斗失利数[胜率]',
    'Trimps killed [WR]:': '战斗失利数[胜率]：',
    'Dust': '魔尘',
    'Dust:': '魔尘：',
    ' D/s': '魔尘/秒',
    'D/s]': '魔尘/秒]',
    ' S/s': '晶块/秒',
    'S/s]': '晶块/秒]',
    '0 s': '0秒',
    'Clearing time': '通过时间',
    'Clearing time:': '通过时间：',
    'Remaining time': '剩余时间',
    'Remaining time:': '剩余时间：',
    'Average fight time': '平均每场战斗时间',
    'Average fight time:': '平均每场战斗时间：',
    'Average kill time': '平均击杀时间',
    'Average kill time:': '平均击杀时间：',
    'Average enemy health': '敌人平均生命值',
    'Average enemy health:': '敌人平均生命值：',
    'Average enemy health on losses': '失利时敌人平均生命值',
    'Average enemy health on losses:': '失利时敌人平均生命值：',
    'Best fight': '最佳战斗结果',
    'Best fight:': '最佳战斗结果：',
    'Best grades!': '最佳升级!',
    'Best ring mods!': '最佳灵戒词缀!',
    'Drop item!': '减少物品!',
    'Add item!': '增加物品!',
    'Items': '物品',
    'Reduced clearing time': '减少通过时间',
    'Time until profit': '回本时间',
    'Mods': '词缀',
    'Health & Attack': '生命值、攻击力',
    'Defense & Attack': '防御力、攻击力',
    'Lifesteal & Attack': '吸血、攻击力',
    'Dust & Attack': '魔尘、攻击力',
    'Defense & Health': '防御力、生命值',
    'Lifesteal & Health': '吸血、生命值',
    'Dust & Health': '魔尘、生命值',
    'Lifesteal & Defense': '吸血、防御力',
    'Dust & Defense': '魔尘、防御力',
    'Dust & Lifesteal': '魔尘、吸血',
    'Defense & Health & Attack': '防御力、生命值、攻击力',
    'Lifesteal & Health & Attack': '吸血、生命值、攻击力',
    'Dust & Health & Attack': '魔尘、生命值、攻击力',
    'Lifesteal & Defense & Attack': '吸血、防御力、攻击力',
    'Dust & Defense & Attack': '魔尘、防御力、攻击力',
    'Dust & Lifesteal & Attack': '魔尘、吸血、攻击力',
    'Lifesteal & Defense & Health': '吸血、防御力、生命值',
    'Dust & Defense & Health': '魔尘、防御力、生命值',
    'Dust & Lifesteal & Health': '魔尘、吸血、生命值',
    'Dust & Lifesteal & Defense': '魔尘、吸血、防御力',
    'Kill time': '击杀时间',
    'Dust/s': '魔尘/秒',
    'WR': '胜率',
    'Income': '收益',
    'Ring': '灵戒',
    //#endregion 主界面
    //#region 保持原样
    '，': '，',
    '[': '[',
    '/': '/',
    '%': '%',
    '%]': '%]',
    '⏸': '⏸',
    '♾️': '♾️',
    '该结果为归一化后的数值，用于\n                                                        社区表格。84层以上包含突变，\n                                                        121层以上包含污污21级技能。': '该结果为归一化后的数值，用于\n                                                        社区表格。84层以上包含突变，\n                                                        121层以上包含污污21级技能。',
    //#endregion
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
    /^x\d+，$/, //不抓取内容
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