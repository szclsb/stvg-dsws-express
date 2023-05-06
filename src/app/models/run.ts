import {
    validate,
    validateInteger,
    required,
    validateObjectId
} from "../validation/validation-utils";
import {ObjectID} from "bson";
import {LocalTime, validateLocalTime} from "./models";



export interface Planning {
    registrationId: ObjectID;
    plannedBeginTrack: number;
    plannedEndTrack: number;
    planningNumber: number,
    plannedStartTime: LocalTime;
    plannedEndTime: LocalTime;
}

export interface Recording {
    registrationId: ObjectID;
    time: number;
}

export async function validatePlanning(body: any): Promise<Planning> {
    return await validate<Planning>({
        registrationId: validateObjectId(body.registrationId).then(required),
        plannedBeginTrack: validateInteger(body.plannedBeginTrack, 0).then(required),
        plannedEndTrack: validateInteger(body.plannedEndTrack, 0).then(required),
        planningNumber: validateInteger(body.planningNumber, 0).then(required),
        plannedStartTime: validateLocalTime(body.plannedStartTime).then(required),
        plannedEndTime: validateLocalTime(body.plannedEndTime).then(required),
    });
}
