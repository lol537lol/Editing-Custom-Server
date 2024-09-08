"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../common/constants");
const interfaces_1 = require("../common/interfaces");
const ENTRIES_LIMIT = 20000;
let entries = [];
let entriesCount = 0;
let isProfilingEnabled = false;
let lastFetchTime = Date.now();
function getTimingEnabled() {
    return isProfilingEnabled;
}
exports.getTimingEnabled = getTimingEnabled;
function setTimingEnabled(isEnabled) {
    if (isProfilingEnabled === isEnabled) {
        return;
    }
    isProfilingEnabled = isEnabled;
    if (isEnabled) {
        for (let i = 0; i < ENTRIES_LIMIT; i++) {
            entries.push({ type: 0, time: 0, name: undefined });
        }
    }
    else {
        entries = [];
    }
}
exports.setTimingEnabled = setTimingEnabled;
function timingStart(name) {
    if (isProfilingEnabled) {
        if (entriesCount < ENTRIES_LIMIT) {
            const entry = entries[entriesCount];
            entry.type = 0 /* Start */;
            entry.time = interfaces_1.counterNow();
            entry.name = name;
            entriesCount++;
        }
        else {
            console.warn(`exceeded timing entry limit`);
        }
    }
}
exports.timingStart = timingStart;
function timingEnd() {
    if (isProfilingEnabled) {
        if (entriesCount < ENTRIES_LIMIT) {
            const entry = entries[entriesCount];
            entry.type = 1 /* End */;
            entry.time = interfaces_1.counterNow();
            entry.name = undefined;
            entriesCount++;
        }
        else {
            console.warn(`exceeded timing entry limit`);
        }
    }
}
exports.timingEnd = timingEnd;
function timingReset() {
    entriesCount = 0;
}
exports.timingReset = timingReset;
function timingEntries() {
    lastFetchTime = Date.now();
    if (!isProfilingEnabled) {
        setTimingEnabled(true);
        return [];
    }
    return entries.slice(0, entriesCount);
}
exports.timingEntries = timingEntries;
function timingUpdate() {
    if (isProfilingEnabled) {
        if (Date.now() - lastFetchTime > constants_1.MINUTE) {
            setTimingEnabled(false);
        }
    }
}
exports.timingUpdate = timingUpdate;
//# sourceMappingURL=timing.js.map