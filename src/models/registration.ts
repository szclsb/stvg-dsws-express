import {
    required,
    validate,
    validateReference,
    validateString,
} from "../utils/validation-utils";
import {DBRef} from "bson";
import {collectionName as disciplineCollection} from "../routes/discipline-route";
import {collectionName as athleteCollection} from "../routes/athlete-route";

export interface Registration {
    disciplineId: DBRef,
    categoryName?: string,
    athleteId: DBRef
}

export async function validateRegistration(body: any): Promise<Registration> {
    return await validate<Registration>({
        disciplineId: validateReference(disciplineCollection, body.disciplineId).then(required),
        categoryName: validateString(body.categoryName),
        athleteId: validateReference(athleteCollection, body.athleteId).then(required)
    });
}
