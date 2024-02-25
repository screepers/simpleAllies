import { SimpleAllies } from './simpleAllies';

const simpleAllies = new SimpleAllies();

/**
 * Example bot loop
 */
export function loop() {
    // Read next an ally segment
    simpleAllies.initRun();

    // Respond to ally requests
    respondToAllyDefenseRequests();
    respondToAllyResourceRequests();

    // Request support from allies
    requestAllyResources();
    requestAllyDefense();

    // Update ally segment
    simpleAllies.endRun();
}

/**
 * Example of responding to ally defense requests
 */
function respondToAllyDefenseRequests() {
    if (!simpleAllies.allySegmentData) return;

    // Send creeps to defend rooms
    for (const request of simpleAllies.allySegmentData.requests.defense) {
        console.log('[simpleAllies] Respond to defense request', JSON.stringify(request));
        // ...
    }
}

/**
 * Example of responding to ally resource requests
 */
function respondToAllyResourceRequests() {
    if (!simpleAllies.allySegmentData) return;

    // Send resources to rooms
    for (const request of simpleAllies.allySegmentData.requests.resource) {
        console.log('[simpleAllies] Respond to resource request', JSON.stringify(request));
        // ...
    }
}

/**
 * Example of requesting ally resources
 */
function requestAllyResources() {
    // Add resource request
    simpleAllies.requestResource({
        priority: 1,
        roomName: 'W1N1',
        resourceType: RESOURCE_ENERGY,
        amount: 1000,
    });
}

/**
 * Example of requesting ally defense
 */
function requestAllyDefense() {
    // Add defense request
    simpleAllies.requestDefense({
        priority: 1,
        roomName: 'W1N1',
    });
}
