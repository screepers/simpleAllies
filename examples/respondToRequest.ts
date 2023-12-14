// IMPORTANT: This code is just meant to show you how use the segment data. It probably execute

import { ResourceRequest, simpleAllies } from "../src/ts/simpleAllies";

// Example of fulfilling an ally resource request

export function loop() {

    simpleAllies.initRun()

    respondToResourceRequests()

    simpleAllies.endRun()
}

function respondToResourceRequests() {

    const resourceRequests = simpleAllies.allySegmentData.requests.resource
    for (const request of resourceRequests) {

        // Respond to the request
        sendResource(request)
    }
}

function sendResource(request: ResourceRequest) {

    // Just an example. You'd probably want to call terminal.send() to properly respond to the request
}