import {Time} from "./planning";
import {Athlete, sexes} from "./athlete";

export type WithID<T> = T & {
    _id: string;
}

export type Validation<T> = {
    [Property in keyof T]: Promise<T[Property]>;
};

export const itemStates = ["CREATED", "EDITED", "DELETED", "IGNORE"] as const;
export type ItemState = typeof itemStates[number];
export interface Item<T> {
    state?: ItemState,
    content: T
}
