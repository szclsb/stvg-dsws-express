export type WithID<T> = T & {
    _id: string;
}

export type Validation<T> = {
    [Property in keyof T]: Promise<T[Property]>;
};
