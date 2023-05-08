import {
    required,
    validate,
    validateArray,
    validateIn,
    validateInteger,
    validateNumber,
    validateNumText,
    validateObjectId,
    validateText,
} from "../validation/validation-utils";
import {ObjectId, ObjectID} from "bson";

export const runStates = ["DNS", "DNF", "VALID"] as const;
export type RunState = typeof runStates[number];

export interface Registration {
    disciplineName: string;
    categoryName?: string;
    athleteIds: ObjectId[];
    groupName?: string;
    planning?: RegistrationPlanning;
    performance?: Performance;
}

export interface RegistrationPlanning {
    planningId: ObjectId
    beginTrack: number;
    endTrack: number;
}

export interface Performance {
    state: RunState;
    time?: number;
}

export async function validateRegistration(body: any): Promise<Registration> {
    return await validate<Registration>({
        disciplineName: validateNumText(body.disciplineName).then(required),
        categoryName: validateNumText(body.categoryName),
        athleteIds: validateArray<ObjectID>(body.athleteIds?.map((athleteId: any) =>
            validateObjectId(athleteId))).then(required),
        groupName: validateText(body.groupName),
        planning: !body.planning ? undefined : validateRegistrationPlanning(body.planning),
        performance: !body.performance ? undefined : validatePerformance(body.performance)
    });
}

export async function validateRegistrationPlanning(body: any): Promise<RegistrationPlanning> {
    return await validate<RegistrationPlanning>({
        planningId: validateObjectId(body.planningId).then(required),
        beginTrack: validateInteger(body.beginTrack, 0).then(required),
        endTrack: validateInteger(body.endTrack, 0).then(required),
    });
}

export async function validatePerformance(body: any): Promise<Performance> {
    return await validate<Performance>({
        state: validateIn<RunState>(runStates, body.state).then(required),
        time: validateNumber(body.time, 0)
    });
}
