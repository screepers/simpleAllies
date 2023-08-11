"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleAllies = exports.allyRequestTypes = exports.AllyRequestTypes = void 0;
const constants_1 = require("./constants");
const constants_2 = require("./constants");
const constants_3 = require("./constants");
var AllyRequestTypes;
(function (AllyRequestTypes) {
    /**
     * Tell allies to send a specified amont of a resource
     */
    AllyRequestTypes[AllyRequestTypes["resource"] = 0] = "resource";
    /**
     * Tell allies to defend a room
     */
    AllyRequestTypes[AllyRequestTypes["defense"] = 1] = "defense";
    /**
     * Tell allies to attack a room
     */
    AllyRequestTypes[AllyRequestTypes["attack"] = 2] = "attack";
    /**
     * Tell allies how they should consider a player that isn't on your team
     */
    AllyRequestTypes[AllyRequestTypes["player"] = 3] = "player";
    /**
     * Request worker creeps to a room. Can be for building, repairing or upgrading
     */
    AllyRequestTypes[AllyRequestTypes["work"] = 4] = "work";
    /**
     * Tell allies about your economy so they can consider it in their calculations
     */
    AllyRequestTypes[AllyRequestTypes["econ"] = 5] = "econ";
    /**
     * Tell allies about notable rooms you recently scouted
     */
    AllyRequestTypes[AllyRequestTypes["room"] = 6] = "room";
})(AllyRequestTypes = exports.AllyRequestTypes || (exports.AllyRequestTypes = {}));
exports.allyRequestTypes = Object.keys(AllyRequestTypes);
class SimpleAllies {
    /**
     * The intra-tick index for tracking IDs assigned to requests
     */
    requestID;
    myRequests = {};
    allySegmentData;
    currentAlly;
    /**
     * To call before any requests are made. Configures some required values and gets ally requests
     */
    initRun() {
        // Reset the data of myRequests
        for (const key in AllyRequestTypes) {
            const type = key;
            this.myRequests[AllyRequestTypes[type]] = {};
        }
        this.requestID = 0;
        this.readAllySegment();
    }
    /**
     * Try to get segment data from our current ally. If successful, assign to the instane
     */
    readAllySegment() {
        this.currentAlly = constants_3.allies[Game.time % constants_3.allies.length];
        const nextAllyName = constants_3.allies[(Game.time + 1) % constants_3.allies.length];
        RawMemory.setActiveForeignSegment(nextAllyName, constants_2.allySegmentID);
        // Just in case... somehow
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
        if (Object.keys(RawMemory.segments).length >= constants_1.maxSegmentsOpen) {
            throw Error('Too many segments open: simpleAllies');
        }
        const newSegmentData = {
            requests: this.myRequests
        };
        RawMemory.segments[constants_2.allySegmentID] = JSON.stringify(newSegmentData);
        RawMemory.setPublicSegments([constants_2.allySegmentID]);
    }
    // Request methods
    requestResource(roomName, resourceType, amount, terminal, priority = 0) {
        const type = AllyRequestTypes.resource;
        const ID = this.newRequestID();
        this.myRequests[type][ID] = {
            ID,
            type,
            priority,
            roomName,
            resourceType,
            amount,
            terminal,
        };
    }
    requestDefense(roomName, priority = 0) {
        const type = AllyRequestTypes.defense;
        const ID = this.newRequestID();
        this.myRequests[type][ID] = {
            ID,
            type,
            priority,
            roomName,
        };
    }
    requestAttack(roomName, priority = 0) {
        const type = AllyRequestTypes.attack;
        const ID = this.newRequestID();
        this.myRequests[type][ID] = {
            ID,
            type,
            priority,
            roomName,
        };
    }
    requestPlayer(playerName, hate, lastAttackedBy) {
        const type = AllyRequestTypes.player;
        const ID = this.newRequestID();
        this.myRequests[type][ID] = {
            ID,
            type,
            playerName,
            hate,
            lastAttackedBy,
        };
    }
    requestWork(roomName, workType, priority = 0) {
        const type = AllyRequestTypes.work;
        const ID = this.newRequestID();
        this.myRequests[type][ID] = {
            ID,
            type,
            priority,
            roomName,
            workType,
        };
    }
    requestEcon(credits, energy, energyIncome, mineralRooms) {
        const type = AllyRequestTypes.econ;
        const ID = this.newRequestID();
        this.myRequests[type][ID] = {
            ID,
            type,
            credits,
            energy,
            energyIncome,
            mineralRooms,
        };
    }
    requestRoom(roomName, playerName, lastScout, rcl, energy, towers, avgRamprtHits, terminal) {
        const type = AllyRequestTypes.room;
        const ID = this.newRequestID();
        this.myRequests[type][ID] = {
            ID,
            type,
            roomName,
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
