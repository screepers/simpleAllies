import { maxSegmentsOpen } from "./constants"
import { allySegmentID } from "./constants"
import { allies } from "./constants"


export enum AllyRequestTypes {
    /**
     * Tell allies to send a specified amont of a resource
     */
    resource,
    /**
     * Tell allies to defend a room
     */
    defense,
    /**
     * Tell allies to attack a room
     */
    attack,
    /**
     * Tell allies how they should consider a player that isn't on your team
     */
    player,
    /**
     * Request worker creeps to a room. Can be for building, repairing or upgrading
     */
    work,
    /**
     * Tell allies about your economy so they can consider it in their calculations
     */
    econ,
    /**
     * Tell allies about notable rooms you recently scouted
     */
    room,
}
export const allyRequestTypes = Object.keys(
    AllyRequestTypes,
) as unknown as (keyof typeof AllyRequestTypes)[]

export interface AllyRequest {
    ID: string
    type: AllyRequestTypes
}

export interface ResourceRequest extends AllyRequest {
    priority: number
    roomName: string
    resourceType: ResourceConstant
    /**
     * How much they want of the resource. If the responder sends only a portion of what you ask for, that's fine
     */
    amount: number
    /**
     * If the bot has no terminal, allies should instead haul the resources to us
     */
    terminal?: boolean
}

export interface DefenseRequest extends AllyRequest {
    priority: number
    roomName: string
}

export interface AttackRequest extends AllyRequest {
    priority: number
    roomName: string
}

export interface PlayerRequest extends AllyRequest {
    playerName: string
    /**
     * The amount you think your team should hate the player. Hate should probably affect combat aggression and targetting
     */
    hate?: number
    /**
     * The last time this player has attacked you
     */
    lastAttackedBy?: number
}

type WorkRequestType = 'build' | 'upgrade' | 'repair'

export interface WorkRequest extends AllyRequest {
    priority: number
    roomName: string
    workType: WorkRequestType
}

export interface EconRequest extends AllyRequest {
    /**
     * total credits the bot has. Should be 0 if there is no market on the server
     */
    credits: number
    /**
     * cumulative stored energy across the bot's rooms. Storage + terminal + factory should be sufficient
     */
    energy: number
    /**
     * The average energy income the bot has calculated over whatever timeframe they choose.
     * Optional, as some bots might not be able to calculate this easily.
     */
    energyIncome?: number
    mineralRooms?: { [key in MineralConstant]: number }
}

export interface RoomRequest extends AllyRequest {
    roomName: string
    /**
     * The player who owns this room. If there is no owner, the room probably isn't worth making a request about
     */
    playerName: string
    /**
     * The last tick your scouted this room to acquire the data you are now sharing
     */
    lastScout: number
    rcl: number
    /**
     * The amount of stored energy the room has. storage + terminal + factory should be sufficient
     */
    energy: number
    towers: number
    avgRamprtHits: number
    terminal: boolean
}

type IDKey<T> = {[ID: string]: T}

export interface AllyRequests {

    [AllyRequestTypes.resource]: IDKey<ResourceRequest>
    [AllyRequestTypes.defense]: IDKey<DefenseRequest>
    [AllyRequestTypes.attack]: IDKey<AttackRequest>
    [AllyRequestTypes.player]: IDKey<PlayerRequest>
    [AllyRequestTypes.work]: IDKey<WorkRequest>
    [AllyRequestTypes.econ]: IDKey<EconRequest>
    [AllyRequestTypes.room]: IDKey<RoomRequest>
}

/**
 * Having data we pass into the segment being an object allows us to send additional information outside of requests
 */
export interface SegmentData {
    /**
     * Requests of the new system
     */
    requests: AllyRequests
}

class SimpleAllies {
    /**
     * The intra-tick index for tracking IDs assigned to requests
     */
    requestID: number = 0
    myRequests: Partial<AllyRequests> = {}
    allySegmentData: SegmentData
    currentAlly: string

    /**
     * To call before any requests are made. Configures some required values and gets ally requests
     */
    initRun() {
        // Reset the data of myRequests
        for (const key in AllyRequestTypes) {
            const type = key as keyof typeof AllyRequestTypes

            this.myRequests[AllyRequestTypes[type]] = {}
        }

        this.requestID = 0

        this.readAllySegment()
    }

    /**
     * Try to get segment data from our current ally. If successful, assign to the instane
     */
    readAllySegment() {

        this.currentAlly = allies[Game.time % allies.length]
        if (!this.currentAlly) {
            throw Error('Failed to find an ally for simpleAllies, you probably have no allies :(')
            return
        }

        // Make a request to read the data of the next ally in the list, for next tick
        const nextAllyName = allies[(Game.time + 1) % allies.length]
        RawMemory.setActiveForeignSegment(nextAllyName, allySegmentID)

        // Maybe the code didn't run last tick, so we didn't set a new read segment
        if (!RawMemory.foreignSegment) return
        if (RawMemory.foreignSegment.username !== this.currentAlly) return

        // Protect from errors as we try to get ally segment data
        try {
            this.allySegmentData = JSON.parse(RawMemory.foreignSegment.data)
        } catch (err) {
            console.log('Error in getting requests for simpleAllies', this.currentAlly)
        }
    }

    /**
     * To call after requests have been made, to assign requests to the next ally
     */
    endRun() {

        // Make sure we don't have too many segments open
        if (Object.keys(RawMemory.segments).length >= maxSegmentsOpen) {
            throw Error('Too many segments open: simpleAllies')
        }

        const newSegmentData: SegmentData = {
            requests: this.myRequests as AllyRequests
        }

        RawMemory.segments[allySegmentID] = JSON.stringify(newSegmentData)
        RawMemory.setPublicSegments([allySegmentID])
    }

    // Request methods

    requestResource(
        roomName: string,
        resourceType: ResourceConstant,
        amount: number,
        terminal?: boolean,
        priority: number = 0,
    ) {

        const type = AllyRequestTypes.resource
        const ID = this.newRequestID()

        this.myRequests[type][ID] = {
            ID,
            type,
            priority,
            roomName,
            resourceType,
            amount,
            terminal,
        }
    }

    requestDefense(
        roomName: string,
        priority: number = 0,
    ) {

        const type = AllyRequestTypes.defense
        const ID = this.newRequestID()

        this.myRequests[type][ID] = {
            ID,
            type,
            priority,
            roomName,
        }
    }

    requestAttack(
        roomName: string,
        priority: number = 0,
    ) {

        const type = AllyRequestTypes.attack
        const ID = this.newRequestID()

        this.myRequests[type][ID] = {
            ID,
            type,
            priority,
            roomName,
        }
    }

    requestPlayer(playerName: string, hate?: number, lastAttackedBy?: number) {

        const type = AllyRequestTypes.player
        const ID = this.newRequestID()

        this.myRequests[type][ID] = {
            ID,
            type,
            playerName,
            hate,
            lastAttackedBy,
        }
    }

    requestWork(roomName: string, workType: WorkRequestType, priority: number = 0) {

        const type = AllyRequestTypes.work
        const ID = this.newRequestID()

        this.myRequests[type][ID] = {
            ID,
            type,
            priority,
            roomName,
            workType,
        }
    }

    requestEcon(credits: number, energy: number, energyIncome?: number, mineralRooms?: { [key in MineralConstant]: number }) {

        const type = AllyRequestTypes.econ
        const ID = this.newRequestID()

        this.myRequests[type][ID] = {
            ID,
            type,
            credits,
            energy,
            energyIncome,
            mineralRooms,
        }
    }

    requestRoom(roomName: string, playerName: string, lastScout: number, rcl: number, energy: number, towers: number, avgRamprtHits: number, terminal: boolean) {

        const type = AllyRequestTypes.room
        const ID = this.newRequestID()

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
        }
    }

    private newRequestID() {

        return (this.requestID += 1).toString()
    }
}

export const simpleAllies = new SimpleAllies()