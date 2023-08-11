"use strict";
// IMPORTANT: This code is just meant to show you how use the segment data. It probably execute
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = void 0;
const simpleAllies_1 = require("simpleAllies");
// Example of fulfilling an ally resource request
function loop() {
    simpleAllies_1.simpleAllies.initRun();
    respondToResourceRequests();
    simpleAllies_1.simpleAllies.endRun();
}
exports.loop = loop;
function respondToResourceRequests() {
    const resourceRequests = simpleAllies_1.simpleAllies.allySegmentData.requests[simpleAllies_1.AllyRequestTypes.resource];
    for (const ID in resourceRequests) {
        const request = resourceRequests[ID];
        // Respond to the request
        sendResource(request);
        // Now that we've fulfilled the request to the best of our ability...
        // Efficiently remove the request so we don't respond to it again. For example, in another room
        delete resourceRequests[ID];
    }
}
function sendResource(request) {
    // Just an example. You'd probably want to call terminal.send() to properly respond to the request
}
