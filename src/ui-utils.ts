import {Sex} from "./models/athlete";

export function em(value: number): string {
    return value + "em";
}

export function seq(count: number): number[] {
    return new Array(count).fill(1).map((_, i) => i + 1)
}

export function pad(value: number, digits: number): string {
    return String(value).padStart(digits, '0')
}

export function displaySex(sex: Sex): string {
    return sex === "FEMALE" ? "W" : sex === "MALE" ? "M" : undefined;
}
