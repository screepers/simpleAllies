"use strict";
// This file is just an example. While you do need to include the variables somewhere in your bot for simpleAllies to function, you don't need to do so in this file
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxSegmentsOpen = exports.allySegmentID = exports.allies = void 0;
exports.allies = [
    'Player1',
    'Player2',
    'Player3',
];
// This is the conventional segment used for team communication
exports.allySegmentID = 90;
// This isn't in the docs for some reason, so we need to add it
exports.maxSegmentsOpen = 10;
