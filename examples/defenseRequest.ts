// IMPORTANT: This code is just meant to show you how use the segment data. It probably execute

import { DefenseRequest, ResourceRequest, simpleAllies } from "../src/ts/simpleAllies";

// Example of fulfilling an ally resource request

export function loop() {

    simpleAllies.initRun()

    respondToDefenseRequests()

    simpleAllies.endRun()
}

function respondToDefenseRequests() {

    // Other players need help defending, let's see what we can do!

    const defenseRequests = simpleAllies.allySegmentData.requests.defense
    if (!defenseRequests) return

    for (const request of defenseRequests) {

        // Respond to the request
        respondToDefenseRequest(request)
    }
}

/**
 * Try to respond to a defense request
 */
function respondToDefenseRequest(request: DefenseRequest) {

    if (!canRespondToDefenseRequest(request)) return

    // respond to the request
}

/**
 * See if we are capable of responding based on the needs of the request
 */
function canRespondToDefenseRequest(request: DefenseRequest) {

    return true
}