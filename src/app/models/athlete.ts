import {validate, validateIn, validateString, validateInteger, required, validateText} from "../validation/validation-utils";

export interface Athlete {
    firstName: string;
    lastName: string;
    sex: Sex;
    yearOfBirth: number;
    startNumber?: number;
}

export const sexes = ["FEMALE", "MALE"] as const;
export type Sex = typeof sexes[number];

export async function validateAthlete(body: any): Promise<Athlete> {
    return await validate<Athlete>({
        firstName: validateText(body.firstName).then(required),
        lastName: validateText(body.lastName).then(required),
        sex: validateIn<Sex>(sexes, body.sex).then(required),
        yearOfBirth: validateInteger(body.yearOfBirth, 1900, 2023).then(required),
        startNumber: validateInteger(body.startNumber, 0, 500)
    });
}
