import {Sex, sexes} from "./athlete";
import {
    required,
    validate,
    validateArray,
    validateIn,
    validateInteger,
    validateString,
    validateText
} from "../validation/validation-utils";;

export interface Discipline {
    name: string,
    categories: Category[],
    minRegistrations?: number,
    maxRegistrations?: number
}

export interface Category {
    name: string;
    distance: number;
    sex?: Sex
    minAge?: number;
    maxAge?: number;
}

export async function validateDiscipline(body: any): Promise<Discipline> {
    return await validate<Discipline>({
        name: validateText(body.name).then(required),
        categories: validateArray<Category>(body.categories?.map((cat: any) => validate<Category>({
            name: validateText(cat.name).then(required),
            distance: validateInteger(cat.distance, 0).then(required),
            sex: validateIn<Sex>(sexes, cat.sex),
            minAge: validateInteger(cat.minAge, 0),
            maxAge: validateInteger(cat.maxAge, 0)
        })), 1).then(required),
        minRegistrations: validateInteger(body.minRegistrations, 0),
        maxRegistrations: validateInteger(body.maxRegistrations, 0)
    });
}
