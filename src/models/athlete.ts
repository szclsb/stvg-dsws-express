export interface Athlete {
    firstName: string;
    lastName: string;
    sex: Sex;
    yearOfBirth: number;
}

export enum Sex {
    FEMALE,
    MALE
}
