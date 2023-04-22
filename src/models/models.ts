import {Time} from "./planning";
import {Athlete} from "./athlete";

export type WithID<T> = T & {
    _id: string;
}

export type Validation<T> = {
    [Property in keyof T]: Promise<T[Property]>;
};
