import {Validation, WithID} from "../models/models";
import {ValidationError} from "./validation-error";
import {DBRef, ObjectId} from "bson";

const stringChecker = new RegExp('^[A-Za-zÀ-ÿČčĎďĚěŇňŘřŠšŤťŮůŽžŐőŰűĞğİıŞş]+$');
const textChecker = new RegExp('^[A-Za-zÀ-ÿČčĎďĚěŇňŘřŠšŤťŮůŽžŐőŰűĞğİıŞş]+(\\s[A-Za-zÀ-ÿČčĎďĚěŇňŘřŠšŤťŮůŽžŐőŰűĞğİıŞş]+)*$');
const numTextChecker = new RegExp('^[0-9A-Za-zÀ-ÿČčĎďĚěŇňŘřŠšŤťŮůŽžŐőŰűĞğİıŞş]+(\\s[0-9A-Za-zÀ-ÿČčĎďĚěŇňŘřŠšŤťŮůŽžŐőŰűĞğİıŞş]+)*$');
const emailChecker = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');

export async function validateString(str: any): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        if (str === undefined || str === null) {
            resolve(undefined);
        } else if (typeof str === "string" && stringChecker.test(str as string)) {
            resolve(str.trim())
        } else {
            reject(`string '${str}' does not match`)
        }
    });
}

export async function validateText(text: any): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        if (text === undefined || text === null) {
            resolve(undefined);
        } else if (typeof text === "string" && textChecker.test(text as string)) {
            resolve(text.trim())
        } else {
            reject(`text '${text}' does not match`)
        }
    });
}

export async function validateNumText(text: any): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        if (text === undefined || text === null) {
            resolve(undefined);
        } else if (typeof text === "string" && numTextChecker.test(text as string)) {
            resolve(text.trim())
        } else {
            reject(`text '${text}' does not match`)
        }
    });
}

export async function validateEmail(email: any): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        if (email === undefined || email === null) {
            resolve(undefined);
        } else if (typeof email === "string" && emailChecker.test(email as string)) {
            resolve(email.trim())
        } else {
            reject(`email '${email}' does not match`)
        }
    });
}

export async function validateInteger(value: any, min?: number, max?: number): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
        if (value === undefined || value === null) {
            resolve(undefined);
        } else {
            const n = parseInt(value as string, 10);
            if (Number.isNaN(n)) {
                reject(`'${value}' is not an integer`);
            } else {
                if (!!min && n < min) {
                    reject(`${n} < ${min}`);
                }
                if (!!max && n > max) {
                    reject(`${n} > ${max}`);
                }
                resolve(n);
            }
        }
    });
}

export async function validateNumber(value?: any, min?: number, max?: number): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
        if (value === undefined || value === null) {
            resolve(undefined);
        } else {
            const n = parseFloat(value as string);
            if (Number.isNaN(n)) {
                reject(`'${value}' is not a number`);
            } else {
                if (!!min && n < min) {
                    reject(`${n} < ${min}`);
                }
                if (!!max && n > max) {
                    reject(`${n} > ${max}`);
                }
                resolve(n);
            }
        }
    });
}

// export async function validateDate(value?: any): Promise<Date | undefined> {
//     return new Promise((resolve, reject) => {
//         if (value === undefined || value === null) {
//             resolve(undefined);
//         } else {
//             const m = Date.parse(value as string);
//             if (Number.isNaN(m)) {
//                 reject(`'${value}' is not a date`);
//             } else {
//                 resolve(new Date(m));
//             }
//         }
//     });
// }

export async function validateObjectId(value?: any): Promise<ObjectId | undefined> {
    return new Promise((resolve, reject) => {
        if (value === undefined || value === null) {
            resolve(undefined);
        } else if (ObjectId.isValid(value)) {
            resolve(ObjectId.createFromHexString(value));
        } else {
            reject(`'${value}' is not an object id`);
        }
    });
}

export async function validateObjectIds(value?: any): Promise<ObjectId | ObjectId[] | undefined> {
    return new Promise((resolve, reject) => {
        if (value === undefined || value === null) {
            resolve(undefined);
        } else if (ObjectId.isValid(value)) {
            resolve(ObjectId.createFromHexString(value));
        } else if (Array.isArray(value)) {
            resolve(value.map(v => ObjectId.createFromHexString(v)));
        } else {
            reject(`'${value}' is not an object id`);
        }
    });
}

// export async function validateReference(collectionName: string, value?: any): Promise<DBRef | undefined> {
//     return new Promise((resolve, reject) => {
//         if (value === undefined || value === null) {
//             resolve(undefined);
//         } else if (ObjectId.isValid(value)) {
//             resolve(new DBRef(collectionName, ObjectId.createFromHexString(value)));
//         } else {
//             reject(`'${value}' is not an object id`);
//         }
//     });
// }


export async function validateIn<E>(values: any, value?: any): Promise<E | undefined> {
    return new Promise((resolve, reject) => {
        if (value === undefined || value === null) {
            resolve(undefined);
        } else if (values.some((key: E) => key === value)) {
            resolve(value as E)
        } else {
            reject(`'${value}' is not in [${values.join(", ")}]`)
        }
    });
}

export async function validateArray<E>(values?: Promise<E>[], minSize?: number, maxSize?: number): Promise<E[] | undefined> {
    if (values === undefined || values === null) {
        return Promise.resolve(undefined);
    } else if (!Array.isArray(values)) {
        return Promise.reject(`is not an array`);
    } else if (!!minSize && values.length < minSize) {
        return Promise.reject(`must have at least ${minSize} elements`)
    } else if (!!maxSize && values.length > maxSize) {
        return Promise.reject(`must have at most ${maxSize} elements`)
    }
    return Promise.all(values);
}

export async function required<T>(value: T | undefined): Promise<T> {
    return new Promise(async (resolve, reject) => {
        if (value === undefined || value === null) {
            reject("is required");
        } else {
            resolve(value);
        }
    })
}

export async function validate<T>(validation: Validation<T>): Promise<T> {
    const errors: Record<string, any> = {};
    const result: Record<string, any> = {};
    for (const property in validation) {
        if (validation.hasOwnProperty(property)) {
            try {
                result[property] = await validation[property];
            } catch (err: any) {
                errors[property] = err
            }
        }
    }
    if (Object.keys(errors).length > 0) {
        throw new ValidationError(errors)
    }
    return result as T;
}


export function extendWithId<T>(validation: (body?: any) => Promise<T>): (body?: any) => Promise<WithID<T>> {
    return async (body?: any) => {
        const t: WithID<T> = await validation(body);
        t._id = await validateObjectId(body?._id);
        return t;
    };
}

export function extendArray<T>(validation: (body?: any) => Promise<T>, minSize?: number, maxSize?: number): (body?: any) => Promise<T[]> {
    return async (body?: any) => {
        if (body === undefined || body === null) {
            return Promise.resolve(undefined);
        } else if (!Array.isArray(body)) {
            return Promise.reject(`is not an array`);
        } else if (!!minSize && body.length < minSize) {
            return Promise.reject(`must have at least ${minSize} elements`)
        } else if (!!maxSize && body.length > maxSize) {
            return Promise.reject(`must have at most ${maxSize} elements`)
        }
        return Promise.all(body.map(x => validation(x)));
    };
}
