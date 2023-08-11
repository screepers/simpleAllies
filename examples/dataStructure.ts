import { AllyRequestTypes, AllyRequests } from "simpleAllies"

// Here's what the segmentData property of simpleAllies might look like when it has a request

interface ExampleSegmentData {
    requests: Partial<AllyRequests>
}

const exampleSegmentData: ExampleSegmentData = {
    requests: {
        [AllyRequestTypes.resource]: {
            '1': {
                ID: '1',
                type: AllyRequestTypes.resource,
                priority: 1,
                roomName: "W1N1",
                resourceType: RESOURCE_ENERGY,
                amount: 1,
                terminal: true,
            }
        }
    }
}