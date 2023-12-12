"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleAllies = exports.maxSegmentsOpen = exports.allySegmentID = exports.allies = void 0;
exports.allies = [
    'Player1',
    'Player2',
    'Player3',
];
// This is the conventional segment used for team communication
exports.allySegmentID = 90;
// This isn't in the docs for some reason, so we need to add it
exports.maxSegmentsOpen = 10;
class SimpleAllies {
    /**
     * The intra-tick index for tracking IDs assigned to requests
     */
    requestID;
    myRequests = {};
    allySegmentData;
    currentAlly;
    /**
     * To call before any requests are made or responded to. Configures some required values and gets ally requests
     */
    initRun() {
        // Reset the data of myRequests
        this.myRequests = {
            resource: {},
            defense: {},
            attack: {},
            player: {},
            work: {},
            room: {},
        };
        this.requestID = 0;
        this.readAllySegment();
    }
    /**
     * Try to get segment data from our current ally. If successful, assign to the instane
     */
    readAllySegment() {
        if (!exports.allies.length) {
            throw Error("Failed to find an ally for simpleAllies, you probably have none :(");
        }
        this.currentAlly = exports.allies[Game.time % exports.allies.length];
        // Make a request to read the data of the next ally in the list, for next tick
        const nextAllyName = exports.allies[(Game.time + 1) % exports.allies.length];
        RawMemory.setActiveForeignSegment(nextAllyName, exports.allySegmentID);
        // Maybe the code didn't run last tick, so we didn't set a new read segment
        if (!RawMemory.foreignSegment)
            return;
        if (RawMemory.foreignSegment.username !== this.currentAlly)
            return;
        // Protect from errors as we try to get ally segment data
        try {
            this.allySegmentData = JSON.parse(RawMemory.foreignSegment.data);
        }
        catch (err) {
            console.log('Error in getting requests for simpleAllies', this.currentAlly);
        }
    }
    /**
     * To call after requests have been made, to assign requests to the next ally
     */
    endRun() {
        // Make sure we don't have too many segments open
        if (Object.keys(RawMemory.segments).length >= exports.maxSegmentsOpen) {
            throw Error('Too many segments open: simpleAllies');
        }
        const newSegmentData = {
            requests: this.myRequests
        };
        RawMemory.segments[exports.allySegmentID] = JSON.stringify(newSegmentData);
        RawMemory.setPublicSegments([exports.allySegmentID]);
    }
    // Request methods
    requestResource(args) {
        const ID = this.newRequestID();
        this.myRequests.resource[ID] = args;
    }
    requestDefense(roomName, args) {
        this.myRequests.defense[roomName] = args;
    }
    requestAttack(roomName, args) {
        this.myRequests.attack[roomName] = args;
    }
    requestPlayer(playerName, args) {
        this.myRequests.player[playerName] = args;
    }
    requestWork(roomName, args) {
        this.myRequests.work[roomName] = args;
    }
    requestEcon(args) {
        this.myRequests.econ = args;
    }
    requestRoom(roomName, args) {
        this.myRequests.room[roomName] = args;
    }
    newRequestID() {
        return (this.requestID += 1).toString();
    }
}
exports.simpleAllies = new SimpleAllies();
