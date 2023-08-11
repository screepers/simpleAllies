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
const allyRequestTypes = [
    'resource',
    'defense',
    'attack',
    'player',
    'work',
    'econ',
    'room',
];
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
        this.currentAlly = exports.allies[Game.time % exports.allies.length];
        if (!this.currentAlly) {
            throw Error('Failed to find an ally for simpleAllies, you probably have no allies :(');
            return;
        }
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
    requestResource(roomName, resourceType, amount, terminal, priority = 0) {
        const type = 'resource';
        const ID = this.newRequestID();
        this.myRequests[type][ID] = {
            type,
            priority,
            roomName,
            resourceType,
            amount,
            terminal,
        };
    }
    requestDefense(roomName, priority = 0) {
        const type = 'defense';
        this.myRequests[type][roomName] = {
            type,
            priority,
        };
    }
    requestAttack(roomName, priority = 0) {
        const type = 'attack';
        this.myRequests[type][roomName] = {
            type,
            priority,
        };
    }
    requestPlayer(playerName, hate, lastAttackedBy) {
        const type = 'player';
        this.myRequests[type][playerName] = {
            type,
            hate,
            lastAttackedBy,
        };
    }
    requestWork(roomName, workType, priority = 0) {
        const type = 'work';
        this.myRequests[type][roomName] = {
            type,
            priority,
            workType,
        };
    }
    requestEcon(credits, energy, energyIncome, mineralRooms) {
        const type = 'econ';
        this.myRequests[type] = {
            type,
            credits,
            energy,
            energyIncome,
            mineralRooms,
        };
    }
    requestRoom(roomName, playerName, lastScout, rcl, energy, towers, avgRamprtHits, terminal) {
        const type = 'room';
        this.myRequests[type][roomName] = {
            type,
            playerName,
            lastScout,
            rcl,
            energy,
            towers,
            avgRamprtHits,
            terminal,
        };
    }
    newRequestID() {
        return (this.requestID += 1).toString();
    }
}
exports.simpleAllies = new SimpleAllies();
