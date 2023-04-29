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

export interface StartNumber {
    athleteId: ObjectID;
    value: number;
}

export async function validateRegistration(body: any): Promise<Registration> {
    return await validate<Registration>({
        disciplineName: validateNumText(body.disciplineName).then(required),
        categoryName: validateNumText(body.categoryName),
        athleteIds: validateArray<ObjectID>(body?.map((athleteId: any) =>
            validateRegistration(athleteId))).then(required),
        groupName: validateText(body.groupName)
    });
}

export async function validateStartNumber(body: any): Promise<StartNumber> {
    return await validate<StartNumber>({
        athleteId: validateObjectId(body.athleteId).then(required),
        value: validateInteger(body.value).then(required)
    });
}
