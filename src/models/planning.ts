import {
    validate,
    validateInteger,
    required,
    validateDate, validateObjectId
} from "../validation/validation-utils";
import {ObjectID} from "bson";

export interface Time {
    hour: number;
    minute: number;
}

export function dailyMinutes(t: Time) {
    return t.hour * 60 + t.minute;
}

export interface Planning {
    registrationId: ObjectID;
    track: number;
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
        registrationId: validateObjectId(body.firstName).then(required),
        track: validateInteger(body.yearOfBirth, 0).then(required),
        startTime: validateTime(body.startTime).then(required),
        endTime: validateTime(body.endTime).then(required),
    });
}
