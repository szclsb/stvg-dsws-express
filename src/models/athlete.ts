import {validate, validateIn, validateName, validateInteger, required} from "../utils/validation-utils";

export interface Athlete {
    firstName: string;
    lastName: string;
    sex: Sex;
    yearOfBirth: number;
}

const sexes = ["FEMALE", "MALE"] as const;
export type Sex = typeof sexes[number];

export async function validateAthlete(body: any): Promise<Athlete> {
    return await validate<Athlete>({
        firstName: validateName(body.firstName).then(required),
        lastName: validateName(body.lastName).then(required),
        sex: validateIn<Sex>(sexes, body.sex).then(required),
        yearOfBirth: validateInteger(body.yearOfBirth, 1900, 2023).then(required)
    });
}
