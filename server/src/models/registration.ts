import {
    required,
    validate, validateObjectId,
    validateText,
} from "../utils/validation-utils";
import {ObjectID} from "bson";

export interface Registration {
    disciplineId: ObjectID,
    categoryName?: string,
    athleteId: ObjectID,
    groupName?: string,
}

export async function validateRegistration(body: any): Promise<Registration> {
    return await validate<Registration>({
        disciplineId: validateObjectId(body.disciplineId).then(required),
        categoryName: validateText(body.categoryName),
        athleteId: validateObjectId(body.athleteId).then(required),
        groupName: validateText(body.groupName)
    });
}
