import {
    required,
    validate, validateObjectId,
    validateReference,
    validateText,
} from "../utils/validation-utils";
import {DBRef, ObjectID} from "bson";
import {collectionName as disciplineCollection} from "../routes/discipline-route";
import {collectionName as athleteCollection} from "../routes/athlete-route";

export interface Registration {
    disciplineId: ObjectID,
    categoryName?: string,
    athleteId: ObjectID
}

export async function validateRegistration(body: any): Promise<Registration> {
    return await validate<Registration>({
        disciplineId: validateObjectId(body.disciplineId).then(required),
        categoryName: validateText(body.categoryName),
        athleteId: validateObjectId(body.athleteId).then(required)
    });
}
