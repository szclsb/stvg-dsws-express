import {
    validate,
    validateInteger,
    required,
    validateObjectId, validateArray, validateNumText, validateIn, validateNumber
} from "../validation/validation-utils";
import {ObjectId} from "bson";

export const runStates = ["DNS", "DNF", "VALID"] as const;
export type RunState = typeof runStates[number];

export interface Performance {
    state: RunState;
    time: number;
}

export interface Run {
    runGroupId: ObjectId
    registrationId: ObjectId;
    beginTrack: number;
    endTrack: number;
    performance?: Performance;
}

export async function validateRun(body: any): Promise<Run> {
    return await validate<Run>({
        runGroupId: validateObjectId(body.runGroupId).then(required),
        registrationId: validateObjectId(body.registrationId).then(required),
        beginTrack: validateInteger(body.beginTrack, 0).then(required),
        endTrack: validateInteger(body.endTrack, 0).then(required),
    });
}

export async function validatePerformance(body: any): Promise<Performance> {
    return await validate<Performance>({
        state: validateIn<RunState>(runStates, body.state).then(required),
        time: validateNumber(body.time, 0).then(required)
    });
}
