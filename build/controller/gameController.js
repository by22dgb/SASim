import { autoBattle } from "../data/object.js";
const controller = {
    framesPerChunk: 100,
    battles: 1000,
    battleCount: 0,
    complete: false,
    interval: null,
    lastFrame: 0,
    halt: false,
    onSimInterrupt: null,
    onSimComplete: null,
    onUpdate: null,
    resultBest: { enemy: 1, time: 0, win: false },
    resultCounter: { fights: 0, healthSum: 0, loses: 0 },
    runtime: 8 * 60 * 60,
    modificated: true,
    timeStart: 0,
    timeUsed: 0,
    updateInterval: 1000,
    lastUpdate: Date.now(),
    getDefaultConfig() {
        return {
            fights: 1000,
            framesPerChunk: 200,
            onSimInterrupt: null,
            onSimComplete: null,
            onUpdate: null,
            runtime: 8 * 60 * 60,
            updateInterval: 1000,
        };
    },
    getProgress() {
        const progress = Math.max(autoBattle.lootAvg.counter / 1000 / this.runtime, this.battleCount / this.battles);
        return this.complete ? 1 : progress;
    },
    getTimeUsed() {
        const interval = this.interval == null ? 0 : Date.now() - this.timeStart;
        return this.timeUsed + interval;
    },
    isRunning() {
        return this.interval != null;
    },
    modifiedAutoBattle() {
        this.halt = true;
        this.modificated = true;
    },
    configure(config) {
        this.battles = config.fights;
        this.framesPerChunk = config.framesPerChunk;
        this.onSimInterrupt = config.onSimInterrupt;
        this.onSimComplete = config.onSimComplete;
        this.onUpdate = config.onUpdate;
        this.runtime = config.runtime;
        this.updateInterval = config.updateInterval;
    },
    resetStats() {
        autoBattle.resetAll();
        this.resultBest = { enemy: 1, time: 0, win: false };
        this.resultCounter = { fights: 0, healthSum: 0, loses: 0 };
        this.timeUsed = 0;
    },
    start() {
        if (this.interval != null) {
            return; // Already running
        }
        if (this.modificated) {
            this.resetStats();
            this.modificated = false;
        }
        this.battleCount =
            autoBattle.sessionEnemiesKilled + autoBattle.sessionTrimpsKilled;
        this.complete = false;
        this.halt = false;
        this.lastUpdate = Date.now();
        this.timeStart = this.lastUpdate;
        this.interval = setInterval(this.loop, 0);
    },
    stop() {
        this.halt = true;
    },
    loop() {
        for (let frame = 0; !this.halt && frame < this.framesPerChunk; ++frame) {
            autoBattle.update();
            this.complete =
                autoBattle.lootAvg.counter / 1000 >= this.runtime ||
                    this.battleCount >= this.battles;
            this.halt == this.complete;
        }
        const now = Date.now();
        if (this.halt && this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            this.timeUsed = now - this.timeStart;
        }
        if (this.halt || now - this.lastUpdate >= this.updateInterval) {
            this.lastUpdate = now;
            if (this.onUpdate) {
                this.onUpdate();
            }
            if (this.halt) {
                if (this.complete && this.onSimComplete) {
                    this.onSimComplete();
                }
                else if (this.onSimInterrupt) {
                    this.onSimInterrupt();
                }
            }
        }
    },
    battleSuccess() {
        ++this.resultCounter.fights;
        if (!this.resultBest.win) {
            this.resultBest.enemy = 0;
            this.resultBest.time = autoBattle.battleTime;
            this.resultBest.win = true;
        }
        if (this.resultBest.time > autoBattle.battleTime) {
            this.resultBest.time = autoBattle.battleTime;
        }
        this.battleCommon();
    },
    battleFailure() {
        ++this.resultCounter.fights;
        ++this.resultCounter.loses;
        const enemy = autoBattle.enemy;
        const enemyHealthPercentage = Math.max(0, Math.min(enemy.health / enemy.maxHealth, 1));
        if (!this.resultBest.win) {
            if (enemyHealthPercentage < this.resultBest.enemy) {
                this.resultBest.enemy = enemyHealthPercentage;
                this.resultBest.time = autoBattle.battleTime;
            }
            else if (enemyHealthPercentage == this.resultBest.enemy &&
                autoBattle.battleTime > this.resultBest.time) {
                this.resultBest.time = autoBattle.battleTime;
            }
        }
        this.resultCounter.healthSum += enemyHealthPercentage;
        this.battleCommon();
    },
    battleCommon() {
        this.battleCount =
            autoBattle.sessionEnemiesKilled + autoBattle.sessionTrimpsKilled;
    },
};
export function setupController() {
    autoBattle.onEnemyDied = controller.battleSuccess.bind(controller);
    autoBattle.onTrimpDied = controller.battleFailure.bind(controller);
}
export { controller as gameController };
