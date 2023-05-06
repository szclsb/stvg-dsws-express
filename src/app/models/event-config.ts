import {
    validate,
    validateInteger,
    required,
    validateText,
    validateArray,
    validateIn, validateNumText
} from "../validation/validation-utils";
import {LocalDate, validateLocalDate} from "./models";
import {Sex, sexes} from "./athlete";

export interface EventConfig {
    name: string;
    date: LocalDate;
    tracks: number;
    disciplines: Discipline[];
}

export interface Discipline {
    name: string;
    categories: Category[];
    minRegistrations?: number;
    maxRegistrations?: number;
}

export interface Category {
    name: string;
    distance: number;
    sex?: Sex;
    minAge?: number;
    maxAge?: number;
}

export async function validateEventConfig(body: any): Promise<EventConfig> {
    return await validate<EventConfig>({
        name: validateNumText(body.name).then(required),
        date: validateLocalDate(body.date).then(required),
        tracks: validateInteger(body.tracks, 0).then(required),
        disciplines: validateArray<Discipline>(body.disciplines?.map((discipline: any) =>
            validateDiscipline(discipline)), 1).then(required)
    });
}

export async function validateDiscipline(body: any): Promise<Discipline> {
    return await validate<Discipline>({
        name: validateNumText(body.name).then(required),
        categories: validateArray<Category>(body.categories?.map((cat: any) =>
            validate<Category>({
                name: validateNumText(cat.name).then(required),
                distance: validateInteger(cat.distance, 0).then(required),
                sex: validateIn<Sex>(sexes, cat.sex),
                minAge: validateInteger(cat.minAge, 0),
                maxAge: validateInteger(cat.maxAge, 0)
            })), 1).then(required),
        minRegistrations: validateInteger(body.minRegistrations, 0),
        maxRegistrations: validateInteger(body.maxRegistrations, 0)
    });
}
