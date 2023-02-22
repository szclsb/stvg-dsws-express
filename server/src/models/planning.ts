import {
    validate,
    validateInteger,
    required,
    validateDate, validateObjectId
} from "../utils/validation-utils";
import {ObjectID} from "bson";

export interface Planning {
    registrationId: ObjectID;
    track: number;
    startTime: Date;
    endTime: Date;
}

export async function validatePlanning(body: any): Promise<Planning> {
    return await validate<Planning>({
        registrationId: validateObjectId(body.firstName).then(required),
        track: validateInteger(body.yearOfBirth, 0).then(required),
        startTime: validateDate(body.startTime).then(required),
        endTime: validateDate(body.endTime).then(required),
    });
}
