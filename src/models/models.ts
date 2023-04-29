import {required, validate, validateInteger} from "../validation/validation-utils";

export type WithID<T> = T & {
    _id: string;
}

export type Validation<T> = {
    [Property in keyof T]: Promise<T[Property]>;
};

export interface LocalDate {
    year: number;
    month: number;
    day: number;
}

export interface LocalTime {
    hour: number;
    minute: number;
}

export function dailyMinutes(t: LocalTime): number {
    return t.hour * 60 + t.minute;
}

export async function validateLocalDate(body: any): Promise<LocalDate> {
    return await validate<LocalDate>({
        year: validateInteger(body.year, 1900, 2100).then(required),
        month: validateInteger(body.month, 1, 12).then(required),
        day: validateInteger(body.day, 1, 31).then(required)
    });
}

export async function validateLocalTime(body: any): Promise<LocalTime> {
    return await validate<LocalTime>({
        hour: validateInteger(body.hour, 0, 23).then(required),
        minute: validateInteger(body.minute, 0, 59).then(required)
    });
}
