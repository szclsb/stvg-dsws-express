import {validate, validateIn, validateName, validateInteger} from "../utils/validation-utils";

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
        firstName: validateName(body.firstName),
        lastName: validateName(body.lastName),
        sex: validateIn<Sex>(body.sex, sexes),
        yearOfBirth: validateInteger(body.yearOfBirth, 1900, 2023)
    });
}
