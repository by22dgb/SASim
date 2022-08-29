import { IABTypes } from "./buildString.js";

export const builderData = {
    costItems: new Map<keyof IABTypes["items"], number>(),
    costOneTimers: new Map<keyof IABTypes["oneTimers"], number>(),
    costRing: 0,
    costDust: 0,
    costShard: 0,
    limbs: 0,
};
