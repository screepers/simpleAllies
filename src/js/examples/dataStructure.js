"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simpleAllies_1 = require("simpleAllies");
const exampleSegmentData = {
    requests: {
        [simpleAllies_1.AllyRequestTypes.resource]: {
            '1': {
                ID: '1',
                type: simpleAllies_1.AllyRequestTypes.resource,
                priority: 1,
                roomName: "W1N1",
                resourceType: RESOURCE_ENERGY,
                amount: 1,
                terminal: true,
            }
        }
    }
};
