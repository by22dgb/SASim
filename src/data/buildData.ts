import { ISaveString } from "./buildString";
import { autoBattle } from "./object";

export const builderData = {
    costItems: new Map<keyof ISaveString["items"], number>(),
    costOneTimers: new Map<keyof ISaveString["oneTimers"], number>(),
    costRing: 0,
    costDust: 0,
    costShard: 0,
};
