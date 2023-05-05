import {
    required,
    validate, validateArray, validateInteger, validateNumText, validateObjectId, validateObjectIds,
    validateText,
} from "../validation/validation-utils";
import {ObjectID} from "bson";

export interface Registration {
    disciplineName: string;
    categoryName?: string;
    athleteIds: ObjectID[];
    groupName?: string;
}

export async function validateRegistration(body: any): Promise<Registration> {
    return await validate<Registration>({
        disciplineName: validateNumText(body.disciplineName).then(required),
        categoryName: validateNumText(body.categoryName),
        athleteIds: validateArray<ObjectID>(body.athleteIds?.map((athleteId: any) =>
            validateObjectId(athleteId))).then(required),
        groupName: validateText(body.groupName)
    });
}
