import {
    required,
    validate, validateArray, validateObjectId, validateObjectIds,
    validateText,
} from "../validation/validation-utils";
import {ObjectID} from "bson";

export interface Registration {
    disciplineId: ObjectID;
    categoryName?: string;
    athleteIds: ObjectID[];
    groupName?: string;
}

export async function validateRegistration(body: any): Promise<Registration> {
    return await validate<Registration>({
        disciplineId: validateObjectId(body.disciplineId).then(required),
        categoryName: validateText(body.categoryName),
        athleteIds: validateArray<ObjectID>(body?.map((athleteId: any) =>
            validateRegistration(athleteId))).then(required),
        groupName: validateText(body.groupName)
    });
}
