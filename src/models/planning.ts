import {
    validate,
    validateInteger,
    required,
    validateDate, validateObjectId
} from "../validation/validation-utils";
import {ObjectID} from "bson";
import {pad} from "../ui-utils";

export interface Time {
    hour: number;
    minute: number;
}

export function dailyMinutes(t: Time): number {
    return t.hour * 60 + t.minute;
}

export function printTime(t?: Time): string | undefined {
    return !t ? undefined : `${pad(t.hour, 2)}:${pad(t.minute, 2)}`
}

export interface Planning {
    registrationId: ObjectID;
    beginTrack: number;
    endTrack: number;
    planningNumber: number,
    startTime: Time;
    endTime: Time;
}

export async function validateTime(body: any): Promise<Time> {
    return await validate<Time>({
        hour: validateInteger(body.hour, 0, 23).then(required),
        minute: validateInteger(body.minute, 0, 59).then(required)
    });
}

export async function validatePlanning(body: any): Promise<Planning> {
    return await validate<Planning>({
        registrationId: validateObjectId(body.registrationId).then(required),
        beginTrack: validateInteger(body.beginTrack, 0).then(required),
        endTrack: validateInteger(body.endTrack, 0).then(required),
        planningNumber: validateInteger(body.planningNumber, 0).then(required),
        startTime: validateTime(body.startTime).then(required),
        endTime: validateTime(body.endTime).then(required),
    });
}
