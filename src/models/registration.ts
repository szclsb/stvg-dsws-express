import {
    required,
    validate,
    validateObjectId,
} from "../utils/validation-utils";
import {ObjectId} from "bson";

export interface Registration {
    disciplineId: ObjectId,
    categoryId?: ObjectId,
    athleteId: ObjectId
}

export async function validateRegistration(body: any): Promise<Registration> {
    return await validate<Registration>({
        disciplineId: validateObjectId(body.disciplineId).then(required),
        categoryId: validateObjectId(body.categoryId),
        athleteId: validateObjectId(body.athleteId).then(required)
    });
}
